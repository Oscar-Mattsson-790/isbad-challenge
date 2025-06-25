"use client";

import { Button } from "@/components/ui/button";
import FeaturesGrid from "@/components/features-grid";
import { useSupabase } from "@/components/supabase-provider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Testimonials from "@/components/testimonials";

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
      <section className="relative overflow-hidden min-h-[87vh] flex items-center px-4 sm:px-6">
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
              <p className="max-w-[700px] text-white text-sm sm:text-base">
                Challenge yourself and your friends to a consistent ice bath.
                Track your progress, document your experiences and feel the
                benefits of cold water.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleStartChallenge}
              className="bg-[#157FBF] border-none hover:bg-[#115F93] hover:text-white"
              size="lg"
              disabled={isLoading}
            >
              Start your challenge
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-black hover:text-white"
            >
              <a
                href="https://isbad.se/artiklar/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read more about the benefits
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12 bg-[#242422]">
        <div className="container space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              How does it work?
            </h2>
            <p className="mx-auto max-w-[700px] text-white">
              Follow your ice bath challenge with our smart tools and features.
            </p>
          </div>
          <FeaturesGrid />
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container flex flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Ready to start your challenge?
            </h2>
            <p className="mx-auto max-w-[600px] text-white">
              Join today and begin your journey toward better health and
              well-being through ice bathing.
            </p>
          </div>
          <Button
            onClick={handleStartChallenge}
            className="bg-[#157FBF] border-[1px] border-none hover:bg-[#115F93] hover:text-white"
            size="lg"
            disabled={isLoading}
          >
            Start now
          </Button>
        </div>
      </section>
    </div>
  );
}
