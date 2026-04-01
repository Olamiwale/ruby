import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProviderWrapper from "@/app/provider/AuthProviderWrapper";
import ReduxProvider from "@/app/provider/ReduxProvider";
import PageWrapper from "@/app/components/layout/PageWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Map by Ruby",
  description: "Your fashion destination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProviderWrapper>
          <ReduxProvider>
            <PageWrapper>{children}</PageWrapper>
          </ReduxProvider>
        </AuthProviderWrapper>
      </body>
    </html>
  );
}
