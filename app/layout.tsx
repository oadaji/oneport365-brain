import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OnePort 365 Brain",
  description: "AI assistant for OnePort 365 freight operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col">{children}</body>
    </html>
  );
}
