import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { getConfig, getProject, getProjects } from "@/lib/api";
import { statusClass, statusLabel } from "@/lib/utils";

export const revalidate = 60;

interface ProjectDetailPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const [project, projects, config] = await Promise.all([
    getProject(params.slug).catch(() => null),
    getProjects(),
    getConfig(),
  ]);

  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === params.slug);
  const prev = projects[idx - 1];
  const next = projects[idx + 1];

  const metaStatus = config.building_now
    ? `BUILDING · ${config.building_now.toUpperCase()}`
    : "";

  const sections: [string, string][] = [
    ["01 / PROBLEM", project.problem],
    ["02 / APPROACH", project.approach],
    ["03 / WHAT I LEARNED", project.learned],
  ];

  return (
    <>
      <Nav page={`projects/${params.slug}`} metaStatus={metaStatus} />
      <div className="page-wrap">
        <div className="outer-narrow">
          <Link href="/projects" className="post-back">
            ← PROJECTS
          </Link>

          <div className="post-meta-row">
            <span className={statusClass(project.status)}>
              {statusLabel(project.status)}
            </span>
            <span className="post-meta-sep">·</span>
            <span>{project.stack.join(" / ")}</span>
          </div>

          <h1 className="h1" style={{ marginBottom: 0 }}>
            {project.name}
          </h1>
          <div className="post-accent-rule"></div>

          {sections.map(([label, body]) => (
            <div key={label}>
              <div className="proj-section-label">{label}</div>
              <div className="proj-section-body">{body}</div>
            </div>
          ))}

          <div className="proj-section-label">04 / STACK</div>
          <div
            className="proj-section-body mono-sm"
            style={{ color: "var(--t2)" }}
          >
            {project.stack.join(" / ")}
          </div>

          <div className="proj-section-label">05 / LINKS</div>
          <div className="proj-section-body" style={{ display: "flex", gap: 24 }}>
            {project.github_url && (
              <a
                href={project.github_url}
                className="post-back"
                style={{ fontSize: 12 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                GITHUB ↗
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                className="post-back"
                style={{ fontSize: 12 }}
                target="_blank"
                rel="noopener noreferrer"
              >
                LIVE SITE ↗
              </a>
            )}
          </div>

          <div className="proj-prev-next">
            {prev ? (
              <Link href={`/projects/${prev.slug}`} className="proj-nav-btn">
                ← {prev.name.toUpperCase()}
              </Link>
            ) : (
              <span></span>
            )}
            {next && (
              <Link href={`/projects/${next.slug}`} className="proj-nav-btn">
                {next.name.toUpperCase()} →
              </Link>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
