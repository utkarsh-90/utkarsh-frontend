import ReadingSection from "@/components/admin/ReadingSection";
import { adminGetReading } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

export default async function AdminReadingPage() {
  const items = await adminGetReading();

  return <ReadingSection items={items} />;
}
