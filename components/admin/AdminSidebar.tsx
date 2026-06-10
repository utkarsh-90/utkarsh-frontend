"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminIcon, adminIcons } from "./icons";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: adminIcons.grid, exact: true },
  { type: "sep" as const, label: "Content" },
  { href: "/admin/posts", label: "Posts", icon: adminIcons.file },
  { href: "/admin/projects", label: "Projects", icon: adminIcons.folder },
  { href: "/admin/reading", label: "Reading", icon: adminIcons.book },
  { type: "sep" as const, label: "Site" },
  { href: "/admin/config", label: "Site Config", icon: adminIcons.settings },
  { href: "/admin/about", label: "About", icon: adminIcons.user },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-text">{"//"} UTKARSH PANCHAL</span>
      </div>
      <nav className="sidebar-nav">
        {NAV.map((item, i) =>
          item.type === "sep" ? (
            <div key={i} className="sidebar-section-label">
              {item.label}
            </div>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link${
                isActive(pathname, item.href, item.exact) ? " active" : ""
              }`}
            >
              <AdminIcon d={item.icon} className="sidebar-icon" />
              {item.label}
            </Link>
          )
        )}
      </nav>
      <div className="sidebar-footer">
        <Link href="/" className="sidebar-footer-link" target="_blank">
          View Site ↗
        </Link>
      </div>
    </div>
  );
}
