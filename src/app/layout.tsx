import type { Metadata, Viewport } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Providers } from '@/providers';
import "./globals.css";

export const metadata: Metadata = {
  title: "AptoTip - Tip Anyone with just Google",
  description: "Create tipping profiles for restaurants and creators. Accept tips with Google sign-in using Aptos blockchain. Zero fees, instant payments.",
  keywords: ["tipping", "restaurants", "creators", "aptos", "blockchain", "google", "keyless"],
  authors: [{ name: "AptoTip Team" }],
  creator: "AptoTip",
  publisher: "AptoTip",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aptotip.io'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/image.png',
    shortcut: '/image.png',
    apple: '/image.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aptotip.io',
    siteName: "AptoTip",
    title: "AptoTip - Tip Anyone with just Google",
    description: "Create tipping profiles for restaurants and creators. Accept tips with Google sign-in using Aptos blockchain.",
    images: [
      {
        url: '/image.png',
        width: 1200,
        height: 630,
        alt: "AptoTip - Revolutionary Tipping Platform",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "AptoTip - Tip Anyone with just Google",
    description: "Create tipping profiles for restaurants and creators. Accept tips with Google sign-in using Aptos blockchain.",
    creator: "@aptotip_app",
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
