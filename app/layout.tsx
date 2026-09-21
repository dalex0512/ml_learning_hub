import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ML Learning Hub — Ghi chú tự học Machine Learning",
  description: "Trang ghi chú và ôn tập cá nhân các khái niệm Machine Learning, Data Science, Python.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col text-text-main antialiased selection:bg-accent-sticky-yellow selection:text-text-main">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/90 border-b border-paper-border/60">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo chữ thường */}
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-3 h-3 rounded-full bg-accent-red ring-2 ring-accent-red/20 group-hover:scale-110 transition-transform"></span>
              <span className="font-semibold text-lg sm:text-xl tracking-tight text-text-main font-sans">
                ml learning hub
              </span>
              <span className="font-hand text-accent-red text-base ml-1.5 transform -rotate-2">
                notebook
              </span>
            </Link>

            {/* Navigation links & CTA */}
            <nav className="flex items-center gap-4 sm:gap-6">
              <Link
                href="/#roadmap"
                className="text-sm font-medium text-text-muted hover:text-text-main transition-colors"
              >
                Roadmap 6 Module
              </Link>
              {/* Nút CTA sticky-note vàng xoay nhẹ */}
              <Link
                href="/01-machine-learning/what-is-ml"
                className="inline-flex items-center justify-center px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-md bg-accent-sticky-yellow text-accent-dark border border-[#dfbe35] shadow-sticky-note transform rotate-1 hover:rotate-0 hover:scale-105 transition-all"
              >
                Bắt đầu đọc ✏️
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="mt-20 border-t border-paper-dashed py-8 text-center text-xs text-text-sub bg-paper/60">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-hand text-accent-red text-base">✦</span>
              <span>Ghi chú tự học Machine Learning — Duong</span>
            </div>
            <div className="font-hand text-accent-red text-sm transform -rotate-1">
              "Hiểu bản chất qua trực quan & ví dụ tay"
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

