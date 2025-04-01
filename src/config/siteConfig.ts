import { Metadata } from "next";

const { title, description, ogImage, baseURL } = {
  title: "SolixDB",
  description:
    "SolixDB is a powerful blockchain indexing platform that enables seamless Solana data ingestion, real-time analytics, and efficient query capabilities. Designed for developers and enterprises, SolixDB offers a scalable solution to track on-chain events, transactions, and token activity with ease.",
  baseURL: "https://solixdb.priyanshpatel.site",
  ogImage: `https://solixdb.priyanshpatel.site/open-graph.png`,
};

export const siteConfig: Metadata = {
  title,
  description,
  metadataBase: new URL(baseURL),
  openGraph: {
    title,
    description,
    images: [ogImage],
    url: baseURL,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: "SolixDB",
  alternates: {
    canonical: baseURL,
  },
  keywords: [
    "Solana Indexing",
    "Blockchain Data",
    "Real-time Transactions",
    "Solana API",
    "On-Chain Analytics",
  ],
};
