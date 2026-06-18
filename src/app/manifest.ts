import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Enxoval do Timóteo Aquino Santos",
    short_name: "Timóteo",
    description: "Lista compartilhada do enxoval do Timóteo, com controle de compras, gastos e presentes",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7ef",
    theme_color: "#57752f",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/maskable-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
