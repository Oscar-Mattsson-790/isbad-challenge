export default function sitemap() {
  const base = "https://isbad.com";
  const pages = ["/", "/about", "/contact", "/privacy", "/terms"];
  const lastmod = new Date().toISOString();

  return pages.map((path) => ({
    url: `${base}${path === "/" ? "" : path}`,
    lastModified: lastmod,
    changefreq: "weekly",
    priority: path === "/" ? 1.0 : 0.6,
  }));
}
