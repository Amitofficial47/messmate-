"use client";
import { useAuth } from "@/hooks/useAuth";
import type { UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { useEffect, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/"); // Redirect to login if not authenticated
      } else if (user && !allowedRoles.includes(user.role)) {
        // If authenticated but wrong role, redirect based on actual role or to a generic page
        if (user.role === "admin") router.push("/admin");
        else if (user.role === "student") router.push("/student");
        else router.push("/"); // Fallback to login
      }
    }
  }, [user, loading, isAuthenticated, allowedRoles, router]);

  if (
    loading ||
    !isAuthenticated ||
    (user && !allowedRoles.includes(user.role))
  ) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
