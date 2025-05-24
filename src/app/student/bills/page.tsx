"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Receipt } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface UploadedBill {
  id: string;
  name: string;
  type: string; // Keep in interface for data integrity, just don't display
  size: number;
  uploadedAt: string;
}

const LOCAL_STORAGE_KEY = "messmate-uploaded-bills";

export default function StudentBillsPage() {
  const [bills, setBills] = useState<UploadedBill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedBillsString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedBillsString) {
      try {
        const parsedBills: UploadedBill[] = JSON.parse(storedBillsString);
        parsedBills.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        setBills(parsedBills);
      } catch (e) {
        console.error("Failed to parse stored bills", e);
        toast({
          title: "Error loading bills",
          description:
            "Could not retrieve bill information. It might be corrupted.",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  }, [toast]);

  const handleDownload = (billName: string) => {
    toast({
      title: "Download Simulated",
      description: `Download for "${billName}" would start now if files were actually stored.`,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <Receipt className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Hostel Bills</h1>
          </div>
        </header>
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-lg">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-1" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-2 w-full">
          <Receipt className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-primary">Hostel Bills</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          View monthly bills uploaded by the hostel administration.
        </p>
      </header>

      {bills.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bills.map((bill) => (
            <Card
              key={bill.id}
              className="shadow-md hover:shadow-lg transition-shadow flex flex-col"
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <FileText className="h-8 w-8 text-primary mt-1 shrink-0" />
                  <div>
                    <CardTitle className="text-xl leading-tight">
                      {bill.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-1 text-sm">
                {/* Type removed from display */}
                <p>
                  <span className="font-semibold">Size:</span>{" "}
                  {(bill.size / 1024).toFixed(2)} KB
                </p>
                <p>
                  <span className="font-semibold">Uploaded:</span>{" "}
                  {format(new Date(bill.uploadedAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </CardContent>
              <div className="p-4 border-t mt-auto">
                <Button
                  onClick={() => handleDownload(bill.name)}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download (Simulated)
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-10 text-lg">
              No bills have been uploaded yet. Please check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
