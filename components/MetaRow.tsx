"use client";

import { useEffect, useRef, useState } from "react";

interface MetaRowProps {
  status: string;
}

export default function MetaRow({ status }: MetaRowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLSpanElement>(null);
  const [dots, setDots] = useState("·········");

  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    function fill() {
      if (!ref.current || !dotsRef.current) return;
      const avail = dotsRef.current.offsetWidth;
      const charW = 8.4;
      const count = Math.max(3, Math.floor(avail / charW));
      setDots("·".repeat(count));
    }
    fill();
    const ro = new ResizeObserver(fill);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [status]);

  return (
    <div className="meta-row">
      <div className="meta-inner outer" ref={ref}>
        <span className="meta-date">{dateStr}</span>
        <span className="meta-dots" ref={dotsRef}>
          {dots}
        </span>
        <span className="meta-status">{status}</span>
      </div>
    </div>
  );
}
