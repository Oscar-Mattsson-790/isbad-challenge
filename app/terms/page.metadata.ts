import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - ISBAD Challenge",
  description:
    "Read our terms of service for the ISBAD Challenge and how we handle your information.",
  alternates: { canonical: "/terms" },
};

export const dynamic = "force-static";
export const revalidate = 86400;
