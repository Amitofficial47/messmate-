"use client";
import React, { ReactNode } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppLogo } from "./AppLogo";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  History,
  UploadCloud,
  FileText,
  Activity,
  Bell,
  CreditCard,
  NotebookPen,
  BellPlus,
  MessageSquarePlus,
  MessagesSquare,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const iconMap: { [key: string]: React.ElementType } = {
  LayoutDashboard,
  History,
  UploadCloud,
  FileText,
  Activity,
  Bell,
  CreditCard,
  NotebookPen,
  BellPlus,
  MessageSquarePlus,
  MessagesSquare,
};

interface NavItem {
  href: string;
  label: string;
  iconName: string;
  disabled?: boolean;
}

interface SidebarLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  userRole: string;
}

export function SidebarLayout({
  children,
  navItems,
  userRole,
}: SidebarLayoutProps) {
  const { logout, user } = useAuth();
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <AppLogo className="text-sidebar-foreground" showText={true} />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map((item) => {
              const IconComponent = iconMap[item.iconName];
              const isBaseDashboard =
                item.href === `/${userRole}` ||
                (userRole === "admin" && item.href === "/admin") ||
                (userRole === "student" && item.href === "/student");
              const isMenuPage = item.href === "/menu";

              const isActive =
                (isBaseDashboard && pathname === item.href) ||
                (isMenuPage && pathname === item.href) ||
                (!isBaseDashboard &&
                  !isMenuPage &&
                  pathname.startsWith(item.href) &&
                  item.href !== `/${userRole}` &&
                  item.href !== "/menu");

              return (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      isActive={isActive}
                      disabled={item.disabled}
                      tooltip={{
                        children: item.label,
                        side: "right",
                        align: "center",
                      }}
                    >
                      {IconComponent && <IconComponent />}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className="mb-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:mb-2">
            <ThemeToggle />
          </div>
          {user && (
            <div className="text-sm text-sidebar-foreground mb-2 text-center group-data-[collapsible=icon]:hidden">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs">{user.email}</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-0 text-black dark:text-sidebar-foreground"
          >
            <LogOut className="group-data-[collapsible=icon]:size-4" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:py-4">
          <div className="md:hidden absolute left-4 top-1/2 transform -translate-y-1/2">
            <SidebarTrigger />
          </div>
          <h1 className="flex-1 text-center text-xl font-semibold capitalize">
            {userRole} Panel
          </h1>
          {/* ThemeToggle removed from here */}
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
