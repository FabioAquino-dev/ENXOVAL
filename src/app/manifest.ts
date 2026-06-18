import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Enxoval do Bebê",
    short_name: "Enxoval",
    description: "Lista compartilhada de enxoval do bebê, com controle de compras e gastos",
    start_url: "/",
    display: "standalone",
    background_color: "#eff6ff",
    theme_color: "#2563eb",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/maskable-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
