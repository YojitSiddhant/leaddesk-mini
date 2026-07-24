"use client";

import { useId } from "react";

import { Button } from "@/app/components/button";
import { Card } from "@/app/components/card";
import { Container } from "@/app/components/container";
import { Input } from "@/app/components/input";
import { useAdminLogin } from "@/app/hooks/use-admin-login";

export const AdminLoginForm = () => {
  const emailId = useId();
  const passwordId = useId();
  const {
    values,
    errors,
    isSubmitting,
    isCheckingSession,
    submitError,
    updateField,
    handleSubmit,
  } = useAdminLogin();

  if (isCheckingSession) {
    return (
      <section className="min-h-screen bg-white py-16 sm:py-20">
        <Container className="flex min-h-[60vh] items-center justify-center">
          <Card className="w-full max-w-md p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Admin Access
            </p>
            <p className="mt-4 text-base text-slate-600">
              Checking your session...
            </p>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-blue-50/70 to-white py-16 sm:py-20">
      <Container className="flex min-h-[80vh] items-center">
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
              Admin Access
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Secure sign in for LeadDesk Mini admins.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Session-based authentication uses HTTP-only cookies so nothing is
              stored in local storage and access stays server-controlled.
            </p>
            <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                What this page does
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <li>Validates credentials inline before submission</li>
                <li>Posts securely to the admin login endpoint</li>
                <li>Redirects authenticated users away from the form</li>
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
                id={emailId}
                label="Email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                error={errors.email}
                placeholder="admin@company.com"
                aria-invalid={Boolean(errors.email)}
              />
              <Input
                id={passwordId}
                label="Password"
                type="password"
                autoComplete="current-password"
                value={values.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                error={errors.password}
                placeholder="Enter your password"
                aria-invalid={Boolean(errors.password)}
              />

              {submitError ? (
                <div
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                  role="alert"
                >
                  {submitError}
                </div>
              ) : null}

              <Button
                type="submit"
                isLoading={isSubmitting}
                loadingLabel="Signing in..."
                disabled={isSubmitting}
                className="w-full"
              >
                Sign in
              </Button>
            </form>
          </Card>
        </div>
      </Container>
    </section>
  );
};
