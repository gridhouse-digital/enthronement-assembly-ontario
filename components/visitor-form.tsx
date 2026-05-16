"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  hearOptions,
  serviceLikes,
  visitorDefaultValues,
  visitorSchema,
  type VisitorFormValues,
} from "@/lib/visitor-schema";
import { cn } from "@/lib/utils";

export function VisitorForm() {
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    setValue,
    watch,
  } = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorSchema),
    defaultValues: visitorDefaultValues,
    mode: "onBlur",
  });

  const heardAboutUs = watch("heardAboutUs");
  const likedAboutService = watch("likedAboutService");
  const showInviterName = heardAboutUs === "Someone invited me";
  const showHeardOther = heardAboutUs === "Others";
  const showLikedOther = likedAboutService.includes("Others");

  useEffect(() => {
    if (!showInviterName) {
      setValue("inviterName", "", { shouldDirty: false, shouldValidate: false });
    }
  }, [setValue, showInviterName]);

  useEffect(() => {
    if (!showHeardOther) {
      setValue("heardOther", "", { shouldDirty: false, shouldValidate: false });
    }
  }, [setValue, showHeardOther]);

  useEffect(() => {
    if (!showLikedOther) {
      setValue("likedOther", "", { shouldDirty: false, shouldValidate: false });
    }
  }, [setValue, showLikedOther]);

  async function onSubmit(values: VisitorFormValues) {
    const payload = visitorSchema.parse(values);
    console.log("First-time visitor payload", payload);
    const response = await fetch("/api/visitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setError("root", {
        message: "We could not submit the form right now. Please try again.",
      });
      return;
    }

    reset(visitorDefaultValues);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[760px]">
        {/* Hero */}
        <header className="ea-reveal mb-9 text-center">
          <div className="mx-auto mb-5 flex h-24 w-32 items-center justify-center overflow-hidden rounded-2xl bg-white p-2.5 shadow-[var(--shadow-md)]">
            <Image
              src="/logo.jpeg"
              alt="Enthronement Assembly logo"
              width={224}
              height={160}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-deep)]">
            First Timers Welcome
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[var(--color-secondary)] sm:text-4xl">
            You are <span className="text-[var(--color-primary)]">Royalty.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-body)] sm:text-base">
            Activating and actualizing God&apos;s royalty in you.
          </p>
        </header>

        {/* Form card */}
        <div
          className="ea-reveal overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-lg)]"
          style={{ animationDelay: "0.12s" }}
        >
          {/* Card header */}
          <div className="relative overflow-hidden bg-[linear-gradient(150deg,var(--color-royal-deep),var(--color-secondary))] px-6 py-8 sm:px-10 sm:py-10">
            <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(203,151,39,0.4),transparent_70%)]" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(155,81,224,0.32),transparent_70%)]" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-gold-bright)]">
                Enthronement Assembly Ontario
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-[1.75rem]">
                Welcome, First-Time Guest
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
                We&apos;re honoured you joined us today. Share a few details so our team
                can thank you, pray with you, and walk your next step together.
              </p>
            </div>
          </div>

          {/* Card body */}
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 sm:px-10 sm:py-10">
            {errors.root ? (
              <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errors.root.message}
              </div>
            ) : null}
            {submitted ? <SuccessMessage /> : null}

            <SectionHeading>Your Details</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="First Name" required error={errors.firstName?.message}>
                <Input autoComplete="given-name" placeholder="First name" {...register("firstName")} />
              </Field>
              <Field label="Last Name" required error={errors.lastName?.message}>
                <Input autoComplete="family-name" placeholder="Last name" {...register("lastName")} />
              </Field>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Phone Number" required error={errors.phoneNumber?.message}>
                <Input
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="e.g. 0803 000 0000"
                  {...register("phoneNumber")}
                />
              </Field>
              <Field label="Email" required error={errors.email?.message}>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
              </Field>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <ChipRadioField
                label="Gender"
                name="gender"
                options={["Male", "Female"]}
                control={control}
                error={errors.gender?.message}
              />
              <ChipRadioField
                label="Profession"
                name="profession"
                options={["Student", "Professional"]}
                control={control}
                error={errors.profession?.message}
              />
            </div>

            <div className="mt-5">
              <Field label="Home Address" hint="Optional" error={errors.homeAddress?.message}>
                <Textarea
                  autoComplete="street-address"
                  className="min-h-24"
                  placeholder="Street, area, city"
                  {...register("homeAddress")}
                />
              </Field>
            </div>

            <SectionHeading>How You Found Us</SectionHeading>
            <ChipRadioField
              label="How did you hear about us?"
              name="heardAboutUs"
              options={[...hearOptions]}
              control={control}
              error={errors.heardAboutUs?.message}
            />

            {showInviterName ? (
              <div className="mt-5">
                <Field label="Name of the person who invited you" required error={errors.inviterName?.message}>
                  <Input placeholder="Inviter's full name" {...register("inviterName")} />
                </Field>
              </div>
            ) : null}

            {showHeardOther ? (
              <div className="mt-5">
                <Field label="Please specify" required error={errors.heardOther?.message}>
                  <Input placeholder="How did you hear about us?" {...register("heardOther")} />
                </Field>
              </div>
            ) : null}

            <SectionHeading>Your Experience</SectionHeading>
            <ChipRadioField
              label="What is your next step with us?"
              name="nextStepsIntent"
              options={["Just visiting", "I want to become a member"]}
              control={control}
              error={errors.nextStepsIntent?.message}
            />

            <div className="mt-5">
              <CheckboxGroup
                label="What did you like about the service?"
                values={likedAboutService}
                onChange={(value) =>
                  setValue("likedAboutService", value, { shouldDirty: true, shouldValidate: true })
                }
                error={errors.likedAboutService?.message}
              />
            </div>

            {showLikedOther ? (
              <div className="mt-5">
                <Field label="Tell us more" required error={errors.likedOther?.message}>
                  <Input placeholder="What else stood out to you?" {...register("likedOther")} />
                </Field>
              </div>
            ) : null}

            <SectionHeading>How Can We Help?</SectionHeading>
            <ChipRadioField
              label="Can we contact you?"
              name="canContact"
              options={["Yes", "No"]}
              control={control}
              error={errors.canContact?.message}
            />

            <div className="mt-5">
              <Field label="Prayer Request" hint="Optional" error={errors.prayerRequest?.message}>
                <Textarea
                  className="min-h-36"
                  placeholder="Share anything you would like us to stand with you in prayer about."
                  {...register("prayerRequest")}
                />
              </Field>
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6 sm:flex-row">
              <p className="max-w-xs text-center text-xs leading-5 text-[var(--color-muted)] sm:text-left">
                Your information is kept private and used only for pastoral follow-up.
              </p>
              <Button
                type="submit"
                size="lg"
                variant="gold"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5" />
                )}
                {isSubmitting ? "Submitting..." : "Submit Visitor Form"}
              </Button>
            </div>
          </form>
        </div>

        <p className="mt-7 text-center text-xs text-[var(--color-muted)]">
          Enthronement Assembly Ontario &middot; You are Royalty
        </p>
      </div>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 mt-8 flex items-center gap-2.5 border-b border-[var(--color-border)] pb-2.5 text-base font-semibold text-[var(--color-secondary)] first:mt-0">
      <span className="h-2 w-2 rotate-45 rounded-[2px] bg-[var(--color-primary)]" />
      {children}
    </h3>
  );
}

