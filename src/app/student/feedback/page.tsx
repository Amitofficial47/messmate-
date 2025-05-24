"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import type { FeedbackItem } from "@/lib/types";
import { MessageSquarePlus, ListChecks, CornerDownRight } from "lucide-react";
import { format } from "date-fns";

const LOCAL_STORAGE_KEY_FEEDBACK = "messmate-feedback";

export default function StudentFeedbackPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState<FeedbackItem[]>(
    []
  );

  useEffect(() => {
    if (user) {
      const allFeedbackString = localStorage.getItem(
        LOCAL_STORAGE_KEY_FEEDBACK
      );
      if (allFeedbackString) {
        try {
          const allFeedbackItems: FeedbackItem[] =
            JSON.parse(allFeedbackString);
          const userFeedback = allFeedbackItems
            .filter((item) => item.studentId === user.id)
            .sort(
              (a, b) =>
                new Date(b.submittedAt).getTime() -
                new Date(a.submittedAt).getTime()
            );
          setSubmittedFeedback(userFeedback);
        } catch (e) {
          console.error("Failed to parse feedback from localStorage", e);
        }
      }
    }
  }, [user]);

  const handleSubmitFeedback = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please log in to submit feedback.",
        variant: "destructive",
      });
      return;
    }
    if (!feedbackText.trim()) {
      toast({
        title: "Empty Feedback",
        description: "Please write your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const newFeedbackItem: FeedbackItem = {
      id: crypto.randomUUID(),
      studentId: user.id,
      studentName: user.name,
      feedbackText: feedbackText.trim(),
      submittedAt: new Date().toISOString(),
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 700));

    try {
      const existingFeedbackString = localStorage.getItem(
        LOCAL_STORAGE_KEY_FEEDBACK
      );
      const existingFeedback: FeedbackItem[] = existingFeedbackString
        ? JSON.parse(existingFeedbackString)
        : [];
      const updatedFeedback = [newFeedbackItem, ...existingFeedback];

      localStorage.setItem(
        LOCAL_STORAGE_KEY_FEEDBACK,
        JSON.stringify(updatedFeedback)
      );

      // Update local state for submitted feedback list
      setSubmittedFeedback((prev) =>
        [newFeedbackItem, ...prev].sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() -
            new Date(a.submittedAt).getTime()
        )
      );

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      setFeedbackText("");
    } catch (error) {
      console.error("Failed to save feedback to localStorage", error);
      toast({
        title: "Submission Failed",
        description: "Could not save your feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquarePlus className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">
              Submit Food Feedback
            </CardTitle>
          </div>
          <CardDescription>
            Share your thoughts about the food quality, menu, or any other
            related suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitFeedback} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="feedback-text" className="text-base">
                Your Feedback
              </Label>
              <Textarea
                id="feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us what you think about the mess food..."
                required
                minRows={4}
                disabled={isSubmitting || !user}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !user || !feedbackText.trim()}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
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
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
            {!user && (
              <p className="text-sm text-destructive text-center">
                Please log in to submit feedback.
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {user && submittedFeedback.length > 0 && (
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <ListChecks className="h-7 w-7 text-primary" />
              <CardTitle className="text-xl font-bold">
                Your Submitted Feedback
              </CardTitle>
            </div>
            <CardDescription>
              A list of feedback you've previously sent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {submittedFeedback.map((item) => (
              <div key={item.id} className="p-3 border rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">
                  {format(
                    new Date(item.submittedAt),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </p>
                <div className="flex items-start">
                  <CornerDownRight className="h-4 w-4 mr-2 mt-1 shrink-0 text-primary" />
                  <p className="text-sm text-foreground whitespace-pre-line">
                    {item.feedbackText}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {user && submittedFeedback.length === 0 && (
        <Card className="max-w-2xl mx-auto shadow-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-6">
              You haven't submitted any feedback yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
