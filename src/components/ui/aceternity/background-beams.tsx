import React from "react";
import { cn } from "../../../utils/cn";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div className="h-full w-full bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 flex gap-10 overflow-hidden">
          <div className="animate-beam flex-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          <div className="animate-beam animation-delay-500 flex-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          <div className="animate-beam animation-delay-1000 flex-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
        </div>
      </div>
    </div>
  );
};
