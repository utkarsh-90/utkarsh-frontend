"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import DragHandle from "@/components/admin/DragHandle";
import { adminReorderProjects } from "@/lib/adminApi";
import type { Project, ProjectStatus } from "@/lib/types";
import { statusLabel } from "@/lib/utils";

type StatusFilter = "all" | ProjectStatus;

const FILTERS: StatusFilter[] = ["all", "shipped", "wip", "archived"];

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All",
  shipped: "Shipped",
  wip: "In Progress",
  archived: "Archived",
};

interface ProjectsListProps {
  projects: Project[];
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      {statusLabel(status)}
    </span>
  );
}

export default function ProjectsList({ projects: initialProjects }: ProjectsListProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  const counts = useMemo(() => {
    const result: Record<StatusFilter, number> = {
      all: projects.length,
      shipped: 0,
      wip: 0,
      archived: 0,
    };
    for (const project of projects) {
      result[project.status]++;
    }
    return result;
  }, [projects]);

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter);

  const shippedCount = projects.filter((p) => p.status === "shipped").length;
  const wipCount = projects.filter((p) => p.status === "wip").length;
  const archivedCount = projects.filter((p) => p.status === "archived").length;

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

    const next = [...projects];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(index, 0, moved);
    setProjects(next);
    setDragIdx(null);
    setOverIdx(null);

    setReordering(true);
    try {
      await adminReorderProjects(next.map((p) => p.id));
    } catch {
      setProjects(initialProjects);
      alert("Failed to reorder projects. Please try again.");
    } finally {
      setReordering(false);
    }
  }

  function handleDragEnd() {
    setDragIdx(null);
    setOverIdx(null);
  }

  return (
    <div className="projects-list-wrap">
      <div className="page-header">
        <div>
          <div className="page-title">Projects</div>
          <div className="breadcrumb">
            <Link href="/admin" className="bc-link">
              Admin
            </Link>
            <span>/</span>
            <span>Projects</span>
          </div>
        </div>
        <div className="projects-header-actions">
          <span className="drag-note">
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
          </span>
          <Link href="/admin/projects/new" className="btn btn-primary">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Project
          </Link>
        </div>
      </div>

      <div className="projects-list-inner">
        <div className="proj-filter-bar">
          {FILTERS.map((f, i) => (
            <span key={f} style={{ display: "contents" }}>
              <button
                type="button"
                className={`proj-filter-tab${filter === f ? " active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {FILTER_LABELS[f]}
                <span className="proj-filter-count">{counts[f]}</span>
              </button>
              {i < FILTERS.length - 1 && <div className="filter-sep" />}
            </span>
          ))}
        </div>

        <div className="proj-list-tbl">
          <div className="proj-list-header">
            <span className="proj-list-label">
              {filter === "all"
                ? "All Projects"
                : `${FILTER_LABELS[filter]} (${filtered.length})`}
            </span>
            <span className="proj-list-meta">
              {shippedCount} SHIPPED · {wipCount} WIP · {archivedCount} ARCHIVED
              {reordering ? " · SAVING ORDER…" : ""}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="projects-empty">No projects match this filter</div>
          ) : (
            filtered.map((project, i) => {
              const origIdx = projects.indexOf(project);
              return (
                <div
                  key={project.id}
                  className={`proj-row${dragIdx === origIdx ? " dragging" : ""}${overIdx === origIdx ? " drag-over" : ""}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, origIdx)}
                  onDragOver={(e) => handleDragOver(e, origIdx)}
                  onDrop={(e) => handleDrop(e, origIdx)}
                  onDragEnd={handleDragEnd}
                  onClick={() => router.push(`/admin/projects/${project.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(`/admin/projects/${project.id}`);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    role="presentation"
                  >
                    <DragHandle />
                  </div>
                  <div className="proj-num">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="proj-row-main">
                    <div className="proj-name">{project.name}</div>
                    {project.description && (
                      <div className="proj-desc">{project.description}</div>
                    )}
                    {project.stack.length > 0 && (
                      <div className="stack-tags">
                        {project.stack.map((tag) => (
                          <span key={tag} className="stack-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="proj-row-badge">
                    <StatusBadge status={project.status} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
