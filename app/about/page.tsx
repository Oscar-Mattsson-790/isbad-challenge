"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSupabase } from "@/components/supabase-provider";
import HowItWorks from "@/components/how-it-works";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LayoutWrapper from "@/components/layout-wrapper";
import Image from "next/image";
import { Camera } from "lucide-react";

export default function AboutPage() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) router.push("/dashboard");
    else router.push("/signup");
  };

  return (
    <LayoutWrapper>
      <div className="container pt-20 py-10 max-w-5xl mx-auto text-white px-5">
        <div className="rounded-xl bg-[#2B2B29] border border-white/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-6">
                Step into the Cold and Grow
              </h1>
              <div className="space-y-5">
                <p>
                  ISBAD Challenge is a community-driven movement for those who
                  want to build resilience, discipline, and health through
                  consistent cold exposure. Our app lets you track your
                  progress, connect with others, and stay motivated on your ice
                  bath journey.
                </p>
                <p>
                  Whether you&apos;re a beginner or an experienced cold plunger,
                  our tools help you stay committed and document your
                  experiences. Join us and let&apos;s build a better future for
                  ourselves and future generations.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={handleStart}
                    className="bg-[#157FBF] hover:bg-[#115F93] text-white"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Loading…" : "Get started"}
                  </Button>

                  <Link
                    href="https://www.instagram.com/isbad.se/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-white/15 px-4 py-2.5 text-sm hover:bg-white/10"
                    aria-label="Open ISBAD on Instagram"
                  >
                    <Camera className="h-5 w-5 text-[#157FBF]" />
                    <span>@isbad.se</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative h-[260px] sm:h-[360px] md:h-[420px] lg:h-full min-h-[260px]">
              <Image
                src="/images/Man badar i mössa i en isbad Premium med skvätt vatten.jpg"
                alt="Cold plunge in an ISBAD tub"
                fill
                className="object-cover"
                sizes="(min-width:1024px) 50vw, 100vw"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <HowItWorks />
        </div>

        <div className="text-center text-sm text-white/60 mt-12">
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
