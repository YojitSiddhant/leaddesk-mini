import type { ReactNode } from "react";

import { cn } from "@/app/utils/cn";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export const Section = ({ children, className, id }: SectionProps) => {
  return (
    <section id={id} className={cn("py-16 sm:py-20", className)}>
      {children}
    </section>
  );
};
