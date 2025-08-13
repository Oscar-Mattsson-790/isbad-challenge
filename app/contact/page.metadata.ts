import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - ISBAD Challenge",
  description:
    "Contact the ISBAD Challenge team for questions, support, or collaboration opportunities.",
  alternates: { canonical: "/contact" },
};

export const dynamic = "force-static";
export const revalidate = 86400;
