import defaults from "@/app.config";
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: defaults.title,
    short_name: defaults.title,
    description: defaults.description,
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: defaults.themeColor,
    theme_color: defaults.themeColor,
    icons: [
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: "/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
    ],
  };
}
