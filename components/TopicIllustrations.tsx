"use client";

import React, { useState } from "react";

interface HeroProps {
  topicId: string;
}

export function TopicHeroIllustration({ topicId }: HeroProps) {
  const [broken, setBroken] = useState(false);

  if (broken) return null;

  return (
    <div className="mt-1 bg-[#FAF4E4] rounded-xl border border-paper-border p-3 overflow-hidden flex justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/illustrations/${topicId}.png`}
        alt=""
        className="max-h-[280px] w-auto object-contain rounded-md"
        onError={() => setBroken(true)}
      />
    </div>
  );
}
