import defaults from "@/../app.config";
import { MetadataRoute } from "next";

import zstioLogo512 from "@/media/icon-512x512.png";

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
        src: zstioLogo512.src,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
