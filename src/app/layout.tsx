import type { Metadata } from "next";
import "./globals.css";
import { theme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "وقودك - WAQOUDK",
  description: "توصيل المحروقات إلى باب منزلك",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-full" style={{ fontFamily: theme.fontFamily.text }}>{children}</body>
    </html>
  );
}
