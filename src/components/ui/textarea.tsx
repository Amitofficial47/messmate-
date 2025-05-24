import * as React from "react";

import { cn } from "@/lib/utils";

// Extend standard textarea attributes to include our custom `minRows` prop.
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, minRows, rows: actualRows, ...props }, ref) => {
    // Determine the value for the HTML 'rows' attribute.
    // If 'rows' is explicitly passed (as actualRows), it takes precedence.
    // Otherwise, if 'minRows' is passed, use that.
    const finalRows = actualRows !== undefined ? actualRows : minRows;

    return (
      <textarea
        rows={finalRows} // Use the determined value for rows
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props} // `minRows` and `actualRows` are handled and not in `props` anymore
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
