"use client";

export default function BackToTop() {
  return (
    <button
      type="button"
      className="post-back"
      onClick={() => {
        document.documentElement.scrollTop = 0;
      }}
    >
      ↑ BACK TO TOP
    </button>
  );
}
