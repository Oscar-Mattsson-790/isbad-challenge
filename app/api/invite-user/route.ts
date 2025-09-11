import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import admin from "@/lib/supabase-admin";
import type { Database } from "@/types/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, challengeLength } = (await req.json()) as {
      email?: string;
      challengeLength?: number;
    };
    if (!email)
      return NextResponse.json({ error: "Missing email" }, { status: 400 });

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
          set: () => {},
          remove: () => {},
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

    // Finns mottagaren redan?
    const { data: existing, error: existErr } = await admin
      .from("profiles")
      .select("id, full_name, email")
      .eq("email", email)
      .maybeSingle();
    if (existErr) {
      return NextResponse.json({ error: existErr.message }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const inviteQuery = `inviter=${encodeURIComponent(user.id)}&challenge_length=${encodeURIComponent(
      cl
    )}`;

    if (existing?.id) {
      // 1) Vänkoppling (idempotent)
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
          if (insErr)
            return NextResponse.json(
              { error: insErr.message },
              { status: 500 }
            );
        }
      }

      // 2) Skicka MAGIC LINK (Supabase skickar mail med din Magic Link-template)
      const redirectTo = `${baseUrl}/set-password?skip_pw=1&${inviteQuery}`;

      // Viktigt: använd en client som får skicka OTP (service role funkar här)
      const { error: otpErr } = await admin.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      });
      if (otpErr)
        return NextResponse.json({ error: otpErr.message }, { status: 500 });

      return NextResponse.json({
        success: true,
        existing: true,
        note: "Existing user: friendship created and magic link email sent.",
      });
    }

    // === Ny användare: skicka Supabase INVITE (använder din Invite-template) ===
    const { data: inviterProfile } = await admin
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .maybeSingle();

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
