import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - ISBAD Challenge",
  description:
    "Read about how ISBAD Challenge handles and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export const dynamic = "force-static";
export const revalidate = 86400;
