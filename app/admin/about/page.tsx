import AboutEditor from "@/components/admin/AboutEditor";
import {
  adminGetAboutSections,
  adminGetContactLinks,
} from "@/lib/adminApi";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const [sections, contactLinks] = await Promise.all([
    adminGetAboutSections(),
    adminGetContactLinks(),
  ]);

  return (
    <AboutEditor
      initialSections={sections}
      initialContacts={contactLinks}
    />
  );
}
