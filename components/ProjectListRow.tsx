"use client";

import Link from "next/link";
import type { Project } from "@/lib/types";
import { linkStyle, statusClass, statusLabel, zeroPad } from "@/lib/utils";

interface ProjectListRowProps {
  project: Project;
  index: number;
}

export default function ProjectListRow({ project, index }: ProjectListRowProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="proj-list-row"
      style={linkStyle}
    >
      <div>
        <div className="proj-list-num">{zeroPad(index + 1)}</div>
        <div className={`proj-list-status ${statusClass(project.status)}`}>
          {statusLabel(project.status)}
        </div>
      </div>
      <div>
        <div className="proj-list-name">{project.name}</div>
        <div className="proj-list-desc">{project.description}</div>
        <div className="proj-list-stack">{project.stack.join(" / ")}</div>
      </div>
      <div className="proj-list-meta">
        <div>STATUS</div>
        <div className={statusClass(project.status)}>
          {statusLabel(project.status)}
        </div>
        <div style={{ marginTop: 12 }}>STACK</div>
        <div style={{ color: "var(--t2)" }}>
          {project.stack.slice(0, 2).join(", ")}
        </div>
        <div style={{ marginTop: 12 }}>
          {project.github_url && (
            <>
              <button
                type="button"
                className="proj-list-meta"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(project.github_url, "_blank", "noopener,noreferrer");
                }}
                style={{
                  color: "var(--accent)",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  font: "inherit",
                  letterSpacing: "inherit",
                  padding: 0,
                }}
              >
                GITHUB ↗
              </button>
              <br />
            </>
          )}
          {project.live_url && (
            <button
              type="button"
              className="proj-list-meta"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(project.live_url, "_blank", "noopener,noreferrer");
              }}
              style={{
                color: "var(--accent)",
                cursor: "pointer",
                background: "none",
                border: "none",
                font: "inherit",
                letterSpacing: "inherit",
                padding: 0,
              }}
            >
              LIVE ↗
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
