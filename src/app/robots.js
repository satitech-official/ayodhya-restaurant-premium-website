export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/admin", "/api/"],
      },
    ],
    sitemap: "https://ayodhyarestaurant.com/sitemap.xml",
    host: "https://ayodhyarestaurant.com",
  };
}
