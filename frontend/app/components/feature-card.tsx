import { Card } from "@/app/components/card";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: string;
};

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <Card className="p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl text-blue-600">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </Card>
  );
};
