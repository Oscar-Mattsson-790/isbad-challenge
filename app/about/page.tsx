"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import HowItWorks from "@/components/how-it-works";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LayoutWrapper from "@/components/layout-wrapper";

export default function AboutPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  return (
    <LayoutWrapper>
      <div className="max-w-3xl mx-auto space-y-6 pt-10 px-5">
        <h1 className="text-4xl font-bold">Step Into the Cold – and Grow</h1>
        <p>
          ISBAD Challenge is a community-driven movement for those who want to
          build resilience, discipline, and health through consistent cold
          exposure. Our app allows you to track your progress, connect with
          others, and stay motivated on your ice bath journey.
        </p>
        <p>
          Whether you&apos;re a beginner or an experienced cold plunger, our
          tools help you stay committed and document your experiences. Join us
          on this transformative journey and let&apos;s build a better future
          for ourselves and future generations.
        </p>

        <Button
          onClick={handleStart}
          className="w-full sm:w-auto bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
          size="lg"
          disabled={loading}
        >
          Get started
        </Button>

        <HowItWorks />

        <div className="text-center text-sm text-gray-400 mt-12">
          <Link href="/privacy" className="hover:underline mr-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </LayoutWrapper>
  );
}
