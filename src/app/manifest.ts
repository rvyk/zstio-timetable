import defaults from "@/../app.config";
import { MetadataRoute } from "next";

import zstioLogo1024 from "@/media/icon-1024x1024.png";
import zstioLogo128 from "@/media/icon-128x128.png";
import zstioLogo152 from "@/media/icon-152x152.png";
import zstioLogo192 from "@/media/icon-192x192.png";
import zstioLogo72 from "@/media/icon-72x72.png";
import zstioLogo96 from "@/media/icon-96x96.png";

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
        src: zstioLogo1024.src,
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: zstioLogo192.src,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: zstioLogo152.src,
        sizes: "152x152",
        type: "image/png",
      },
      {
        src: zstioLogo128.src,
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: zstioLogo96.src,
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: zstioLogo72.src,
        sizes: "72x72",
        type: "image/png",
      },
    ],
  };
}
