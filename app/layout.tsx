import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mydogportal.site"),
  title: {
    default: "mydogportal.site",
    template: "%s | mydogportal.site",
  },
  description:
    "A premium SaaS operating system for dog breeder organizations, authentication, admin workspaces, billing, settings, and buyer portal access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full bg-app font-sans text-stone-100 antialiased">
        {children}
      </body>
    </html>
  );
}
