"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_ID, pageview } from "@/lib/gtag";

export default function GAProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Fire a page_view on route changes
  useEffect(() => {
    if (!GA_ID) return;
    const qs = searchParams?.toString();
    const url = qs ? `${pathname}?${qs}` : pathname || "/";
    pageview(url);
  }, [pathname, searchParams]);

  // If no GA id present, render nothing
  if (!GA_ID) return null;

  return (
    <>
      {/* Load gtag.js once the app is interactive */}
      <Script
        id="ga-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      {/* Init dataLayer and configure GA (disable auto page_view) */}
      <Script id="ga-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
