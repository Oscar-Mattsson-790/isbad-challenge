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
          set: (_name: string, _value: string, _options: CookieOptions) => {
            void _name;
            void _value;
            void _options;
          },
          remove: (_name: string, _options: CookieOptions) => {
            void _name;
            void _options;
          },
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

    const { data: existing, error: existErr } = await admin
      .from("profiles")
      .select("id, full_name, email")
      .eq("email", email)
      .maybeSingle();

    if (existErr) {
      return NextResponse.json({ error: existErr.message }, { status: 500 });
    }

    const { data: inviterProfile } = await admin
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .maybeSingle();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const inviteQuery = `inviter=${encodeURIComponent(
      user.id
    )}&challenge_length=${encodeURIComponent(cl)}`;

    if (existing?.id) {
      const pairs = [
        { user_id: user.id, friend_id: existing.id, status: "accepted" },
        { user_id: existing.id, friend_id: user.id, status: "accepted" },
      ];
      for (const r of pairs) {
        const { data: f } = await admin
          .from("friends")
          .select("id")
          .eq("user_id", r.user_id)
          .eq("friend_id", r.friend_id)
          .maybeSingle();
        if (!f) {
          const { error: insErr } = await admin.from("friends").insert(r);
          if (insErr) {
            return NextResponse.json(
              { error: insErr.message },
              { status: 500 }
            );
          }
        }
      }

      await admin.auth.admin.updateUserById(existing.id, {
        user_metadata: {
          inviter_id: user.id,
          inviter_email: inviterProfile?.email ?? user.email,
          inviter_name: inviterProfile?.full_name ?? null,
          challenge_length: cl,
        },
      });

      const redirectTo = `${baseUrl}/set-password?skip_pw=1&${inviteQuery}`;
      const { error: otpErr } = await admin.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (otpErr) {
        return NextResponse.json({ error: otpErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        existing: true,
        note: "Existing user: metadata set, friendship created, and Magic Link sent.",
      });
    }

    const redirectTo = `${baseUrl}/set-password?${inviteQuery}`;
    const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
      email,
      {
        redirectTo,
        data: {
          inviter_id: user.id,
          inviter_email: inviterProfile?.email ?? user.email,
          inviter_name: inviterProfile?.full_name ?? null,
          challenge_length: cl,
        },
      }
    );
    if (inviteErr) {
      return NextResponse.json({ error: inviteErr.message }, { status: 500 });
    }

    const { error: invErr } = await admin.from("invites").insert({
      inviter_id: user.id,
      email,
      used: false,
    });
    if (invErr) {
      return NextResponse.json({ error: invErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, existing: false });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
