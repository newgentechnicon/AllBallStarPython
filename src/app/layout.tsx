import type { Metadata } from "next";
// 1. นำเข้าฟอนต์ Inter
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import PrelineProvider from '@/components/PrelineProvider';
import { AuthProvider } from '@/context/AuthContext';
import "toastify-js/src/toastify.css";

// 2. สร้าง instance ของฟอนต์ Inter และกำหนด CSS Variable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // เราจะใช้ตัวแปรนี้ใน CSS
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 3. นำตัวแปรฟอนต์มาใช้งานกับ body */}
      <body className={`${inter.variable}`}>
        <AuthProvider>
          <PrelineProvider>{children}</PrelineProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
