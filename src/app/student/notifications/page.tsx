"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Info, AlertTriangle, CalendarDays } from "lucide-react";
import type {
  NotificationItem,
  NotificationType,
} from "@/app/admin/add-notification/page";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const LOCAL_STORAGE_KEY = "messmate-notifications";

const iconMap: Record<NotificationType, React.ElementType> = {
  info: Info,
  alert: AlertTriangle,
  event: CalendarDays,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedNotificationsString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedNotificationsString) {
      try {
        const parsedNotifications: NotificationItem[] = JSON.parse(
          storedNotificationsString
        );
        // Already sorted by admin, but good to ensure if logic changes
        parsedNotifications.sort(
          (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        );
        setNotifications(parsedNotifications);
      } catch (e) {
        console.error("Failed to parse stored notifications", e);
        toast({
          title: "Error loading notifications",
          description: "Could not retrieve notification information.",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  }, [toast]);

  const getIconColor = (type: NotificationType) => {
    switch (type) {
      case "alert":
        return "text-destructive"; // Red for alerts
      case "event":
        return "text-blue-500"; // Blue for events
      case "info":
      default:
        return "text-primary"; // Primary color for info
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-primary">
              Your Notifications
            </h1>
          </div>
        </header>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-md">
              <CardHeader>
                <Skeleton className="h-5 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-primary">
            Your Notifications
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Stay updated with important announcements and alerts from the mess
          administration.
        </p>
      </header>

      {notifications.length > 0 ? (
        <div className="space-y-6">
          {notifications.map((notification) => {
            const IconComponent = iconMap[notification.type] || Info;
            return (
              <Card
                key={notification.id}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent
                        className={`h-6 w-6 ${getIconColor(notification.type)}`}
                      />
                      <CardTitle className="text-xl">
                        {notification.title}
                      </CardTitle>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(notification.sentAt),
                        "MMM d, yyyy, h:mm a"
                      )}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-card-foreground whitespace-pre-line">
                    {notification.message}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-10 text-lg">
              You have no new notifications at this time.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
