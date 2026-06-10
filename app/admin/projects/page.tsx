import ProjectsList from "@/components/admin/ProjectsList";
import { adminGetProjects } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await adminGetProjects();

  return <ProjectsList projects={projects} />;
}
