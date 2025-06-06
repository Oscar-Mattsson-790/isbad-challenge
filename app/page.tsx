import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FeaturesGrid from "@/components/features-grid";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#242422] py-16 md:py-24">
        <div className="container flex flex-col items-center gap-8 text-center md:gap-12">
          <div className="space-y-4">
            <h1 className="pt-8 text-4xl text-white font-bold tracking-tighter sm:text-5xl md:text-6xl">
              ISBAD Challenge
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-white md:text-xl">
              Challenge yourself and your friends to a consistent ice bath.
              Track your progress, document your experiences and feel the
              benefits of cold water.
            </p>
          </div>
          <div className="flex flex-row gap-4 sm:flex-row">
            <Button asChild variant="whiteShadow" size="lg">
              <Link href="/signup">
                Start your challenge <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
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
          <div className="relative w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/Man badar i mössa i en isbad Premium med skvätt vatten.jpg"
              alt="ISBAD Challenge"
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
            <Image
              src="/images/monica badar i isbad elite på altanen och solen skiner.jpg"
              alt="ISBAD Pro"
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="pt-8 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
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
      <section className="bg-[#242422] py-16 md:py-24">
        <div className="container space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="pt-8 text-3xl font-bold tracking-tighter text-white sm:text-4xl pb-10">
              What our users say
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg bg-white p-6 shadow-md">
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
                    <p className="text-muted-foreground">
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
      <section className="py-16 md:py-24">
        <div className="container flex flex-col items-center gap-8 text-center">
          <div className="space-y-4">
            <h2 className="pt-8 text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to start your challenge?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              Join today and begin your journey toward better health and
              well-being through ice bathing.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            variant="whiteShadow"
            className="bg-black text-white"
          >
            <Link href="/signup">Start now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
