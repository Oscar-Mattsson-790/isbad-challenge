import type React from "react";
import { Poppins } from "next/font/google";
import { SupabaseProvider } from "@/components/supabase-provider";
import { ThemeProvider } from "@/components/theme-provider";
import AppLayout from "@/components/layout/app-layout";

import "./globals.css";

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
}: {
  children: React.ReactNode;
}) {
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
            <AppLayout>{children}</AppLayout>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
