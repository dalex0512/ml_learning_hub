"use client";

import React from "react";
import Link from "next/link";
import { pageFlip } from "@/lib/pageFlip";

interface Props extends Omit<React.ComponentProps<typeof Link>, "onClick"> {
  flip: 1 | -1;
}

export default function FlipLink({ flip, children, ...rest }: Props) {
  return (
    <Link {...rest} onClick={() => (pageFlip.dir = flip)}>
      {children}
    </Link>
  );
}
