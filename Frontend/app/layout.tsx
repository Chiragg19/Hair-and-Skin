import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ["latin"] });

// Server-side Metadata (Works because "use client" is NOT at the top)
export const metadata: Metadata = {
  title: "Hair & Skin App",
  description: "Luxury Salon Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <SpeedInsights />
        
        {/* Load Razorpay Script Globally */}
       <Script
  src="https://checkout.razorpay.com/v1/checkout.js"
  strategy="afterInteractive"
/>
      </body>
    </html>
  );
}