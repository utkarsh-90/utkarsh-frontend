import ProjectEditor from "@/components/admin/ProjectEditor";
import { adminGetProjects } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const projects = await adminGetProjects();
  const nextSortOrder =
    projects.length > 0
      ? Math.max(...projects.map((p) => p.sort_order)) + 1
      : 0;

  return <ProjectEditor nextSortOrder={nextSortOrder} />;
}
