"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BellPlus, MessageSquareText, ListChecks, Trash2 } from "lucide-react";
import React, { useState, useEffect, FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export type NotificationType = "info" | "alert" | "event";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  sentAt: string;
}

const LOCAL_STORAGE_KEY = "messmate-notifications";

export default function AddNotificationPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");
  const [isSending, setIsSending] = useState(false);
  const [sentNotifications, setSentNotifications] = useState<
    NotificationItem[]
  >([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedNotificationsString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedNotificationsString) {
      try {
        const parsedNotifications: NotificationItem[] = JSON.parse(
          storedNotificationsString
        );
        // Sort by most recent first
        parsedNotifications.sort(
          (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        );
        setSentNotifications(parsedNotifications);
      } catch (e) {
        console.error("Failed to parse stored notifications", e);
      }
    }
  }, []);

  const handleSendNotification = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !message) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and message for the notification.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    const newNotification: NotificationItem = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      sentAt: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const existingNotificationsString =
        localStorage.getItem(LOCAL_STORAGE_KEY);
      const existingNotifications: NotificationItem[] =
        existingNotificationsString
          ? JSON.parse(existingNotificationsString)
          : [];
      const updatedNotifications = [newNotification, ...existingNotifications];
      updatedNotifications.sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      );

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedNotifications)
      );
      setSentNotifications(updatedNotifications);

      toast({
        title: "Notification Sent",
        description: `"${title}" has been sent to students.`,
      });
      setTitle("");
      setMessage("");
      setType("info");
    } catch (error) {
      console.error("Failed to save notification to localStorage", error);
      toast({
        title: "Sending Failed",
        description: "Could not save the notification.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    try {
      const updatedNotifications = sentNotifications.filter(
        (notif) => notif.id !== notificationId
      );
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(updatedNotifications)
      );
      setSentNotifications(updatedNotifications);
      toast({
        title: "Notification Deleted",
        description: "The notification has been successfully removed.",
      });
    } catch (error) {
      console.error("Failed to delete notification from localStorage", error);
      toast({
        title: "Deletion Failed",
        description: "Could not remove the notification.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <BellPlus className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">
              Create New Notification
            </CardTitle>
          </div>
          <CardDescription>
            Compose and send a new notification to all students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendNotification} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notif-title" className="text-base">
                Title
              </Label>
              <Input
                id="notif-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Mess Closure Alert"
                required
                disabled={isSending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notif-message" className="text-base">
                Message
              </Label>
              <Textarea
                id="notif-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter the full notification message here..."
                required
                minRows={3}
                disabled={isSending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notif-type" className="text-base">
                Type
              </Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as NotificationType)}
                disabled={isSending}
              >
                <SelectTrigger id="notif-type">
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={isSending || !title || !message}
              className="w-full"
              size="lg"
            >
              {isSending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquareText className="mr-2 h-5 w-5" />
                  Send Notification
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <ListChecks className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl font-bold">
              Sent Notifications
            </CardTitle>
          </div>
          <CardDescription>
            A list of notifications you've recently sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sentNotifications.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Message Snippet</TableHead>
                    <TableHead>Sent At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentNotifications.map((notif) => (
                    <TableRow key={notif.id}>
                      <TableCell className="font-medium">
                        {notif.title}
                      </TableCell>
                      <TableCell className="capitalize">{notif.type}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {notif.message}
                      </TableCell>
                      <TableCell>
                        {format(new Date(notif.sentAt), "PPp")}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">
                                Delete Notification
                              </span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the notification: "
                                {notif.title}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteNotification(notif.id)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No notifications sent yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
