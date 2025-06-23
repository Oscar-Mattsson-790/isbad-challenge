"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import FeaturesGrid from "@/components/features-grid";
import { ChevronRight } from "lucide-react";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStartChallenge = async () => {
    setIsLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      router.push("/dashboard");
    } else {
      router.push("/signup"); // eller "/login" om du föredrar det
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section with background video */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center px-4 sm:px-6">
        <video
          src="/videos/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />

        {/* Hero Content */}
        <div className="relative z-20 container mx-auto flex flex-col items-center text-center gap-6 sm:gap-10">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              ISBAD Challenge
            </h1>
            <div>
              <p className="max-w-[700px] text-white text-base sm:text-lg md:text-xl">
                Challenge yourself and your friends to a consistent ice bath.
              </p>
              <p className="max-w-[700px] text-white text-base sm:text-lg md:text-xl">
                Track your progress, document your experiences and feel the
                benefits of cold water.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleStartChallenge}
              variant="whiteShadow"
              size="lg"
              disabled={isLoading}
            >
              Start your challenge <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-black hover:text-white"
            >
              <Link href="https://isbad.se/artiklar/">
                Read more about the benefits
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              How does it work?
            </h2>
            <p className="mx-auto max-w-[700px] text-black">
              Follow your ice bath challenge with our smart tools and features.
            </p>
          </div>
          <FeaturesGrid />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#242422] py-16 md:py-24 px-4">
        <div className="container space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              What our users say
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#242422] p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm sm:text-base">
                      &quot;I&apos;ve never felt so energized and focused as
                      after completing the ISBAD challenge. My sleep quality has
                      improved significantly!&quot;
                    </p>
                    <div>
                      <p className="font-medium">Anders Svensson</p>
                      <p className="text-sm text-muted-foreground">Athlete</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container flex flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Ready to start your challenge?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              Join today and begin your journey toward better health and
              well-being through ice bathing.
            </p>
          </div>
          <Button
            onClick={handleStartChallenge}
            size="lg"
            variant="whiteShadow"
            className="bg-black text-white"
            disabled={isLoading}
          >
            Start now
          </Button>
        </div>
      </section>
    </div>
  );
}
