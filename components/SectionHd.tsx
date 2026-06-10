interface SectionHdProps {
  label: string;
}

export default function SectionHd({ label }: SectionHdProps) {
  return (
    <div className="section-hd">
      <span className="section-hd-label">{label}</span>
      <div className="section-hd-rule"></div>
    </div>
  );
}
