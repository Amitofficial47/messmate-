"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="bg-card p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        <h2 className="text-2xl font-bold text-destructive mb-4">
          Oops! Something went wrong.
        </h2>
        <p className="text-card-foreground mb-6">
          We encountered an error in the student section. Please try again.
        </p>
        <Button onClick={() => reset()} variant="destructive">
          Try again
        </Button>
      </div>
    </div>
  );
}
