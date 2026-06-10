"use client";

import { FormEvent, useState } from "react";

export default function Newsletter() {
  const [val, setVal] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="mono text-muted" style={{ padding: "24px 0" }}>
        YOU&apos;RE IN. SEE YOU IN YOUR INBOX.
      </p>
    );
  }

  return (
    <div className="nl-wrap">
      <p className="nl-desc">
        Essays on tech, AI, and the things in between. Monthly-ish, no filler.
      </p>
      <form
        className="nl-form"
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          if (val.trim()) setDone(true);
        }}
      >
        <input
          className="nl-input"
          type="email"
          placeholder="your@email.com"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
        <button className="nl-btn" type="submit">
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
}
