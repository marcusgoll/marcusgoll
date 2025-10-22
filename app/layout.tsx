import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { DefaultSEO } from "@/components/seo/DefaultSEO";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marcus Gollahon | Aviation & Software Development",
  description:
    "Teaching systematic thinking from 30,000 feet. Aviation career guidance and software development insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <body className="antialiased">
        {/* Site-wide SEO defaults */}
        <DefaultSEO />

        {/* Google Analytics */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* Site Layout */}
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
