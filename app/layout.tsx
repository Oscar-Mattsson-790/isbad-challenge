import type React from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import NovuInbox from "@/components/inbox/NovuInbox";

import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { SupabaseProvider } from "@/components/supabase-provider";
import StickyWrapper from "@/components/sticky-wrapper";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "ISBAD Challenge - 30-Day Challenge",
  description:
    "Challenge yourself with 30 days of ice baths and track your progress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <NovuInbox />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 bg-[#242422] pb-[64px]">{children}</main>
              <footer className="pb-[75px] bg-[#242422] border-none">
                <div className="container flex flex-col items-center justify-center gap-4">
                  <p className="text-center text-sm text-white">
                    &copy; {new Date().getFullYear()} All rights reserved
                    <br />
                    ISBAD Challenge – isbad.com <br />{" "}
                    <Link
                      href="https://www.isbad.se"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Powered by ISBAD.se
                    </Link>
                  </p>
                </div>
              </footer>
              <StickyWrapper />
            </div>
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
