"use client";

import { Card } from "@/app/components/card";
import { Container } from "@/app/components/container";
import { FeatureCard } from "@/app/components/feature-card";
import { Hero } from "@/app/components/hero";
import { LeadForm } from "@/app/components/lead-form";
import { Section } from "@/app/components/section";

const features = [
  {
    icon: "⚡",
    title: "Fast Response",
    description:
      "Capture the lead instantly and keep the first interaction moving with a clean intake flow.",
  },
  {
    icon: "👥",
    title: "Professional Team",
    description:
      "Present a trustworthy, polished brand experience that feels ready for real clients.",
  },
  {
    icon: "💼",
    title: "Affordable Solutions",
    description:
      "Highlight flexible engagement levels without overwhelming prospects with noise.",
  },
] as const;

export default function Home() {
  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Hero onPrimaryAction={scrollToForm} />

      <Section>
        <Container>
          <div className="mb-8 max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Why choose us
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Built to feel simple for visitors and useful for your team.
            </h2>
            <p className="text-base leading-7 text-slate-600">
              The experience stays focused on the submission flow, while the
              backend quietly handles persistence and validation.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </Container>
      </Section>

      <div id="lead-form">
        <LeadForm />
      </div>

      <Section className="pb-20">
        <Container>
          <Card className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
                  Next step
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight">
                  Built for clean handoff into the backend pipeline.
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-blue-50">
                  This sprint completes the public landing page and lead form,
                  ready to capture submissions directly into the existing API.
                </p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                <p className="text-sm font-semibold text-blue-50">
                  Production-ready notes
                </p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-100">
                  <li>Responsive across desktop, tablet, and mobile</li>
                  <li>Validation mirrors backend requirements</li>
                  <li>Loading, success, validation, and server states included</li>
                </ul>
              </div>
            </div>
          </Card>
        </Container>
      </Section>
    </main>
  );
}
