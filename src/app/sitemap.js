export default function sitemap() {
  const base = "https://ayodhyarestaurant.in";
  const routes = [
    { path: "", priority: 1 },
    { path: "/menu", priority: 0.9 },
    { path: "/gallery", priority: 0.7 },
    { path: "/about", priority: 0.7 },
    { path: "/contact", priority: 0.8 },
    { path: "/reserve", priority: 0.8 },
  ];
  return routes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: r.priority,
  }));
}
