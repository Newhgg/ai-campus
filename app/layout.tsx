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

export const metadata: Metadata = {
  title: "AI 校园·三栋楼智能平台",
  description:
    "2026 第九届传智杯 AI Web 开发挑战赛作品：AI 驱动的校园三栋楼智能平台（学习楼 / 宿舍楼 / 办公楼）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#070b18] text-slate-100 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
