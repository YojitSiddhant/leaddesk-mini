import type { ReactNode } from "react";

import { Card } from "@/app/components/card";
import { Container } from "@/app/components/container";

type AdminDashboardStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export const AdminDashboardState = ({
  title,
  description,
  action,
}: AdminDashboardStateProps) => {
  return (
    <Container className="py-16 sm:py-20">
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          LeadDesk Mini
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </Card>
    </Container>
  );
};
