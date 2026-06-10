import CurrentlyStrip from "@/components/admin/CurrentlyStrip";
import {
  adminGetConfig,
  adminGetPosts,
  adminGetProjects,
  adminGetReading,
} from "@/lib/adminApi";
import { formatPostDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function postBadgeClass(status: string) {
  return status === "published" ? "badge-published" : "badge-draft";
}

export default async function AdminDashboardPage() {
  const [posts, projects, reading, config] = await Promise.all([
    adminGetPosts(),
    adminGetProjects(),
    adminGetReading(),
    adminGetConfig(),
  ]);

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const recentPosts = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const stats = [
    { num: posts.length, label: "Total Posts", accent: true },
    { num: publishedCount, label: "Published Posts", accent: false },
    { num: projects.length, label: "Total Projects", accent: false },
    { num: reading.length, label: "Reading Items", accent: false },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="breadcrumb">
            <span>Admin</span>
            <span>/</span>
            <span>Dashboard</span>
          </div>
        </div>
      </div>

      <div className="stats-row">
        {stats.map((s) => (
          <div className="stat-card" key={s.label}>
            <div className={`stat-num${s.accent ? " accent" : ""}`}>
              {String(s.num).padStart(2, "0")}
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <CurrentlyStrip initialConfig={config} />

      <div className="table-wrap">
        <div className="table-header">
          <div>
            <div className="table-title">Recent Posts</div>
            <div className="table-meta">Last 5 posts</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentPosts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div className="td-title">{post.title}</div>
                </td>
                <td>
                  <span className={`badge ${postBadgeClass(post.status)}`}>
                    {post.status}
                  </span>
                </td>
                <td className="td-mono">{formatPostDate(post.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
