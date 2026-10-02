export default function manifest() {
  return {
    name: "Ayodhya Restaurant Betul",
    short_name: "Ayodhya",
    description:
      "Ayodhya Restaurant, Ganj Betul — North Indian, South Indian, Indo-Chinese, pizzas, dosas and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#171515",
    theme_color: "#171515",
    icons: [
      { src: "/brand/ayodhya-submark-loader.webp", sizes: "512x512", type: "image/webp", purpose: "any maskable" },
    ],
  };
}
