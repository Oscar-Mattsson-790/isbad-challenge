"use client";

import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DesktopNav({ session }: { session: any }) {
  return (
    <nav className="hidden md:flex gap-6">
      <Link
        href="/"
        className="text-sm font-medium text-white hover:text-[#157FBF]"
      >
        Home
      </Link>
      <Link
        href="/about"
        className="text-sm font-medium text-white hover:text-[#157FBF]"
      >
        About
      </Link>
      {session && (
        <>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-white hover:text-[#157FBF]"
          >
            My Challenge
          </Link>
          <Link
            href="/scoreboard"
            className="text-sm font-medium text-white hover:text-[#157FBF]"
          >
            Top ice bathers
          </Link>
        </>
      )}
      <Link
        href="/contact"
        className="text-sm font-medium text-white hover:text-[#157FBF]"
      >
        Contact
      </Link>
    </nav>
  );
}
