"use client";

import React, { useMemo, useState } from "react";

function rng(seed: number) { let s = (seed * 2654435761) % 2147483647 || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
const shuffle = <T,>(a: T[], r: () => number) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

function split(mode: "random" | "strat", K: number, seed: number) {
  const r = rng(seed);
  const cats = Array(90).fill(0), dogs = Array(10).fill(1);
  const folds: number[][] = Array.from({ length: K }, () => []);
  if (mode === "random") {
    const all = shuffle([...cats, ...dogs], r);
    all.forEach((v, i) => folds[Math.floor((i * K) / all.length)].push(v));
  } else {
    shuffle(cats, r).forEach((v, i) => folds[i % K].push(v));
    shuffle(dogs, r).forEach((v, i) => folds[i % K].push(v));
  }
  return folds.map((f) => ({ cat: f.filter((v) => v === 0).length, dog: f.filter((v) => v === 1).length }));
}

/** 90 Cat và 10 Dog: chia fold ngẫu nhiên và chia có phân tầng. */
export default function FoldCompare() {
  const [K, setK] = useState(4);
  const [mode, setMode] = useState<"random" | "strat">("random");
  const [seed, setSeed] = useState(1);
  const folds = useMemo(() => split(mode, K, seed), [mode, K, seed]);
  const stats = useMemo(() => {
    let bad = 0;
    for (let s = 1; s <= 1000; s++) if (split(mode, K, s * 7 + 3).some((f) => f.dog === 0)) bad++;
    return bad / 1000;
  }, [mode, K]);
  return (
    <div className="w-box">
      <div className="w-head">
        <span className="reader-label" style={{ margin: 0 }}>Thử: 90 Cat và 10 Dog</span>
        <span className="w-seg">
          <button type="button" className={mode === "random" ? "on" : ""} onClick={() => setMode("random")}>K-fold thường</button>
          <button type="button" className={mode === "strat" ? "on" : ""} onClick={() => setMode("strat")}>Stratified K-fold</button>
        </span>
      </div>
      <div className="w-head" style={{ marginTop: ".5rem" }}>
        <span className="w-seg">{[4, 5].map((k) => <button key={k} type="button" className={K === k ? "on" : ""} onClick={() => setK(k)}>K = {k}</button>)}</span>
        <button type="button" className="reader-btn" onClick={() => setSeed((s) => s + 1)}>Xáo lại và chia</button>
      </div>
      <div className="w-fold-scores" style={{ marginTop: ".8rem" }}>
        {folds.map((f, i) => (
          <span key={i} style={{ borderColor: f.dog === 0 ? "var(--r-accent)" : undefined, background: f.dog === 0 ? "rgba(200,90,70,.16)" : undefined }}>
            <small>fold {i + 1}</small>{f.cat} Cat, <strong>{f.dog} Dog</strong>
          </span>
        ))}
      </div>
      <p className="w-note">
        {folds.some((f) => f.dog === 0)
          ? "Có fold không có Dog nào: trên fold đó ta không đo được model nhận ra Dog tốt đến đâu."
          : "Lần chia này mọi fold đều có Dog."}
        {" "}Qua 1000 lần xáo ở cấu hình này, tỉ lệ lần có ít nhất một fold không có Dog là <strong>{(stats * 100).toFixed(1)}%</strong>.
      </p>
    </div>
  );
}
