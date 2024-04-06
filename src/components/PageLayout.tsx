import React, { type ReactNode } from "react";
import Footer from "./Footer";
import { cn } from "~/lib/utils";
import { Toaster } from "./ui/sonner";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  props?: object;
  isPusherActive?: boolean;
}

export default function PageLayout({
  children,
  className,
  props,
  isPusherActive=false,
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#191733] to-[#03020D]">
      <div
        className={cn(
          "text-primary-content container prose m-auto my-4 flex max-w-[80vw] flex-grow flex-col items-center xl:max-w-screen-xl",
          className,
        )}
        {...props}
      >
        {children}
      </div>
      <Toaster />
      <Footer isPusherActive={isPusherActive} />
    </div>
  );
}
