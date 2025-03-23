import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FeaturesGrid from "@/components/features-grid";
import { ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#D0E7F8] py-16 md:py-24">
        <div className="container flex flex-col items-center gap-8 text-center md:gap-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              30-dagars Isbad Challenge
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Utmana dig själv och dina vänner till 30 dagars isbad i rad. Följ
              din progress, dokumentera dina upplevelser och känn fördelarna av
              iskallt vatten.
            </p>
          </div>
          <div className="flex flex-row gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-[#0B4F82] hover:bg-[#0A3F69]"
            >
              <Link href="/signup">
                Starta din utmaning <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Läs mer om fördelarna</Link>
            </Button>
          </div>
          <div className="relative w-full max-w-4xl rounded-xl border overflow-hidden shadow-lg">
            <Image
              src="/images/Isbad-elite-tunna-med-lock-och-man-isbadar.webp"
              alt="ISBAD Challenge"
              width={400}
              height={400}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Hur fungerar det?
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground">
              Följ din 30-dagars isbad utmaning med våra smarta verktyg och
              funktioner
            </p>
          </div>
          <FeaturesGrid />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#F0F8FF] py-16 md:py-24">
        <div className="container space-y-8">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Vad våra användare säger
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg bg-white p-6 shadow-md">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-[#D0E7F8] p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0B4F82"
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
                      &quot;Jag har aldrig känt mig så pigg och fokuserad som
                      efter att ha genomfört 30-dagars utmaningen. Min
                      sömnkvalitet har förbättrats avsevärt!&quot;
                    </p>
                    <div>
                      <p className="font-medium">Anders Svensson</p>
                      <p className="text-sm text-muted-foreground">
                        30 dagars deltagare
                      </p>
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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Redo att börja din utmaning?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              Gå med idag och börja din resa mot förbättrad hälsa och välmående
              genom isbad.
            </p>
          </div>
          <Button asChild size="lg" className="bg-[#0B4F82] hover:bg-[#0A3F69]">
            <Link href="/signup">Börja nu</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
