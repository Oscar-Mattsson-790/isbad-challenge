import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "bg-white text-black border-none placeholder:text-muted-foreground",
        "flex field-sizing-content min-h-16 w-full rounded-md px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none",
        "focus:outline-none focus:ring-0 focus:border-none",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
