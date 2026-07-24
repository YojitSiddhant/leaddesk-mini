import { Button } from "@/app/components/button";
import { Card } from "@/app/components/card";
import { Container } from "@/app/components/container";

type HeroProps = {
  onPrimaryAction: () => void;
};

export const Hero = ({ onPrimaryAction }: HeroProps) => {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/80 to-white py-12 sm:py-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              LeadDesk Mini
            </div>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Get qualified leads without the back-and-forth.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                A lightweight, polished lead capture experience built for modern
                service businesses that want faster replies and better inbound
                conversations.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={onPrimaryAction}>Submit a Lead</Button>
              <Button variant="secondary" onClick={onPrimaryAction}>
                View the form
              </Button>
            </div>
          </div>
          <Card className="overflow-hidden p-4">
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-gradient-to-br from-white to-blue-50 p-6">
              <div className="max-w-sm text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 text-3xl text-white shadow-lg">
                  ✦
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Illustration Placeholder
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Replace this panel with a brand illustration, product mockup,
                  or customer story visual later.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
};
