"use client";

import { useCallback, useRef, useState } from "react";
import { adminUpdateConfig } from "@/lib/adminApi";
import type { SiteConfig } from "@/lib/types";

const FIELDS = [
  { key: "location" as const, label: "Location", placeholder: "City, State" },
  {
    key: "reading_now" as const,
    label: "Reading Now",
    placeholder: "Current book",
  },
  {
    key: "building_now" as const,
    label: "Building Now",
    placeholder: "Current project",
  },
  {
    key: "writing_now" as const,
    label: "Writing Now",
    placeholder: "Current essay",
  },
];

export default function CurrentlyStrip({
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
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSaved = useCallback(() => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setSaved(true);
    savedTimer.current = setTimeout(() => setSaved(false), 2000);
  }, []);

  const handleBlur = async (key: keyof typeof values) => {
    const current = values[key];
    if (current === baseline.current[key]) return;

    try {
      await adminUpdateConfig({ [key]: current });
      baseline.current[key] = current;
      showSaved();
    } catch {
      setValues((v) => ({ ...v, [key]: baseline.current[key] }));
    }
  };

  return (
    <div className="table-wrap">
      <div className="table-header">
        <div>
          <div className="table-title">Currently</div>
          <div className="table-meta">Shown in meta row across site</div>
        </div>
      </div>
      <div className="currently-grid">
        {FIELDS.map((f) => (
          <div className="currently-field" key={f.key}>
            <div className="currently-key">{f.label}</div>
            <input
              className="currently-input"
              value={values[f.key]}
              placeholder={f.placeholder}
              onChange={(e) =>
                setValues((v) => ({ ...v, [f.key]: e.target.value }))
              }
              onBlur={() => handleBlur(f.key)}
            />
          </div>
        ))}
      </div>
      {saved && <div className="currently-saved">Saved ✓</div>}
    </div>
  );
}
