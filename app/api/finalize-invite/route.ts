import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import admin from "@/lib/supabase-admin";
import type { Database } from "@/types/supabase";

const ALLOWED = new Set([10, 15, 30, 50, 100, 365]);

export async function POST(req: NextRequest) {
  try {
    const inviter = req.nextUrl.searchParams.get("inviter");
    const challengeParam = req.nextUrl.searchParams.get("challenge_length");

    if (!inviter) {
      return NextResponse.json({ error: "Missing inviter" }, { status: 400 });
    }

    const chosen = Number(challengeParam ?? 30);
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
    } = await supa.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pairs = [
      { user_id: inviter, friend_id: user.id, status: "accepted" },
      { user_id: user.id, friend_id: inviter, status: "accepted" },
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
        challenge_length: chosen,
        challenge_started_at: today,
        challenge_active: true,
      })
      .eq("id", inviter);

    await admin
      .from("profiles")
      .update({
        challenge_length: chosen,
        challenge_started_at: today,
        challenge_active: true,
      })
      .eq("id", user.id);

    await admin
      .from("friend_challenges")
      .update({ active: false })
      .or(
        `and(user_id.eq.${inviter},friend_id.eq.${user.id},active.eq.true),and(user_id.eq.${user.id},friend_id.eq.${inviter},active.eq.true)`
      );

    const freshPairs = [
      {
        user_id: inviter,
        friend_id: user.id,
        started_at: today,
        length: chosen,
        active: true,
      },
      {
        user_id: user.id,
        friend_id: inviter,
        started_at: today,
        length: chosen,
        active: true,
      },
    ];

    const { error: fcErr } = await admin
      .from("friend_challenges")
      .insert(freshPairs);
    if (fcErr) {
      return NextResponse.json({ error: fcErr.message }, { status: 500 });
    }

    await admin
      .from("invites")
      .update({ used: true, used_at: new Date().toISOString() })
      .eq("email", user.email!)
      .eq("inviter_id", inviter)
      .eq("used", false);

    return NextResponse.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