function Field({
  children,
  error,
  hint,
  label,
  required,
}: {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  label: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-[var(--color-text)]">
          {label}
          {required ? <span className="ml-0.5 text-[var(--color-gold-deep)]">*</span> : null}
        </Label>
        {hint ? (
          <span className="text-xs font-medium text-[var(--color-muted)]">{hint}</span>
        ) : null}
      </div>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

const chipClass =
  "flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full border-[1.5px] border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-body)] transition-all duration-200 hover:border-[var(--color-gold-bright)]";
const chipActiveClass =
  "border-[var(--color-secondary)] bg-[var(--color-royal-tint)] font-semibold text-[var(--color-secondary)]";

function ChipRadioField<
  TName extends "gender" | "profession" | "heardAboutUs" | "nextStepsIntent" | "canContact",
>({
  control,
  error,
  label,
  name,
  options,
}: {
  control: ReturnType<typeof useForm<VisitorFormValues>>["control"];
  error?: string;
  label: string;
  name: TName;
  options: string[];
}) {
  return (
    <div className="space-y-3">
      <Label className="text-[var(--color-text)]">{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value ?? ""}
            className="flex flex-wrap gap-2.5"
          >
            {options.map((option) => (
              <Label
                key={option}
                className={cn(chipClass, field.value === option && chipActiveClass)}
              >
                <RadioGroupItem value={option} />
                <span>{option}</span>
              </Label>
            ))}
          </RadioGroup>
        )}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function CheckboxGroup({
  error,
  label,
  onChange,
  values,
}: {
  error?: string;
  label: string;
  onChange: (value: VisitorFormValues["likedAboutService"]) => void;
  values: VisitorFormValues["likedAboutService"];
}) {
  return (
    <div className="space-y-3">
      <Label className="text-[var(--color-text)]">{label}</Label>
      <div className="flex flex-wrap gap-2.5">
        {serviceLikes.map((item) => {
          const checked = values.includes(item);
          return (
            <Label key={item} className={cn(chipClass, checked && chipActiveClass)}>
              <Checkbox
                checked={checked}
                onCheckedChange={(nextChecked) => {
                  const next = nextChecked
                    ? [...values, item]
                    : values.filter((value) => value !== item);
                  onChange(next);
                }}
              />
              <span>{item}</span>
            </Label>
          );
        })}
      </div>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-red-600">{children}</p>;
}

function SuccessMessage() {
  return (
    <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-[rgba(97,206,112,0.4)] bg-[rgba(97,206,112,0.14)] px-4 py-3.5 text-sm font-medium leading-6 text-[var(--color-green-deep)]">
      <CheckCircle2 className="h-5 w-5 shrink-0" />
      Thank you for visiting Enthronement Assembly Ontario. We&apos;re grateful you joined us today
      &mdash; welcome to the family.
    </div>
  );
}
