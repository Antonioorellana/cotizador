import type { ReactNode } from "react";

export function PageHeading({ title, description, aside }: { title: string; description: string; aside?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[#102033] sm:text-[28px]">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#667085]">{description}</p>
      </div>
      {aside}
    </div>
  );
}
