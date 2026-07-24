"use client";

import { useId } from "react";

import { Button } from "@/app/components/button";
import { Card } from "@/app/components/card";
import { Container } from "@/app/components/container";
import { Input } from "@/app/components/input";
import { Select } from "@/app/components/select";
import { Textarea } from "@/app/components/textarea";
import { useLeadSubmission } from "@/app/hooks/use-lead-submission";
import { budgetOptions } from "@/app/types/lead";

export const LeadForm = () => {
  const nameId = useId();
  const emailId = useId();
  const budgetId = useId();
  const messageId = useId();
  const {
    values,
    errors,
    isSubmitting,
    successMessage,
    submitError,
    updateField,
    handleSubmit,
  } = useLeadSubmission();

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Contact
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Tell us about your project.
            </h2>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Share a few details and we&apos;ll capture the lead cleanly in the
              backend. The form validates inline and submits directly to the
              existing API.
            </p>
            <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                What happens next?
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>1. We validate the form before sending it.</li>
                <li>2. The lead is posted to the backend API.</li>
                <li>3. Success and error states are shown immediately.</li>
              </ul>
            </div>
          </div>
          <Card className="p-6 sm:p-8">
            <form
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit();
              }}
            >
              <Input
                id={nameId}
                label="Name"
                autoComplete="name"
                value={values.name}
                onChange={(event) => updateField("name", event.target.value)}
                error={errors.name}
                placeholder="Your full name"
                aria-invalid={Boolean(errors.name)}
              />
              <Input
                id={emailId}
                label="Email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                error={errors.email}
                placeholder="you@company.com"
                aria-invalid={Boolean(errors.email)}
              />
              <Select
                id={budgetId}
                label="Budget"
                value={values.budgetRange}
                onChange={(event) =>
                  updateField("budgetRange", event.target.value as (typeof budgetOptions)[number])
                }
                error={errors.budgetRange}
                aria-invalid={Boolean(errors.budgetRange)}
              >
                {budgetOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <Textarea
                id={messageId}
                label="Message"
                value={values.message}
                onChange={(event) => updateField("message", event.target.value)}
                error={errors.message}
                placeholder="Tell us what you're looking for..."
                aria-invalid={Boolean(errors.message)}
              />

              {submitError ? (
                <div
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  role="alert"
                >
                  {submitError}
                </div>
              ) : null}

              {successMessage ? (
                <div
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
                  role="status"
                  aria-live="polite"
                >
                  {successMessage}
                </div>
              ) : null}

              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="w-full"
              >
                Submit Lead
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </section>
  );
};
