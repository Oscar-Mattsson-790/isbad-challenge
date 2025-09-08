// app/api/invite-user/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import admin from "@/lib/supabase-admin";
import type { Database } from "@/types/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email)
      return NextResponse.json({ error: "Missing email" }, { status: 400 });

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

    // Who is inviting?
    const {
      data: { user },
      error: userErr,
    } = await supa.auth.getUser();
    if (userErr || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If the invitee already has a profile → make friends immediately
    const { data: existing, error: existErr } = await admin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (existErr)
      return NextResponse.json({ error: existErr.message }, { status: 500 });

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
      return NextResponse.json({
        success: true,
        note: "User already existed; friendship created.",
      });
    }

    // 👉 Send Supabase invite that lands directly on /set-password
    const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/set-password?inviter=${user.id}`;

    const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(
      email,
      { redirectTo }
    );
    if (inviteErr)
      return NextResponse.json({ error: inviteErr.message }, { status: 500 });

    // Save pending invite
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
