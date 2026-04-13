import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NostalgiaWeb — Build Your Website Like It's 1999",
  description: "Create your own Windows XP-style personal homepage. Drag, drop, and share your corner of the retro web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
