import React, { Suspense, type ReactNode } from "react";
import Footer from "./Footer";
import { cn } from "~/lib/utils";
import { Toaster } from "./ui/sonner";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  props?: object;
  hasGradient?: boolean;
  isPusherActive?: boolean;
}

export default function PageLayout({
  children,
  className,
  props,
  hasGradient = false,
  isPusherActive = false,
}: PageLayoutProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col",
        hasGradient
          ? "bg-gradient-to-b from-[#191733] to-[#03020D]"
          : "bg-[#191733]",
      )}
    >
      <div
        className={cn(
          "container prose m-auto my-4 flex max-w-[80vw] flex-grow flex-col items-center text-primary-content xl:max-w-screen-xl",
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
