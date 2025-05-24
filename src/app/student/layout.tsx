import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { SidebarLayout } from "@/components/shared/SidebarLayout";
// Removed direct icon imports
import type { ReactNode } from "react";

// navItems are now defined with iconName strings
const studentNavItems = [
  { href: "/menu", label: "Check Menu", iconName: "NotebookPen" },
  { href: "/student", label: "Meal Selection", iconName: "LayoutDashboard" },
  { href: "/student/history", label: "Meal History", iconName: "History" },
  { href: "/student/summary", label: "Monthly Summary", iconName: "Activity" },
  { href: "/student/notifications", label: "Notifications", iconName: "Bell" },
  { href: "/student/bills", label: "Check Bill Status", iconName: "FileText" },
  {
    href: "/student/feedback",
    label: "Submit Feedback",
    iconName: "MessageSquarePlus",
  },
  { href: "/student/pay-bill", label: "Pay Bill", iconName: "CreditCard" },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <SidebarLayout navItems={studentNavItems} userRole="student">
        {children}
      </SidebarLayout>
    </ProtectedRoute>
  );
}
