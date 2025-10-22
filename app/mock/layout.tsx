import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Design Mockups | Marcus Gollahon",
  description: "Design variation mockups for review",
};

export default function MockLayout({
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
