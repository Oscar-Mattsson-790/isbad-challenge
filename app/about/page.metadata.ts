import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About ISBAD Challenge",
  description:
    "Learn about the ISBAD Challenge, our mission, and our community.",
  alternates: { canonical: "/about" },
};

export const dynamic = "force-static";
export const revalidate = 86400;
