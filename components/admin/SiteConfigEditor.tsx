"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { adminUpdateConfig } from "@/lib/adminApi";
import type { SiteConfig } from "@/lib/types";
import MetaRowPreview from "./MetaRowPreview";
import { AdminIcon } from "./icons";

const FIELDS = [
  {
    key: "location" as const,
    label: "Location",
    hint: "Shown on the About page meta row",
    placeholder: "Phoenix, AZ",
    page: "about",
  },
  {
    key: "reading_now" as const,
    label: "Reading Now",
    hint: "Currently reading — shown on Reading page meta row",
    placeholder: "Book title",
    page: "reading",
  },
  {
    key: "building_now" as const,
    label: "Building Now",
    hint: "Current project — shown on Projects page meta row",
    placeholder: "Project name",
    page: "projects",
  },
  {
    key: "writing_now" as const,
    label: "Writing Now",
    hint: "Current draft — shown on Writing page meta row",
    placeholder: "Essay title",
    page: "writing",
  },
];

export default function SiteConfigEditor({
  initialConfig,
}: {
  initialConfig: SiteConfig;
}) {
  const [values, setValues] = useState({
    location: initialConfig.location,
    reading_now: initialConfig.reading_now,
    building_now: initialConfig.building_now,
    writing_now: initialConfig.writing_now,
  });
  const baseline = useRef({ ...values });
  const [activePage, setActivePage] = useState("home");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function setField(key: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setDirty(true);
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await adminUpdateConfig(values);
      baseline.current = { ...values };
      setDirty(false);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      setSaved(true);
      savedTimer.current = setTimeout(() => setSaved(false), 2200);
    } catch {
      alert("Failed to save config. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Site Config</div>
          <div className="breadcrumb">
            <Link href="/admin" className="bc-link">
              Admin
            </Link>
            <span>/</span>
            <span>Site Config</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Currently Strip</div>
            <div className="card-sub">
              Four fields that fill the meta row across the site — updates all
              pages instantly
            </div>
          </div>
        </div>
        {FIELDS.map((f) => (
          <div
            className="field-row"
            key={f.key}
            onMouseEnter={() => setActivePage(f.page)}
            onMouseLeave={() => setActivePage("home")}
          >
            <div>
              <div className="field-key">{f.label}</div>
              <div className="field-hint">{f.hint}</div>
            </div>
            <input
              className="field-input"
              value={values[f.key]}
              onChange={(e) => setField(f.key, e.target.value)}
              placeholder={f.placeholder}
              onFocus={() => setActivePage(f.page)}
              onBlur={() => setActivePage("home")}
            />
          </div>
        ))}
      </div>

      <MetaRowPreview currently={values} activePage={activePage} />

      <div className="save-bar">
        <span className={`save-hint${saved ? " saved" : ""}`}>
          {saved ? "Saved ✓" : dirty ? "UNSAVED CHANGES" : "ALL CHANGES SAVED"}
        </span>
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving || !dirty}
        >
          <AdminIcon
            d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8"
            size={11}
          />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
