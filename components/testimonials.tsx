"use client";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I've never felt so energized and focused as after completing the ISBAD challenge. My sleep quality has improved significantly!",
    name: "Anders Svensson",
    title: "Athlete",
  },
  {
    quote:
      "The cold baths helped me recover faster and stay consistent in my training. Love the feeling afterwards!",
    name: "Sofia Nilsson",
    title: "Fitness Coach",
  },
  {
    quote:
      "This app kept me accountable and made the process so much easier. I'm hooked!",
    name: "Johan Eriksson",
    title: "Entrepreneur",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#242422] py-16 md:py-24 px-4">
      <div className="container space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            What our users say
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-lg shadow-md bg-[#242422] border border-white"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-[#1AA7EC] p-2">
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
                  <p className="text-muted-foreground text-sm sm:text-base text-white">
                    “{t.quote}”
                  </p>
                  <div>
                    <p className="font-medium text-[#1AA7EC]">{t.name}</p>
                    <p className="text-sm text-muted-foreground text-[#1AA7EC]">
                      {t.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
