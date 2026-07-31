import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

import { Providers } from "@/components/Providers";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "AgroPulse - Modern Agriculture & Direct Farm Trading Portal",
  description: "India's direct farm trading ecosystem by Uday Pratap Singh Chauhan (udchauhan0987@gmail.com). Mandi rates, weather predictions, and verified farmer community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f1117] text-gray-900 dark:text-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col md:ml-64 min-w-0">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
