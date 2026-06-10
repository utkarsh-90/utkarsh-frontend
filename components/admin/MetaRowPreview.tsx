"use client";

import { useEffect, useRef, useState } from "react";

interface CurrentlyValues {
  location: string;
  reading_now: string;
  building_now: string;
  writing_now: string;
}

interface MetaRowPreviewProps {
  currently: CurrentlyValues;
  activePage: string;
}

function PreviewMetaStrip({ status }: { status: string }) {
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
    <div className="meta-preview-strip" ref={ref}>
      <span className="meta-preview-date">{dateStr}</span>
      <span className="meta-preview-dots" ref={dotsRef}>
        {dots}
      </span>
      <span className="meta-preview-status">{status}</span>
    </div>
  );
}

export default function MetaRowPreview({
  currently,
  activePage,
}: MetaRowPreviewProps) {
  const pages = [
    {
      id: "home",
      label: "HOME",
      status: "INDEX · 8 ESSAYS / 4 PROJECTS",
    },
    {
      id: "writing",
      label: "WRITING",
      status: currently.writing_now
        ? `DRAFTING · ${currently.writing_now.toUpperCase()}`
        : "DRAFTING · —",
    },
    {
      id: "projects",
      label: "PROJECTS",
      status: currently.building_now
        ? `BUILDING · ${currently.building_now.toUpperCase()}`
        : "BUILDING · —",
    },
    {
      id: "reading",
      label: "READING",
      status: currently.reading_now
        ? `NOW · READING ${currently.reading_now.toUpperCase()}`
        : "NOW · READING —",
    },
    {
      id: "about",
      label: "ABOUT",
      status: currently.location
        ? `${currently.location.toUpperCase()} · CS @ ASU · OPEN TO 2026 ROLES`
        : "LOCATION · CS @ ASU",
    },
  ];

  return (
    <div className="preview-wrap">
      <div className="preview-head">
        <span className="preview-title">
          Meta Row Preview — live as you type
        </span>
        <span className="preview-live-badge">
          <span className="preview-live-dot" />
          LIVE
        </span>
      </div>

      <div className="preview-browser">
        <div className="chrome-dot" style={{ background: "#ff5f56" }} />
        <div className="chrome-dot" style={{ background: "#ffbd2e" }} />
        <div className="chrome-dot" style={{ background: "#27c93f" }} />
        <div className="chrome-bar">utkarshpanchal.com</div>
      </div>

      <div className="preview-site-nav">
        <span className="preview-site-logo">UTKARSH PANCHAL</span>
        <div className="preview-site-links">
          WRITING<span>/</span>PROJECTS<span>/</span>READING<span>/</span>ABOUT
        </div>
      </div>

      <div className="meta-rows-grid">
        {pages.map((pg) => (
          <div
            key={pg.id}
            className={`meta-preview-row${activePage === pg.id ? " active-row" : ""}`}
          >
            <span className="meta-page-tag">{pg.label}</span>
            <PreviewMetaStrip status={pg.status} />
          </div>
        ))}
      </div>

      <div className="preview-footnote">
        ↑ EACH ROW SHOWS THE META STRIP AS IT APPEARS ON THAT PAGE
      </div>
    </div>
  );
}
