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

    if (session?.user) {
      router.push("/dashboard");
    } else {
      router.push("/signup");
    }
  };

  return (
    <LayoutWrapper>
      <div className="max-w-screen-2xl flex flex-col pt-10 px-4 sm:px-0">
        <div className="flex flex-col lg:flex-row w-full h-full rounded-md overflow-hidden gap-20 items-center">
          <div className="w-full lg:w-1/2 h-full flex flex-col">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold">
                Step into the Cold – <br /> and Grow
              </h1>
              <p>
                ISBAD Challenge is a community-driven movement for those who
                want to build resilience, discipline, and health through
                consistent cold exposure. Our app allows you to track your
                progress, connect with others, and stay motivated on your ice
                bath journey.
              </p>
              <p>
                Whether you&apos;re a beginner or an experienced cold plunger,
                our tools help you stay committed and document your experiences.
                Join us on this transformative journey and let&apos;s build a
                better future for ourselves and future generations.
              </p>
            </div>
            <Button
              onClick={handleStart}
              className="mt-6 w-full sm:w-auto bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
              size="lg"
              disabled={loading}
            >
              Get started
            </Button>
            <div className="mt-10">
              <p>Follow us on instagram:</p>
              <p>
                <Link
                  href="https://www.instagram.com/isbad.se/"
                  className="flex gap-1 items-center"
                >
                  @isbad.se <Camera className="h-6 w-6 text-[#157FBF]" />
                </Link>
              </p>
            </div>
          </div>

          <div className="w-full h-[350px] md:h-[500px] lg:w-[650px] lg:h-[500px] rounded-md overflow-hidden relative">
            <Image
              src="/images/Man badar i mössa i en isbad Premium med skvätt vatten.jpg"
              alt="Hero"
              fill
              className="object-cover rounded-md"
            />
          </div>
        </div>

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
