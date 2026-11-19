"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "ml-reader-theme";

/**
 * Chế độ đọc: ẩn header/footer của trang, đặt nền trung tính, có thanh trên cùng
 * gọn (quay lại, tiến độ cuộn, đổi sáng/tối). Dùng cho mọi trang thực hành.
 */
export default function ReaderShell({
  backHref,
  backLabel,
  title,
  children,
}: {
  backHref?: string;
  backLabel?: string;
  title: string;
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    let saved: string | null = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch {}
    const initial = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(initial);
    root.classList.add("reader-mode");
    root.dataset.readerTheme = initial;
    return () => {
      root.classList.remove("reader-mode");
      delete root.dataset.readerTheme;
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.readerTheme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch {}
  };

  return (
    <div className="reader">
      <div className="reader-bar">
        <div className="reader-bar-inner">
          {backHref ? <Link href={backHref}>← {backLabel}</Link> : <Link href="/" style={{ color: "var(--r-fg)", fontWeight: 600 }}>ml learning hub</Link>}
          <span style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
          {backHref && <Link href="/">Trang chủ</Link>}
          <Link href="/phong-van">Phỏng vấn</Link>
          <button type="button" onClick={toggle} aria-label={theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"} title="Sáng / tối">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="reader-progress" style={{ width: `${pct}%` }} />
      </div>
      {children}
    </div>
  );
}
