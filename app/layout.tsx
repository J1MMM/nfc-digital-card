import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tapcard Studio · Digital NFC calling cards",
  description: "Create digital contact cards with dedicated links for NFC tags. Make it easy to call, message, connect, and save a contact.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
