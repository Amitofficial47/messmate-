"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FeedbackItem } from "@/lib/types";
import {
  MessagesSquare,
  UserCircle,
  CalendarDays,
  MessageCircle,
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const LOCAL_STORAGE_KEY_FEEDBACK = "messmate-feedback";

export default function AdminViewFeedbackPage() {
  const [allFeedback, setAllFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const feedbackString = localStorage.getItem(LOCAL_STORAGE_KEY_FEEDBACK);
    if (feedbackString) {
      try {
        const parsedFeedback: FeedbackItem[] = JSON.parse(feedbackString);
        parsedFeedback.sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
        );
        setAllFeedback(parsedFeedback);
      } catch (e) {
        console.error("Failed to parse feedback from localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <MessagesSquare className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-bold">
                Student Feedback
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <MessagesSquare className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">
              Student Feedback
            </CardTitle>
          </div>
          <CardDescription>
            Review feedback submitted by students regarding mess food and
            services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {allFeedback.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <div className="flex items-center gap-1">
                        <UserCircle size={16} /> Student Name
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={16} /> Feedback
                      </div>
                    </TableHead>
                    <TableHead className="w-[200px] text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <CalendarDays size={16} /> Submitted At
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allFeedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.studentName}
                      </TableCell>
                      <TableCell className="whitespace-pre-line max-w-2xl">
                        {item.feedbackText}
                      </TableCell>
                      <TableCell className="text-right">
                        {format(new Date(item.submittedAt), "PPp")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-10">
              No feedback submitted by students yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
