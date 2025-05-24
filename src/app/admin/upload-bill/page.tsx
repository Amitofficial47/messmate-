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
import { UploadCloud, ListChecks, FileText, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
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

interface UploadedBill {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export default function UploadBillPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedBills, setUploadedBills] = useState<UploadedBill[]>([]);
  const { toast } = useToast();

  const LOCAL_STORAGE_KEY = "messmate-uploaded-bills";

  useEffect(() => {
    const storedBillsString = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedBillsString) {
      try {
        const parsedBills: UploadedBill[] = JSON.parse(storedBillsString);
        parsedBills.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
        setUploadedBills(parsedBills);
      } catch (e) {
        console.error("Failed to parse stored bills", e);
      }
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    const newBill: UploadedBill = {
      id: crypto.randomUUID(),
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size,
      uploadedAt: new Date().toISOString(),
    };

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const existingBillsString = localStorage.getItem(LOCAL_STORAGE_KEY);
      const existingBills: UploadedBill[] = existingBillsString
        ? JSON.parse(existingBillsString)
        : [];
      const updatedBills = [newBill, ...existingBills];
      updatedBills.sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedBills));
      setUploadedBills(updatedBills);

      toast({
        title: "Upload Successful",
        description: `File "${selectedFile.name}" has been 'uploaded' and saved.`,
      });
      setSelectedFile(null);
      const fileInput = document.getElementById(
        "bill-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Failed to save bill to localStorage", error);
      toast({
        title: "Upload Failed",
        description: "Could not save the bill information.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBill = (billId: string) => {
    try {
      const updatedBills = uploadedBills.filter((bill) => bill.id !== billId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedBills));
      setUploadedBills(updatedBills);
      toast({
        title: "Bill Deleted",
        description: "The bill has been successfully removed.",
      });
    } catch (error) {
      console.error("Failed to delete bill from localStorage", error);
      toast({
        title: "Deletion Failed",
        description: "Could not remove the bill information.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <UploadCloud className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl font-bold">
              Upload Monthly Bill
            </CardTitle>
          </div>
          <CardDescription>
            Upload the consolidated monthly bill (e.g., PDF, Excel, CSV). This
            will be visible to students.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bill-upload" className="text-base">
              Select Bill File
            </Label>
            <Input
              id="bill-upload"
              type="file"
              accept=".pdf,.xls,.xlsx,.csv"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              disabled={isUploading}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected file: {selectedFile.name} (
                {(selectedFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          <Button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
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
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-5 w-5" />
                Upload & Save Bill
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <ListChecks className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl font-bold">
              Recently Uploaded Bills
            </CardTitle>
          </div>
          <CardDescription>
            A list of bills you've recently "uploaded". Students will see these.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {uploadedBills.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uploadedBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText size={16} className="text-muted-foreground" />{" "}
                        {bill.name}
                      </TableCell>
                      <TableCell>{bill.type}</TableCell>
                      <TableCell>{(bill.size / 1024).toFixed(2)} KB</TableCell>
                      <TableCell>
                        {format(new Date(bill.uploadedAt), "PPp")}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete Bill</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the bill record for "
                                {bill.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBill(bill.id)}
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
              No bills uploaded yet.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
