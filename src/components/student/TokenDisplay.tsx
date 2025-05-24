"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"; // Added import
import { Ticket, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TokenDisplayProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  token: string | null;
  mealType: string | null;
}

export function TokenDisplay({
  isOpen,
  onOpenChange,
  token,
  mealType,
}: TokenDisplayProps) {
  const { toast } = useToast();

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard
        .writeText(token)
        .then(() => {
          toast({
            title: "Copied!",
            description: "Token copied to clipboard.",
          });
        })
        .catch((err) => {
          toast({
            title: "Error",
            description: "Failed to copy token.",
            variant: "destructive",
          });
          console.error("Failed to copy token: ", err);
        });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <Ticket className="h-16 w-16 text-primary" />
          </div>
          <AlertDialogTitle className="text-2xl text-center">
            Your {mealType} Token
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Show this token to the mess staff to get your{" "}
            {mealType?.toLowerCase()}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="my-6 p-4 bg-muted rounded-lg text-center">
          <p className="text-3xl font-bold tracking-wider text-primary">
            {token}
          </p>
        </div>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <Button
            variant="outline"
            onClick={handleCopyToken}
            className="w-full sm:w-auto"
          >
            <Copy className="mr-2 h-4 w-4" /> Copy Token
          </Button>
          <AlertDialogAction
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
