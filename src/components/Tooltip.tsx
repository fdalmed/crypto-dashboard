import type { ReactNode } from "react";

export default function Tooltip({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="relative group inline-block">
      {children}

      <div className="
        absolute left-1/2 -translate-x-1/2 -top-8 
        px-2 py-1 text-xs rounded bg-black text-white opacity-0
        group-hover:opacity-100 transition pointer-events-none
        whitespace-nowrap shadow-lg z-50
      ">
        {text}
      </div>
    </div>
  );
}
