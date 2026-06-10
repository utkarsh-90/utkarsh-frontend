import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { getAbout, getConfig } from "@/lib/api";
import type { AboutSectionKey } from "@/lib/types";

export const revalidate = 60;

const SECTION_ORDER: AboutSectionKey[] = ["who", "what", "why"];

function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default async function AboutPage() {
  const [about, config] = await Promise.all([getAbout(), getConfig()]);

  const sections = SECTION_ORDER.map((key) =>
    about.sections.find((s) => s.section_key === key)
  ).filter(Boolean);

  const metaStatus = config.location
    ? `${config.location.toUpperCase()} · CS @ ASU · OPEN TO 2026 ROLES`
    : "";

  return (
    <>
      <Nav page="about" metaStatus={metaStatus} />
      <div className="page-wrap">
        <div className="outer-narrow">
          <div style={{ marginBottom: 48 }}>
            <h1 className="h1 mb-8">ABOUT</h1>
            <span className="mono-sm text-muted">04 / WHO, WHAT, WHY</span>
          </div>

          {sections.map(
            (section) =>
              section && (
                <div key={section.section_key} className="about-section">
                  <span className="about-overline">
                    {section.section_key.toUpperCase()}
                  </span>
                  {section.body.split(/\n\n+/).map((paragraph, i) => (
                    <p key={i}>{paragraph.trim()}</p>
                  ))}
                </div>
              )
          )}

          {about.contact_links.length > 0 && (
            <div className="about-section mt-48">
              <span className="about-overline">CONTACT</span>
              {about.contact_links.map((link) => (
                <div key={link.id} className="contact-row">
                  <span className="contact-label">{link.label}</span>
                  <a
                    href={link.url}
                    className="contact-val"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {displayUrl(link.url)}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
