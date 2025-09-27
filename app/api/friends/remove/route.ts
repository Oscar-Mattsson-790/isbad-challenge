import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import admin from "@/lib/supabase-admin";
import type { Database } from "@/types/supabase";

export async function POST(req: NextRequest) {
  try {
    const { friendId } = (await req.json()) as { friendId?: string };
    if (!friendId) {
      return NextResponse.json({ error: "Missing friendId" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const res = NextResponse.json({ ok: true });
    const supa = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookieStore.get(name)?.value,
          set: (name: string, value: string, options: CookieOptions) => {
            res.cookies.set(name, value, options);
          },
          remove: (name: string, options: CookieOptions) => {
            res.cookies.set(name, "", { ...options, maxAge: 0 });
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

    const { error: delErr } = await admin
      .from("friends")
      .delete()
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`
      );
    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 500 });
    }

    const { error: delChErr } = await admin
      .from("friend_challenges")
      .delete()
      .or(
        `and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`
      );
    if (delChErr) {
      return NextResponse.json({ error: delChErr.message }, { status: 500 });
    }

    await admin
      .from("profiles")
      .update({ challenge_active: false })
      .or(`id.eq.${user.id},id.eq.${friendId}`);

    return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
