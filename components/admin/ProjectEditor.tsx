"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TagInput from "@/components/admin/TagInput";
import {
  adminCreateProject,
  adminDeleteProject,
  adminUpdateProject,
} from "@/lib/adminApi";
import type { Project, ProjectStatus } from "@/lib/types";
import { slugify, statusLabel } from "@/lib/utils";

const STATUSES: ProjectStatus[] = ["shipped", "wip", "archived"];

function segClass(status: ProjectStatus, active: ProjectStatus): string {
  if (status !== active) return "seg-opt";
  if (status === "shipped") return "seg-opt active-shipped";
  if (status === "wip") return "seg-opt active-wip";
  return "seg-opt active-archived";
}

function segLabel(status: ProjectStatus): string {
  if (status === "wip") return "WIP";
  if (status === "shipped") return "DONE";
  return "ARCH";
}

interface ProjectEditorProps {
  project?: Project;
  nextSortOrder?: number;
}

export default function ProjectEditor({
  project,
  nextSortOrder = 0,
}: ProjectEditorProps) {
  const router = useRouter();
  const isNew = !project;

  const [name, setName] = useState(project?.name ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(!!project);
  const [status, setStatus] = useState<ProjectStatus>(
    project?.status ?? "wip"
  );
  const [description, setDescription] = useState(project?.description ?? "");
  const [stack, setStack] = useState<string[]>(project?.stack ?? []);
  const [problem, setProblem] = useState(project?.problem ?? "");
  const [approach, setApproach] = useState(project?.approach ?? "");
  const [learned, setLearned] = useState(project?.learned ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.live_url ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!slugEdited && name) {
      setSlug(slugify(name));
    }
  }, [name, slugEdited]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        name,
        slug,
        status,
        description,
        stack,
        problem,
        approach,
        learned,
        github_url: githubUrl,
        live_url: liveUrl,
        sort_order: project?.sort_order ?? nextSortOrder,
      };

      if (isNew) {
        await adminCreateProject(payload);
      } else {
        await adminUpdateProject(project.id, payload);
      }

      router.push("/admin/projects");
    } catch {
      alert("Failed to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!project) return;
    if (!window.confirm("Delete this project? This cannot be undone.")) return;

    setSaving(true);
    try {
      await adminDeleteProject(project.id);
      router.push("/admin/projects");
    } catch {
      alert("Failed to delete project. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="project-editor-shell">
      <div className="project-editor-topbar">
        <div className="project-editor-topbar-left">
          <Link
            href="/admin/projects"
            className="btn btn-ghost btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
          >
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Projects
          </Link>
          <span className="project-editor-sep">/</span>
          <span className="project-editor-crumb">
            {isNew ? "New Project" : "Editing"}
          </span>
          {!isNew && (
            <>
              <span className="project-editor-sep">/</span>
              <span className="project-editor-name">{name}</span>
            </>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {liveUrl && (
            <a
              href={liveUrl}
              className="btn btn-ghost btn-sm"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
              </svg>
              View Live
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              className="btn btn-ghost btn-sm"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14L21 3" />
              </svg>
              GitHub
            </a>
          )}
        </div>
      </div>

      <div className="project-editor-main">
        <div className="project-editor-body">
          <input
            className="project-editor-name-input"
            placeholder="Project name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="field-section" style={{ marginTop: 24 }}>
            <div className="field-label">
              Description{" "}
              <span className="field-label-hint">SHORT SUMMARY FOR LISTING</span>
            </div>
            <textarea
              className="field-textarea sm"
              placeholder="One or two sentences describing what this project does and why you built it..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="section-divider" />

          <div className="section-title">Case Study</div>

          <div className="field-section">
            <div className="field-label">01 / Problem</div>
            <textarea
              className="field-textarea lg"
              placeholder="What problem were you solving? Why did it matter? Be specific about the gap you identified..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
            />
          </div>

          <div className="field-section">
            <div className="field-label">02 / Approach</div>
            <textarea
              className="field-textarea lg"
              placeholder="How did you build it? What key technical decisions did you make and why? What tradeoffs did you accept..."
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
            />
          </div>

          <div className="field-section">
            <div className="field-label">03 / What I Learned</div>
            <textarea
              className="field-textarea md"
              placeholder="What would you do differently? What surprised you? What became obvious only after shipping..."
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
            />
          </div>
        </div>

        <div className="project-editor-sidebar">
          <div className="esb-section">
            <span className="esb-label">Status</span>
            <div className="seg-ctrl">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={segClass(s, status)}
                  onClick={() => setStatus(s)}
                >
                  {segLabel(s)}
                </button>
              ))}
            </div>
            <div className="esb-status-preview">
              <span className={`badge badge-${status}`}>
                {statusLabel(status)}
              </span>
            </div>
          </div>

          <div className="esb-section">
            <span className="esb-label">Slug</span>
            <input
              className="esb-input"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              placeholder="project-slug"
            />
            <div className="esb-slug-preview">/projects/{slug || "—"}</div>
          </div>

          <div className="esb-section">
            <span className="esb-label">Stack</span>
            <TagInput tags={stack} onChange={setStack} />
          </div>

          <div className="esb-section">
            <span className="esb-label">Links</span>
            <div style={{ marginBottom: 10 }}>
              <div className="esb-link-label">GitHub</div>
              <input
                className="link-input"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <div className="esb-link-label">Live URL</div>
              <input
                className="link-input"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="post-editor-bottom-bar">
        {!isNew ? (
          <button
            type="button"
            className="btn-danger-text"
            onClick={handleDelete}
            disabled={saving}
          >
            Delete
          </button>
        ) : (
          <span />
        )}
        <div className="post-editor-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
