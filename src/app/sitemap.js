export default function sitemap() {
  const base = "https://ayodhyarestaurant.com";
  const routes = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/menu", priority: 0.95, changeFrequency: "weekly" },
    { path: "/takeaway", priority: 0.9, changeFrequency: "weekly" },
    { path: "/reserve", priority: 0.85, changeFrequency: "monthly" },
    { path: "/menu-book", priority: 0.8, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.75, changeFrequency: "monthly" },
    { path: "/gallery", priority: 0.7, changeFrequency: "monthly" },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: new Date("2026-10-02T00:00:00+05:30"),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
