import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import admin from "@/lib/supabase-admin";
import type { Database } from "@/types/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, challengeLength } = (await req.json()) as {
      email?: string;
      challengeLength?: number;
    };

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const cl = Number.isFinite(Number(challengeLength))
      ? Number(challengeLength)
      : 30;

    const cookieStore = await cookies();
    const supa = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          set: (_name: string, _value: string, _options: CookieOptions) => {},
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          remove: (_name: string, _options: CookieOptions) => {},
        },
      }
    );

    const {
      data: { user },
      error: userErr,
    } = await supa.auth.getUser();

    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    let page = 1;
    let userByEmail: any = null;
    while (!userByEmail) {
      const { data: pageData } = await admin.auth.admin.listUsers({
        page,
        perPage: 50,
      });
      if (!pageData?.users?.length) break;
      userByEmail = pageData.users.find((u) => u.email === email) || null;
      if (userByEmail) break;
      page++;
    }

    const alreadyInAuth = !!userByEmail;

    const { data: inviterProfile } = await admin
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .maybeSingle();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const inviteQuery = `inviter=${encodeURIComponent(
      user.id
    )}&challenge_length=${encodeURIComponent(cl)}`;

    if (existingProfile?.id || alreadyInAuth) {
      const targetId = existingProfile?.id ?? userByEmail!.id;

      const pairs = [
        { user_id: user.id, friend_id: targetId, status: "accepted" },
        { user_id: targetId, friend_id: user.id, status: "accepted" },
      ];
      for (const r of pairs) {
        const { data: f } = await admin
          .from("friends")
          .select("id")
          .eq("user_id", r.user_id)
          .eq("friend_id", r.friend_id)
          .maybeSingle();
        if (!f) {
          await admin.from("friends").insert(r);
        }
      }

      const today = new Date().toISOString().slice(0, 10);
      await admin
        .from("profiles")
        .update({
          challenge_length: cl,
          challenge_started_at: today,
          challenge_active: true,
        })
        .in("id", [user.id, targetId]);

      await admin
        .from("friend_challenges")
        .update({ active: false })
        .or(
          `and(user_id.eq.${user.id},friend_id.eq.${targetId},active.eq.true),
           and(user_id.eq.${targetId},friend_id.eq.${user.id},active.eq.true)`
        );

      const freshPairs = [
        {
          user_id: user.id,
          friend_id: targetId,
          started_at: today,
          length: cl,
          active: true,
        },
        {
          user_id: targetId,
          friend_id: user.id,
          started_at: today,
          length: cl,
          active: true,
        },
      ];
      await admin.from("friend_challenges").insert(freshPairs);

      const redirectTo = `${baseUrl}/dashboard?${inviteQuery}`;
      await admin.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      return NextResponse.json({
        success: true,
        existing: true,
        note: "Existing user: friendship + active challenge created, Magic Link sent.",
      });
    }

    const redirectTo = `${baseUrl}/set-password?${inviteQuery}`;
    await admin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: {
        inviter_id: user.id,
        inviter_email: inviterProfile?.email ?? user.email,
        inviter_name: inviterProfile?.full_name ?? null,
        challenge_length: cl.toString(),
      },
    });

    await admin.from("invites").insert({
      inviter_id: user.id,
      email,
      used: false,
    });

    return NextResponse.json({ success: true, existing: false });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
