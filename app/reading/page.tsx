import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import SectionHd from "@/components/SectionHd";
import { getConfig, getReading } from "@/lib/api";
import type { ReadingItem } from "@/lib/types";
import { readingMetaParts, zeroPad } from "@/lib/utils";

export const revalidate = 60;

function ReadingSection({
  label,
  items,
  isBounced = false,
}: {
  label: string;
  items: ReadingItem[];
  isBounced?: boolean;
}) {
  if (items.length === 0) return null;

  return (
    <div className="mb-48">
      <SectionHd label={label} />
      {items.map((item, i) =>
        isBounced ? (
          <div key={item.id} className="bounced-row">
            <span className="reading-num">{zeroPad(i + 1)}</span>
            <div>
              <div className="bounced-title">{item.title}</div>
              <div className="bounced-meta">{readingMetaParts(item)}</div>
              <div className="bounced-reason">{item.reason}</div>
            </div>
            <div className="bounced-reason-col">{item.reason}</div>
          </div>
        ) : (
          <div key={item.id} className="reading-row">
            <span className="reading-num">{zeroPad(i + 1)}</span>
            <div>
              <div className="reading-title">{item.title}</div>
              <div className="reading-meta">{readingMetaParts(item)}</div>
              {item.note && (
                <div className="reading-note-inline">{item.note}</div>
              )}
            </div>
            <div className="reading-note-col">{item.note || ""}</div>
          </div>
        )
      )}
    </div>
  );
}

export default async function ReadingPage() {
  const [reading, config] = await Promise.all([getReading(), getConfig()]);

  const metaStatus = config.reading_now
    ? `NOW · READING ${config.reading_now.toUpperCase()}`
    : "";

  return (
    <>
      <Nav page="reading" metaStatus={metaStatus} />
      <div className="page-wrap">
        <div className="outer">
          <div style={{ marginBottom: 48 }}>
            <h1 className="h1 mb-8">READING</h1>
            <span className="mono-sm text-muted">
              03 / WHAT&apos;S IN THE STACK
            </span>
          </div>
          <ReadingSection
            label="01 / CURRENTLY READING"
            items={reading.currently_reading}
          />
          <ReadingSection
            label="02 / FINISHED RECENTLY"
            items={reading.recent}
          />
          <ReadingSection
            label="03 / PAPERS WORTH YOUR TIME"
            items={reading.papers}
          />
          {reading.bounced.length > 0 && (
            <ReadingSection
              label="04 / BOUNCED OFF"
              items={reading.bounced}
              isBounced
            />
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}
