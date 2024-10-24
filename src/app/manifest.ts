import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Plan lekcji ZSTiO",
    short_name: "Plan lekcji ZSTiO",
    description:
      "W prosty sposób sprawdź plan zajęć i zastępstwa dla różnych klas, nauczycieli oraz sal w Zespole Szkół Technicznych i Ogólnokształcących im. Stefana Banacha w Jarosławiu.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#EF0933",
    theme_color: "#EF0933",
    icons: [
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
