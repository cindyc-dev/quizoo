import * as React from "react";

import { cn } from "~/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "light:border-slate-200 light:bg-white light:ring-offset-white light:placeholder:text-slate-500 light:focus-visible:ring-slate-950 flex min-h-[80px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm ring-offset-slate-950 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
