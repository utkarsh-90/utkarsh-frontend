import Link from "next/link";
import MetaRow from "./MetaRow";

interface NavProps {
  page: string;
  metaStatus: string;
}

function isActive(page: string, section: string): boolean {
  if (section === "home") return page === "home";
  return page === section || page.startsWith(`${section}/`);
}

export default function Nav({ page, metaStatus }: NavProps) {
  return (
    <div className="nav-wrap">
      <div className="nav-bar">
        <div className="outer nav-inner">
          <Link href="/" className="nav-logo">
            UTKARSH PANCHAL
          </Link>
          <div className="nav-right">
            <Link
              href="/writing"
              className={`nav-link${isActive(page, "writing") ? " active" : ""}`}
            >
              WRITING
            </Link>
            <span className="nav-sep">/</span>
            <Link
              href="/projects"
              className={`nav-link${isActive(page, "projects") ? " active" : ""}`}
            >
              PROJECTS
            </Link>
            <span className="nav-sep">/</span>
            <Link
              href="/reading"
              className={`nav-link${page === "reading" ? " active" : ""}`}
            >
              READING
            </Link>
            <span className="nav-sep">/</span>
            <Link
              href="/about"
              className={`nav-link${page === "about" ? " active" : ""}`}
            >
              ABOUT
            </Link>
          </div>
        </div>
      </div>
      <MetaRow status={metaStatus} />
    </div>
  );
}
