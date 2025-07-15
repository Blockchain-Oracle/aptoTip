import type { Metadata, Viewport } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";

export const metadata: Metadata = {
  title: "TipLink - Tip Anyone with just Google",
  description: "Revolutionary tipping for restaurants and creators. No crypto knowledge required. Zero friction. Instant payments.",
  keywords: [
    "tipping",
    "cryptocurrency",
    "aptos",
    "google auth",
    "restaurants",
    "creators",
    "keyless accounts",
    "web3",
    "digital payments"
  ],
  openGraph: {
    type: "website",
    siteName: "TipLink",
    title: "TipLink - Tip Anyone with just Google",
    description: "Revolutionary tipping for restaurants and creators. No crypto knowledge required. Zero friction. Instant payments.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TipLink - Revolutionary Tipping Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TipLink - Tip Anyone with just Google",
    description: "Revolutionary tipping for restaurants and creators. No crypto knowledge required. Zero friction. Instant payments.",
    images: ["/og-image.png"],
    creator: "@tiplink_app",
  },
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
