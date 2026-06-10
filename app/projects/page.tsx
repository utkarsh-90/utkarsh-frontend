import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ProjectListRow from "@/components/ProjectListRow";
import { getConfig, getProjects } from "@/lib/api";

export const revalidate = 60;

export default async function ProjectsPage() {
  const [projects, config] = await Promise.all([getProjects(), getConfig()]);

  const metaStatus = config.building_now
    ? `BUILDING · ${config.building_now.toUpperCase()}`
    : "";

  return (
    <>
      <Nav page="projects" metaStatus={metaStatus} />
      <div className="page-wrap">
        <div className="outer">
          <div style={{ marginBottom: 40 }}>
            <h1 className="h1 mb-8">PROJECTS</h1>
            <span className="mono-sm text-muted">
              02 / THINGS BUILT, SHIPPED, OR ABANDONED
            </span>
          </div>

          {projects.map((p, i) => (
            <ProjectListRow key={p.slug} project={p} index={i} />
          ))}
        </div>
        <Footer />
      </div>
    </>
  );
}
