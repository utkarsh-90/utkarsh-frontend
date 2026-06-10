import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin — Utkarsh Panchal",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminShell>{children}</AdminShell>;
}
