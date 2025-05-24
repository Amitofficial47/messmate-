import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { SidebarLayout } from "@/components/shared/SidebarLayout";
// Removed direct icon imports
import type { ReactNode } from "react";

// navItems are now defined with iconName strings
const adminNavItems = [
  { href: "/menu", label: "Check Menu", iconName: "NotebookPen" },
  { href: "/admin/edit-menu", label: "Edit Menu", iconName: "NotebookPen" },
  { href: "/admin", label: "Dashboard", iconName: "LayoutDashboard" },
  {
    href: "/admin/upload-bill",
    label: "Upload Monthly Bill",
    iconName: "UploadCloud",
  },
  {
    href: "/admin/add-notification",
    label: "Add Notification",
    iconName: "BellPlus",
  },
  {
    href: "/admin/view-feedback",
    label: "View Feedback",
    iconName: "MessagesSquare",
  },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <SidebarLayout navItems={adminNavItems} userRole="admin">
        {children}
      </SidebarLayout>
    </ProtectedRoute>
  );
}
