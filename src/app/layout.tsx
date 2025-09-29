import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/hook/providers";
import { ToastContainer } from "react-toastify";
import Menu from "@/component/menu/Menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nha khoa Hoang Binh",
  description: "Nha khoa Hoang Binh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased roboto`}
      >
        <ToastContainer />
        <Menu />
        <Providers>
          {children}       
        </Providers>
      </body>
    </html>
  );
}
