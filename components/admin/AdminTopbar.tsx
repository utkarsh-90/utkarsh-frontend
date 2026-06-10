"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const PAGE_NAMES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/posts": "Posts",
  "/admin/projects": "Projects",
  "/admin/reading": "Reading",
  "/admin/config": "Site Config",
  "/admin/about": "About",
};

function getPageName(pathname: string): string {
  if (PAGE_NAMES[pathname]) return PAGE_NAMES[pathname];
  const match = Object.entries(PAGE_NAMES).find(
    ([path]) => path !== "/admin" && pathname.startsWith(path)
  );
  return match ? match[1] : "Dashboard";
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const pageName = getPageName(pathname);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="topbar">
      <div className="topbar-left">Admin Panel</div>
      <div className="topbar-center">
        <Link href="/admin" className="bc-link">
          Admin
        </Link>
        <span>/</span>
        <span>{pageName}</span>
      </div>
      <div className="topbar-right">
        <Link href="/" className="topbar-link" target="_blank">
          View Site ↗
        </Link>
        <button
          type="button"
          className="topbar-link topbar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
