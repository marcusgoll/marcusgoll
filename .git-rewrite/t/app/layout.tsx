import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marcus Gollahon | Aviation, Dev, Education & Startups",
  description: "Personal blog covering aviation, software development, education, and entrepreneurship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
