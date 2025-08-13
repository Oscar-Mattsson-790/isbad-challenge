import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://isbad.com";
  const pages = ["/", "/about", "/contact", "/privacy", "/terms"];
  const lastmod = new Date();

  return pages.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: lastmod,
    changeFrequency: "weekly",
    priority: path === "/" ? 1.0 : 0.6,
  }));
}
