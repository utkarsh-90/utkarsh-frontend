"use client";

import { useRef, useState } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export default function TagInput({
  tags,
  onChange,
  placeholder = "Next.js, React…",
}: TagInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag(val: string) {
    const trimmed = val.trim().replace(/,$/, "").trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && input === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div
        className="tag-input-wrap"
        onClick={() => inputRef.current?.focus()}
        onKeyDown={() => {}}
        role="presentation"
      >
        {tags.map((tag, i) => (
          <span className="chip" key={tag}>
            {tag}
            <button
              type="button"
              className="chip-del"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(i);
              }}
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="tag-text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => {
            if (input.trim()) addTag(input);
          }}
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>
      <div className="tag-hint">
        PRESS ENTER OR COMMA TO ADD · BACKSPACE TO REMOVE
      </div>
    </div>
  );
}
