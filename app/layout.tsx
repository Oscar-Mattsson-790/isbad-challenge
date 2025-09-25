import type React from "react";
import { Poppins } from "next/font/google";
import { SupabaseProvider } from "@/components/supabase-provider";
import { ThemeProvider } from "@/components/theme-provider";
import AppLayout from "@/components/layout/app-layout";
import GAProvider from "./ga-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: {
    default: "ISBAD Challenge",
    template: "%s | ISBAD Challenge",
  },
  description:
    "Challenge yourself and your friends to a consistent cold exposure. Track your progress, document your experiences and feel the benefits of cold water.",
  metadataBase: new URL("https://isbad.com"),
  openGraph: {
    title: "ISBAD Challenge",
    description:
      "Track your cold exposure journey with friends and build resilience together.",
    url: "https://isbad.com",
    siteName: "ISBAD Challenge",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ISBAD Challenge",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@IsbadSe",
    creator: "@IsbadSe",
    title: "ISBAD Challenge",
    description: "Join the ISBAD Challenge and grow through cold exposure.",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans`}>
        {/* Google Analytics */}
        <GAProvider />

        {/* Speeed Insights */}
        <SpeedInsights />

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
