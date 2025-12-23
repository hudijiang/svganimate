import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SVG动画生成器 – 使用AI在线创建和制作SVG动画 | SvgAnimate",
  description: "无需编写代码，无需学习专业软件。输入知识点，AI即刻为您生成高精度的 SVG矢量图动画。适合 YouTuber、B站UP主、知识博主与教育创作者。",
  keywords: "SVG动画, AI生成, 矢量动画, 动画制作, 知识动画",
  openGraph: {
    title: "SVG动画生成器 – 使用AI在线创建和制作SVG动画",
    description: "无需编写代码，无需学习专业软件。输入知识点，AI即刻为您生成高精度的 SVG矢量图动画。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} antialiased grid-background min-h-screen`}>
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
