import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import admin from "@/lib/supabase-admin";
import type { Database } from "@/types/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      friendId?: string;
      length?: number;
      force?: boolean;
    };

    const friendId = body.friendId;
    const length = Number(body.length);
    const force = !!body.force;

    if (!friendId || !Number.isFinite(length) || length <= 0) {
      return NextResponse.json(
        { error: "Missing/invalid friendId or length" },
        { status: 400 }
      );
    }

    // Hämta inloggad användare (via cookies/SSR client)
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
    if (userErr || !user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Läs profiler
    const { data: me, error: meErr } = await admin
      .from("profiles")
      .select("id, challenge_active, challenge_started_at, challenge_length")
      .eq("id", user.id)
      .maybeSingle();
    if (meErr)
      return NextResponse.json({ error: meErr.message }, { status: 500 });

    const { data: friend, error: frErr } = await admin
      .from("profiles")
      .select("id, challenge_active, challenge_started_at, challenge_length")
      .eq("id", friendId)
      .maybeSingle();
    if (frErr)
      return NextResponse.json({ error: frErr.message }, { status: 500 });
    if (!friend)
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });

    // Säkerställ vänrelation (idempotent)
    const pairs = [
      { user_id: user.id, friend_id: friendId, status: "accepted" },
      { user_id: friendId, friend_id: user.id, status: "accepted" },
    ];
    for (const r of pairs) {
      const { data: exists } = await admin
        .from("friends")
        .select("id")
        .eq("user_id", r.user_id)
        .eq("friend_id", r.friend_id)
        .maybeSingle();
      if (!exists) {
        const { error: insErr } = await admin.from("friends").insert(r);
        if (insErr)
          return NextResponse.json({ error: insErr.message }, { status: 500 });
      }
    }

    // Konflikt?
    const conflict = !!me?.challenge_active || !!friend.challenge_active;
    if (conflict && !force) {
      // ✅ Ingen 409 – bara en flagga
      return NextResponse.json({
        needsReset: true,
        conflict: {
          you: !!me?.challenge_active,
          friend: !!friend.challenge_active,
        },
      });
    }

    // Starta/Reseta båda
    const today = new Date().toISOString().slice(0, 10);
    const updates = {
      challenge_length: length,
      challenge_started_at: today,
      challenge_active: true,
    };

    const { error: upMe } = await admin
      .from("profiles")
      .update(updates)
      .eq("id", user.id);
    if (upMe)
      return NextResponse.json({ error: upMe.message }, { status: 500 });

    const { error: upFr } = await admin
      .from("profiles")
      .update(updates)
      .eq("id", friendId);
    if (upFr)
      return NextResponse.json({ error: upFr.message }, { status: 500 });

    return NextResponse.json({ ok: true, startedAt: today, length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
