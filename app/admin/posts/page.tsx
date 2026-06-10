import PostsList from "@/components/admin/PostsList";
import { adminGetPosts } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await adminGetPosts();

  return <PostsList posts={posts} />;
}
