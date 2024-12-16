"use client";
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { ConfigProvider } from "antd";
import { AppProvider } from "@/context/AppContext";
import { metadata } from './meta'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <title>{metadata.title?.toString()}</title>
        <meta name="description" content={metadata.description?.toString()} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConfigProvider wave={{ disabled: true }}>
          <QueryClientProvider client={queryClient}>
            <HydrationBoundary>
              <AppProvider>{children}</AppProvider>
            </HydrationBoundary>
          </QueryClientProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
