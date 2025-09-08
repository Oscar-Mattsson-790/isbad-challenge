// app/auth/callback/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import admin from "@/lib/supabase-admin";
import type { Database } from "@/types/supabase";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/dashboard";
  const inviter = url.searchParams.get("inviter");

  const finalRedirect = `${process.env.NEXT_PUBLIC_BASE_URL}${next}`;
  const res = NextResponse.redirect(finalRedirect);

  const cookieStore = await cookies();

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

  if (code) await supa.auth.exchangeCodeForSession(code);

  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);

  try {
    if (inviter) {
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
        if (!f) await admin.from("friends").insert(r);
      }

      await admin
        .from("invites")
        .update({ used: true, used_at: new Date().toISOString() })
        .eq("email", user.email!)
        .eq("inviter_id", inviter)
        .eq("used", false);
    }
  } catch (e) {
    console.error("Invite linking failed:", e);
  }

  return res;
}
