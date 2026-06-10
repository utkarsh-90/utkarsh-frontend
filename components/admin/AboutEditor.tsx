"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  adminCreateContactLink,
  adminDeleteContactLink,
  adminPutContactLink,
  adminUpdateAboutSection,
} from "@/lib/adminApi";
import type { AboutSection, AboutSectionKey, ContactLink } from "@/lib/types";
import DragHandle from "./DragHandle";
import { AdminIcon } from "./icons";

const SECTION_META: Record<
  AboutSectionKey,
  { num: string; label: string }
> = {
  who: { num: "01", label: "Who" },
  what: { num: "02", label: "What" },
  why: { num: "03", label: "Why" },
};

const SECTION_ORDER: AboutSectionKey[] = ["who", "what", "why"];

type DraftContact = ContactLink & { _new?: boolean };

interface AboutEditorProps {
  initialSections: AboutSection[];
  initialContacts: ContactLink[];
}

let tempId = 0;
function nextTempId() {
  tempId -= 1;
  return tempId;
}

export default function AboutEditor({
  initialSections,
  initialContacts,
}: AboutEditorProps) {
  const orderedSections = SECTION_ORDER.map((key) => {
    const section = initialSections.find((s) => s.section_key === key);
    if (!section) {
      return { id: 0, section_key: key, body: "" };
    }
    return section;
  });

  const [sections, setSections] = useState(orderedSections);
  const [contacts, setContacts] = useState<DraftContact[]>(
    [...initialContacts].sort((a, b) => a.sort_order - b.sort_order)
  );
  const baselineSections = useRef(
    orderedSections.map((s) => ({ id: s.id, body: s.body }))
  );
  const baselineContactIds = useRef(initialContacts.map((c) => c.id));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function markDirty() {
    setDirty(true);
    setSaved(false);
  }

  function setSectionBody(id: number, body: string) {
    setSections((s) => s.map((sec) => (sec.id === id ? { ...sec, body } : sec)));
    markDirty();
  }

  function setContact(id: number, key: "label" | "url", value: string) {
    setContacts((c) =>
      c.map((ct) => (ct.id === id ? { ...ct, [key]: value } : ct))
    );
    markDirty();
  }

  function addContact() {
    setContacts((c) => [
      ...c,
      {
        id: nextTempId(),
        label: "",
        url: "",
        sort_order: c.length,
        _new: true,
      },
    ]);
    markDirty();
  }

  function removeContact(id: number) {
    setContacts((c) => c.filter((ct) => ct.id !== id));
    markDirty();
  }

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(index: number) {
    const from = dragIndex.current;
    if (from === null || from === index) {
      setDragOverIndex(null);
      return;
    }
    setContacts((items) => {
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next.map((item, i) => ({ ...item, sort_order: i }));
    });
    dragIndex.current = null;
    setDragOverIndex(null);
    markDirty();
  }

  function handleDragEnd() {
    dragIndex.current = null;
    setDragOverIndex(null);
  }

  async function handleSaveAll() {
    setSaving(true);
    try {
      for (const sec of sections) {
        const baseline = baselineSections.current.find((b) => b.id === sec.id);
        if (baseline && baseline.body === sec.body) continue;
        await adminUpdateAboutSection(sec.id, { body: sec.body });
      }

      const currentIds = new Set(
        contacts.filter((c) => !c._new && c.id > 0).map((c) => c.id)
      );
      const toDelete = baselineContactIds.current.filter(
        (id) => !currentIds.has(id)
      );
      for (const id of toDelete) {
        await adminDeleteContactLink(id);
      }

      const savedContacts: ContactLink[] = [];
      for (let i = 0; i < contacts.length; i++) {
        const ct = contacts[i];
        const payload = {
          label: ct.label,
          url: ct.url,
          sort_order: i,
        };
        if (ct._new || ct.id <= 0) {
          const created = await adminCreateContactLink(payload);
          savedContacts.push(created);
        } else {
          const updated = await adminPutContactLink(ct.id, payload);
          savedContacts.push(updated);
        }
      }

      baselineSections.current = sections.map((s) => ({
        id: s.id,
        body: s.body,
      }));
      baselineContactIds.current = savedContacts.map((c) => c.id);
      setContacts(savedContacts);
      setDirty(false);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      setSaved(true);
      savedTimer.current = setTimeout(() => setSaved(false), 2200);
    } catch {
      alert("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">About</div>
          <div className="breadcrumb">
            <Link href="/admin" className="bc-link">
              Admin
            </Link>
            <span>/</span>
            <span>About</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">About Sections</div>
            <div className="card-sub">
              Three sections displayed on the /about page in order
            </div>
          </div>
        </div>
        {sections.map((sec, i) => {
          const meta = SECTION_META[sec.section_key];
          const wordCount = sec.body.trim()
            ? sec.body.trim().split(/\s+/).length
            : 0;
          return (
            <div
              key={sec.section_key}
              className="about-section-block"
              style={
                i === sections.length - 1 ? { borderBottom: "none" } : undefined
              }
            >
              <div className="about-section-grid">
                <div>
                  <div className="about-section-num">{meta.num}</div>
                  <div className="about-section-name">
                    {meta.label.toUpperCase()}
                  </div>
                </div>
                <div>
                  <textarea
                    className="field-textarea"
                    value={sec.body}
                    onChange={(e) => setSectionBody(sec.id, e.target.value)}
                    rows={6}
                    placeholder={`Write the ${meta.label} section...`}
                  />
                  <div className="about-char-count">
                    {sec.body.length} CHARS · {wordCount} WORDS
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="contact-list">
        <div className="contact-list-head">
          <div>
            <div className="card-title">Contact Links</div>
            <div className="card-sub">
              Shown at the bottom of the About page
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={addContact}>
            <AdminIcon d="M12 5v14 M5 12h14" size={10} />
            Add Link
          </button>
        </div>

        <div className="contact-col-headers">
          <div />
          <div>LABEL</div>
          <div>URL / VALUE</div>
          <div />
        </div>

        {contacts.map((ct, index) => (
          <div
            key={ct.id}
            className={`contact-admin-row${dragOverIndex === index ? " drag-over" : ""}`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(index);
            }}
          >
            <div
              className="contact-drag"
              title="Drag to reorder"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
            >
              <DragHandle />
            </div>
            <input
              className="contact-label-input"
              value={ct.label}
              onChange={(e) => setContact(ct.id, "label", e.target.value)}
              placeholder="LABEL"
            />
            <input
              className="contact-url-input"
              value={ct.url}
              onChange={(e) => setContact(ct.id, "url", e.target.value)}
              placeholder="https://... or email@domain.com"
            />
            <button
              className="btn-icon"
              onClick={() => removeContact(ct.id)}
              title="Remove"
              type="button"
            >
              <AdminIcon d="M18 6L6 18 M6 6l12 12" size={12} />
            </button>
          </div>
        ))}

        <div className="contact-add-wrap">
          <button className="add-row-btn" onClick={addContact} type="button">
            <AdminIcon d="M12 5v14 M5 12h14" size={11} />
            Add Contact Link
          </button>
        </div>
      </div>

      <div className="save-bar">
        <span className={`save-hint${saved ? " saved" : ""}`}>
          {saved ? "Saved ✓" : dirty ? "UNSAVED CHANGES" : "ALL CHANGES SAVED"}
        </span>
        <button
          className="btn btn-primary"
          onClick={handleSaveAll}
          disabled={saving || !dirty}
        >
          <AdminIcon
            d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8"
            size={11}
          />
          {saving ? "Saving…" : "Save All"}
        </button>
      </div>
    </div>
  );
}
