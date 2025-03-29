import type { MetadataRoute } from "next";

const { appName, description } = {
  appName: "SolixDB",
  description:
    "SolixDB is a powerful blockchain indexing platform that enables seamless Solana data ingestion, real-time analytics, and efficient query capabilities. Designed for developers and enterprises, SolixDB offers a scalable solution to track on-chain events, transactions, and token activity with ease.",
};

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: appName,
    short_name: appName,
    description: description,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}