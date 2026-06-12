import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, Great_Vibes } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fayez & Hasna Wedding Invitation",
  description: "You are cordially invited to the reception ceremony of Fayez & Hasna.",
  openGraph: {
    title: "Fayez & Hasna Wedding Invitation",
    description: "You are cordially invited to the reception ceremony of Fayez & Hasna.",
    images: ["https://ik.imagekit.io/ev04guug7/Wedding/social_image.png"],
    url: "https://ik.imagekit.io/ev04guug7/Wedding/social_image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${outfit.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>{children}</body>
    </html>
  );
}
