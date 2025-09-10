import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import admin from "@/lib/supabase-admin";
import type { Database } from "@/types/supabase";

const ALLOWED = new Set([10, 15, 30, 50, 100, 365]);

export async function POST(req: NextRequest) {
  try {
    const { email, challengeLength } = (await req.json()) as {
      email?: string;
      challengeLength?: number;
    };
    if (!email)
      return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const chosen = Number(challengeLength ?? 30);
    if (!ALLOWED.has(chosen)) {
      return NextResponse.json(
        { error: "Invalid challenge length" },
        { status: 400 }
      );
    }

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

    const { data: existing, error: existErr } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existErr)
      return NextResponse.json({ error: existErr.message }, { status: 500 });

    const today = new Date().toISOString().slice(0, 10);

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
          if (insErr)
            return NextResponse.json(
              { error: insErr.message },
              { status: 500 }
            );
        }
      }

      const { error: up1 } = await admin
        .from("profiles")
        .update({
          challenge_length: chosen,
          challenge_started_at: today,
          challenge_active: true,
        })
        .eq("id", user.id);
      if (up1)
        return NextResponse.json({ error: up1.message }, { status: 500 });

      const { error: up2 } = await admin
        .from("profiles")
        .update({
          challenge_length: chosen,
          challenge_started_at: today,
          challenge_active: true,
        })
        .eq("id", existing.id);
      if (up2)
        return NextResponse.json({ error: up2.message }, { status: 500 });

      return NextResponse.json({
        success: true,
        note: "User existed; friendship created and challenge started for both.",
      });
    }

    const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/set-password?inviter=${user.id}&challenge_length=${chosen}`;

    const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
      email,
      { redirectTo }
    );
    if (inviteErr)
      return NextResponse.json({ error: inviteErr.message }, { status: 500 });

    const { error: invErr } = await admin.from("invites").insert({
      inviter_id: user.id,
      email,
      used: false,
    });
    if (invErr)
      return NextResponse.json({ error: invErr.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
