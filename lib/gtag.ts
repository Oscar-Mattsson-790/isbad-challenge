// Make TypeScript aware of gtag/dataLayer on window
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: any[]) => void;
  }
}
// This file is a module
export {};

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

/**
 * Send a page_view to GA4 for the given URL (used on route changes).
 */
export const pageview = (url: string) => {
  if (!GA_ID) return;
  window.gtag?.("config", GA_ID, {
    page_path: url,
  });
};

/**
 * Send a custom GA event.
 * Example:
 *   event("add_bath", { category: "engagement", label: "modal_save", value: 1 })
 */
export const event = (
  action: string,
  {
    category,
    label,
    value,
  }: { category?: string; label?: string; value?: number } = {}
) => {
  if (!GA_ID) return;
  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
