export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://isbad.com/sitemap.xml",
    host: "https://isbad.com",
  };
}
