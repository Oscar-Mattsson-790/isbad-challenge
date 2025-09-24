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

    const { data: friend, error: frErr } = await admin
      .from("profiles")
      .select("id")
      .eq("id", friendId)
      .maybeSingle();
    if (frErr)
      return NextResponse.json({ error: frErr.message }, { status: 500 });
    if (!friend)
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });

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

    const { data: mineActive } = await admin
      .from("friend_challenges")
      .select("id")
      .eq("user_id", user.id)
      .eq("friend_id", friendId)
      .eq("active", true)
      .maybeSingle();

    const { data: theirsActive } = await admin
      .from("friend_challenges")
      .select("id")
      .eq("user_id", friendId)
      .eq("friend_id", user.id)
      .eq("active", true)
      .maybeSingle();

    const conflict = !!mineActive || !!theirsActive;
    if (conflict && !force) {
      return NextResponse.json({
        needsReset: true,
      });
    }

    const today = new Date().toISOString().slice(0, 10);

    await admin
      .from("friend_challenges")
      .update({ active: false })
      .eq("user_id", user.id)
      .eq("friend_id", friendId)
      .eq("active", true);

    await admin
      .from("friend_challenges")
      .update({ active: false })
      .eq("user_id", friendId)
      .eq("friend_id", user.id)
      .eq("active", true);

    const rows = [
      {
        user_id: user.id,
        friend_id: friendId,
        started_at: today,
        length,
        active: true,
      },
      {
        user_id: friendId,
        friend_id: user.id,
        started_at: today,
        length,
        active: true,
      },
    ];
    const { error: insErr } = await admin
      .from("friend_challenges")
      .insert(rows);
    if (insErr)
      return NextResponse.json({ error: insErr.message }, { status: 500 });

    return NextResponse.json({ ok: true, startedAt: today, length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
