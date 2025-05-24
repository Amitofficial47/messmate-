"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, AlertTriangle } from "lucide-react";

export default function PayBillPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-primary">Pay Your Bill</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Settle your outstanding hostel mess bills here.
        </p>
      </header>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />{" "}
            {/* Using Tailwind color for yellow */}
            <CardTitle>Payment Gateway Not Implemented</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-base">
            This is a placeholder page for bill payment. In a real application,
            this section would integrate with a payment gateway to allow
            students to pay their mess bills online.
          </CardDescription>
          <div className="mt-6 flex justify-center">
            <Button disabled size="lg">
              <CreditCard className="mr-2 h-5 w-5" />
              Proceed to Payment (Disabled)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
