import { notFound } from "next/navigation";
import ProjectEditor from "@/components/admin/ProjectEditor";
import { adminGetProject } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

interface EditProjectPageProps {
  params: { id: string };
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const project = await adminGetProject(id).catch(() => null);
  if (!project) notFound();

  return <ProjectEditor project={project} />;
}
