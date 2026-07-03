import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Imara Studios",
    default: "Imara Studios — Premium Music & Media Production | Nakuru",
  },
  description:
    "Imara Studios is Nakuru's premier music recording, production, vocal training, and video production studio. Home of the acclaimed Imara Chorale.",
  keywords: [
    "music studio nakuru",
    "recording studio kenya",
    "music production nakuru",
    "choir nakuru",
    "vocal training nakuru",
    "video production nakuru",
  ],
  openGraph: {
    type: "website",
    locale: "en_KE",
    siteName: "Imara Studios",
    images: ["/images/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0d0d0d" />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#f5f3ee",
              border: "1px solid rgba(201, 168, 76, 0.3)",
              borderRadius: "8px",
            },
            success: {
              iconTheme: { primary: "#C9A84C", secondary: "#0d0d0d" },
            },
          }}
        />
      </body>
    </html>
  );
}
