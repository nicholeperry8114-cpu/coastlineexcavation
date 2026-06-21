import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coastline Excavation Operations",
    short_name: "Coastline Ops",
    description: "Mobile operations prototype for Coastline Excavation.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0d2238",
    theme_color: "#0d2238",
    orientation: "portrait",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
