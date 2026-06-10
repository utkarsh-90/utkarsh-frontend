"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  adminCreateReading,
  adminDeleteReading,
  adminReorderReading,
  adminUpdateReading,
} from "@/lib/adminApi";
import type { ReadingFormat, ReadingItem, ReadingSection } from "@/lib/types";

type TabId = ReadingSection;

interface TabConfig {
  id: TabId;
  label: string;
  isBounced: boolean;
}

const TABS: TabConfig[] = [
  { id: "currently_reading", label: "Currently Reading", isBounced: false },
  { id: "recent", label: "Finished Recently", isBounced: false },
  { id: "papers", label: "Papers", isBounced: false },
  { id: "bounced", label: "Bounced Off", isBounced: true },
];

type DraftItem = ReadingItem & { _new?: boolean };

interface ReadingSectionProps {
  items: ReadingItem[];
}

function defaultFormat(tabId: TabId, isBounced: boolean): ReadingFormat {
  if (isBounced) return "book";
  if (tabId === "papers") return "paper";
  return "book";
}

interface ReadingRowProps {
  item: DraftItem;
  index: number;
  isBounced: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onUpdate: (item: DraftItem) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

function ReadingRow({
  item,
  index,
  isBounced,
  isDragging,
  isDragOver,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: ReadingRowProps) {
  const [expanded, setExpanded] = useState(!!item._new);
  const [draft, setDraft] = useState<DraftItem>({ ...item });
  const [saving, setSaving] = useState(false);

  const field = isBounced ? "reason" : "note";
  const fieldLabel = isBounced ? "Reason for Avoiding" : "Note";
  const fieldPlaceholder = isBounced
    ? "Why are you avoiding this? Be honest..."
    : "What did you take away? Optional...";
  const previewText = item[field];

  function set<K extends keyof DraftItem>(key: K, value: DraftItem[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate(draft);
      setExpanded(false);
    } catch {
      alert("Failed to save entry. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (item._new) {
      void onDelete(item.id);
      return;
    }
    setDraft({ ...item });
    setExpanded(false);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this entry? This cannot be undone.")) return;
    await onDelete(item.id);
  }

  return (
    <div
      className={`reading-row${isDragging ? " dragging" : ""}${isDragOver ? " drag-over" : ""}${expanded ? " expanded" : ""}`}
      draggable={!expanded}
      onDragStart={(e) => {
        if (!expanded) onDragStart(e, index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(e, index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, index);
      }}
      onDragEnd={onDragEnd}
    >
      <div
        className="row-collapsed"
        onClick={() => {
          if (!expanded) {
            setDraft({ ...item });
            setExpanded(true);
          }
        }}
        onKeyDown={(e) => {
          if (!expanded && (e.key === "Enter" || e.key === " ")) {
            setExpanded(true);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div
          className="row-drag"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="presentation"
          title="Drag to reorder"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="drag-dot" />
          ))}
        </div>

        <div className="row-num">{String(index + 1).padStart(2, "0")}</div>

        <div className="row-main">
          <span
            className={`row-title${isBounced ? " bounced" : ""}`}
            title={item.title}
          >
            {item.title || (
              <span style={{ color: "var(--t3)", fontWeight: 400 }}>
                Untitled
              </span>
            )}
          </span>
          {(item.author || item.year) && (
            <span className="row-author">
              {item.author}
              {item.year ? ` · ${item.year}` : ""}
            </span>
          )}
          {item.format && (
            <span className="row-format-tag">{item.format}</span>
          )}
          {previewText && !expanded && (
            <span className="row-note-preview">{previewText}</span>
          )}
        </div>

        <div
          className="row-actions"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="presentation"
        >
          <button
            type="button"
            className="row-del"
            title="Delete"
            onClick={() => void handleDelete()}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
          <button
            type="button"
            className={`row-expanded-toggle${expanded ? " open" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => {
                if (!v) setDraft({ ...item });
                return !v;
              });
            }}
            title={expanded ? "Collapse" : "Expand to edit"}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div
          className="row-expand"
          onKeyDown={(e) => {
            if (e.key === "Escape") handleCancel();
          }}
        >
          <div className="expand-field">
            <label className="expand-label" htmlFor={`title-${item.id}`}>
              Title
            </label>
            <input
              id={`title-${item.id}`}
              className="expand-input"
              autoFocus
              value={draft.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Book or paper title"
            />
          </div>

          <div className="expand-field">
            <label className="expand-label" htmlFor={`author-${item.id}`}>
              Author
            </label>
            <input
              id={`author-${item.id}`}
              className="expand-input"
              value={draft.author}
              onChange={(e) => set("author", e.target.value)}
              placeholder="Author name"
            />
          </div>

          <div className="expand-field">
            <label className="expand-label" htmlFor={`year-${item.id}`}>
              Year
            </label>
            <input
              id={`year-${item.id}`}
              className="expand-input"
              value={draft.year ?? ""}
              onChange={(e) => {
                const val = e.target.value.trim();
                set("year", val ? Number(val) : null);
              }}
              placeholder="2024"
            />
          </div>

          <div className="expand-field">
            <label className="expand-label" htmlFor={`format-${item.id}`}>
              Format
            </label>
            <select
              id={`format-${item.id}`}
              className="expand-select"
              value={draft.format}
              onChange={(e) => set("format", e.target.value as ReadingFormat)}
            >
              <option value="book">BOOK</option>
              <option value="paper">PAPER</option>
              <option value="essay">ESSAY</option>
            </select>
          </div>

          <div className="expand-field expand-full-row">
            <div>
              <label className="expand-label" htmlFor={`note-${item.id}`}>
                {fieldLabel}
              </label>
              <textarea
                id={`note-${item.id}`}
                className="expand-textarea"
                value={draft[field] ?? ""}
                onChange={(e) => set(field, e.target.value)}
                placeholder={fieldPlaceholder}
                rows={2}
              />
            </div>
            <div className="expand-actions">
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-xs"
                onClick={() => void handleSave()}
                disabled={saving}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ReadingListProps {
  section: TabId;
  isBounced: boolean;
  items: DraftItem[];
  onItemsChange: (items: DraftItem[]) => void;
}

function ReadingList({
  section,
  isBounced,
  items,
  onItemsChange,
}: ReadingListProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);
  const tempIdRef = useRef(-1);

  async function handleUpdate(updated: DraftItem) {
    const year =
      updated.year === null ||
      updated.year === undefined ||
      Number.isNaN(Number(updated.year))
        ? null
        : Number(updated.year);

    if (updated._new) {
      const created = await adminCreateReading({
        title: updated.title,
        author: updated.author,
        year,
        format: updated.format,
        note: updated.note ?? "",
        reason: updated.reason ?? "",
        section,
        sort_order: items.length,
      });
      onItemsChange(
        items.map((i) =>
          i.id === updated.id ? { ...created, _new: false } : i
        )
      );
      return;
    }

    const saved = await adminUpdateReading(updated.id, {
      title: updated.title,
      author: updated.author,
      year,
      format: updated.format,
      note: updated.note,
      reason: updated.reason,
    });
    onItemsChange(
      items.map((i) => (i.id === updated.id ? { ...saved, _new: false } : i))
    );
  }

  async function handleDelete(id: number) {
    if (id < 0) {
      onItemsChange(items.filter((i) => i.id !== id));
      return;
    }
    try {
      await adminDeleteReading(id);
      onItemsChange(items.filter((i) => i.id !== id));
    } catch {
      alert("Failed to delete entry. Please try again.");
    }
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    setDragIdx(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (index !== overIdx) setOverIdx(index);
  }

  async function handleDrop(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === index) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }

    const next = [...items];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(index, 0, moved);
    onItemsChange(next);
    setDragIdx(null);
    setOverIdx(null);

    const persisted = next.filter((i) => !i._new && i.id > 0);
    if (persisted.length === 0) return;

    setReordering(true);
    try {
      await adminReorderReading(persisted.map((i) => i.id));
    } catch {
      alert("Failed to reorder entries. Please try again.");
    } finally {
      setReordering(false);
    }
  }

  function handleDragEnd() {
    setDragIdx(null);
    setOverIdx(null);
  }

  function addItem() {
    tempIdRef.current -= 1;
    const newItem: DraftItem = {
      id: tempIdRef.current,
      title: "",
      author: "",
      year: null,
      format: defaultFormat(section, isBounced),
      note: "",
      reason: "",
      section,
      sort_order: items.length,
      _new: true,
    };
    onItemsChange([...items, newItem]);
  }

  const noteLabel = isBounced ? "Reason" : "Note";

  return (
    <div className="reading-list-wrap">
      <div className="list-toolbar">
        <div className="list-toolbar-left">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          DRAG TO REORDER
          <span style={{ color: "var(--border)", margin: "0 4px" }}>·</span>
          CLICK ROW TO EDIT
        </div>
        <span className="list-toolbar-hint">
          {items.length} {items.length === 1 ? "ENTRY" : "ENTRIES"}
          {reordering ? " · SAVING ORDER…" : ""}
        </span>
      </div>

      <div className="reading-col-headers">
        <div />
        <div />
        <div className="reading-col-labels">
          {["TITLE", "AUTHOR · YEAR", "FORMAT", `${noteLabel} PREVIEW`].map(
            (label) => (
              <span key={label} className="reading-col-label">
                {label}
              </span>
            )
          )}
        </div>
        <div />
      </div>

      {items.length === 0 ? (
        <div className="reading-empty">No entries yet. Add one below.</div>
      ) : (
        items.map((item, i) => (
          <ReadingRow
            key={item.id}
            item={item}
            index={i}
            isBounced={isBounced}
            isDragging={dragIdx === i}
            isDragOver={overIdx === i}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        ))
      )}

      <div className="add-row">
        <button type="button" className="add-btn" onClick={addItem}>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Item
        </button>
      </div>
    </div>
  );
}

export default function ReadingSection({ items: initialItems }: ReadingSectionProps) {
  const [activeTab, setActiveTab] = useState<TabId>("currently_reading");
  const [itemsBySection, setItemsBySection] = useState<
    Record<TabId, DraftItem[]>
  >(() => {
    const grouped: Record<TabId, DraftItem[]> = {
      currently_reading: [],
      recent: [],
      papers: [],
      bounced: [],
    };
    for (const item of initialItems) {
      grouped[item.section].push({ ...item });
    }
    return grouped;
  });

  const counts = useMemo(
    () => ({
      currently_reading: itemsBySection.currently_reading.length,
      recent: itemsBySection.recent.length,
      papers: itemsBySection.papers.length,
      bounced: itemsBySection.bounced.length,
    }),
    [itemsBySection]
  );

  const tab = TABS.find((t) => t.id === activeTab)!;

  function updateSectionItems(section: TabId, items: DraftItem[]) {
    setItemsBySection((prev) => ({ ...prev, [section]: items }));
  }

  return (
    <div className="reading-section-wrap">
      <div className="page-header">
        <div>
          <div className="page-title">Reading</div>
          <div className="breadcrumb">
            <Link href="/admin" className="bc-link">
              Admin
            </Link>
            <span>/</span>
            <span>Reading</span>
          </div>
        </div>
      </div>

      <div className="tabs-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tab-btn${activeTab === t.id ? " active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
            <span className="tab-count">{counts[t.id]}</span>
          </button>
        ))}
      </div>

      <ReadingList
        key={activeTab}
        section={tab.id}
        isBounced={tab.isBounced}
        items={itemsBySection[tab.id]}
        onItemsChange={(items) => updateSectionItems(tab.id, items)}
      />
    </div>
  );
}
