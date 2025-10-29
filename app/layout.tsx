import type { Metadata } from "next";
import Script from "next/script";
import { LayoutWrapper } from "@/app/components/layout-wrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { WebVitalsReporter } from "@/components/providers/WebVitalsReporter";
import { workSans, jetbrainsMono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marcus Gollahon | Aviation & Software Development",
  description:
    "Teaching systematic thinking from 30,000 feet. Aviation career guidance and software development insights.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${workSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
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

          {/* Web Vitals Real User Monitoring */}
          {gaId && <WebVitalsReporter />}

          {/* Site Layout with conditional Header/Footer */}
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
