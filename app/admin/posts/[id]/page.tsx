import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { adminGetPost } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: { id: string };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const post = await adminGetPost(id).catch(() => null);
  if (!post) notFound();

  return <PostEditor post={post} />;
}
