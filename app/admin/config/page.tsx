import SiteConfigEditor from "@/components/admin/SiteConfigEditor";
import { adminGetConfig } from "@/lib/adminApi";

export const dynamic = "force-dynamic";

export default async function AdminConfigPage() {
  const config = await adminGetConfig();
  return <SiteConfigEditor initialConfig={config} />;
}
