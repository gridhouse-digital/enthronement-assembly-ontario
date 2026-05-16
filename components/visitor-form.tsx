"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Sparkles } from "lucide-react";
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
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <section className="grid gap-6 lg:grid-cols-[0.78fr_1fr] lg:items-start">
          <aside className="lg:sticky lg:top-8">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-7">
              <div className="mx-auto mb-5 flex h-28 w-40 items-center justify-center overflow-hidden rounded-xl bg-white sm:h-32 sm:w-48">
                <Image
                  src="/logo.jpeg"
                  alt="Enthronement Assembly logo"
                  width={240}
                  height={162}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
              <h1 className="text-center text-2xl font-bold leading-tight text-[var(--color-secondary)] sm:text-3xl">
                Enthronement Assembly Ontario
              </h1>
              <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-[var(--color-muted)] sm:text-base">
                Activating and actualizing God&apos;s royalty in you
              </p>
              <div className="mt-6 rounded-xl bg-[var(--color-surface)] p-4 text-sm leading-6 text-[var(--color-muted)]">
                Welcome. Share a few details so our team can thank you for visiting, pray with you,
                and help with your next step.
              </div>
            </div>
          </aside>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.root ? <ErrorText>{errors.root.message}</ErrorText> : null}
            {submitted ? <SuccessMessage /> : null}

            <FormSection title="About You" description="Your basic contact details help us follow up with care.">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First Name" error={errors.firstName?.message}>
                  <Input autoComplete="given-name" {...register("firstName")} />
                </Field>
                <Field label="Last Name" error={errors.lastName?.message}>
                  <Input autoComplete="family-name" {...register("lastName")} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Phone Number" error={errors.phoneNumber?.message}>
                  <Input type="tel" autoComplete="tel" inputMode="tel" {...register("phoneNumber")} />
                </Field>
                <Field label="Email" error={errors.email?.message}>
                  <Input type="email" autoComplete="email" {...register("email")} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <RadioField
                  label="Gender"
                  name="gender"
                  options={["Male", "Female"]}
                  control={control}
                  error={errors.gender?.message}
                />
                <RadioField
                  label="Profession"
                  name="profession"
                  options={["Student", "Professional"]}
                  control={control}
                  error={errors.profession?.message}
                  layout="stacked"
                />
              </div>

              <Field label="Home Address" error={errors.homeAddress?.message}>
                <Textarea autoComplete="street-address" className="min-h-24" {...register("homeAddress")} />
              </Field>
            </FormSection>

            <FormSection title="Your Experience" description="Tell us how today connected with you.">
              <RadioField
                label="How did you hear about us?"
                name="heardAboutUs"
                options={[...hearOptions]}
                control={control}
                error={errors.heardAboutUs?.message}
              />

              {showInviterName ? (
                <Field label="Name of Inviter" error={errors.inviterName?.message}>
                  <Input {...register("inviterName")} />
                </Field>
              ) : null}

              {showHeardOther ? (
                <Field label="Please specify" error={errors.heardOther?.message}>
                  <Input {...register("heardOther")} />
                </Field>
              ) : null}

              <RadioField
                label="Next Steps Intent"
                name="nextStepsIntent"
                options={["Just visiting", "I want to become a member"]}
                control={control}
                error={errors.nextStepsIntent?.message}
              />

              <CheckboxGroup
                label="What did you like about the service?"
                values={likedAboutService}
                onChange={(value) => setValue("likedAboutService", value, { shouldDirty: true, shouldValidate: true })}
                error={errors.likedAboutService?.message}
              />

              {showLikedOther ? (
                <Field label="Please specify" error={errors.likedOther?.message}>
                  <Input {...register("likedOther")} />
                </Field>
              ) : null}
            </FormSection>

            <FormSection title="How Can We Help?" description="Let us know how our team can serve you after today.">
              <RadioField
                label="Can we contact you?"
                name="canContact"
                options={["Yes", "No"]}
                control={control}
                error={errors.canContact?.message}
              />

              <Field label="Prayer Request" hint="Optional" error={errors.prayerRequest?.message}>
                <Textarea
                  className="min-h-40"
                  placeholder="Share anything you would like us to pray about."
                  {...register("prayerRequest")}
                />
              </Field>
            </FormSection>

            <Button type="submit" size="lg" variant="gold" className="w-full text-base" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {isSubmitting ? "Submitting..." : "Submit Visitor Form"}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}

function FormSection({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 border-l-4 border-[var(--color-primary)] pl-4">
        <h2 className="text-xl font-bold text-[var(--color-secondary)]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{description}</p>
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

function Field({
  children,
  error,
  hint,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        {hint ? <span className="text-xs font-medium text-[var(--color-muted)]">{hint}</span> : null}
      </div>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function RadioField<TName extends "gender" | "profession" | "heardAboutUs" | "nextStepsIntent" | "canContact">({
  control,
  error,
  label,
  layout = "responsive",
  name,
  options,
}: {
  control: ReturnType<typeof useForm<VisitorFormValues>>["control"];
  error?: string;
  label: string;
  layout?: "responsive" | "stacked";
  name: TName;
  options: string[];
}) {
  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            value={field.value ?? ""}
            className={cn("grid gap-3", layout === "responsive" && "sm:grid-cols-2")}
          >
            {options.map((option) => (
              <Label
                key={option}
                className={cn(
                  "flex min-h-13 cursor-pointer items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm font-semibold transition hover:border-[var(--color-primary)] sm:text-base",
                  field.value === option && "border-[var(--color-primary)] bg-[rgba(201,162,39,0.12)]",
                )}
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
      <Label>{label}</Label>
      <div className="grid gap-3 sm:grid-cols-2">
        {serviceLikes.map((item) => {
          const checked = values.includes(item);
          return (
            <Label
              key={item}
              className={cn(
                "flex min-h-13 cursor-pointer items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm font-semibold transition hover:border-[var(--color-primary)]",
                checked && "border-[var(--color-primary)] bg-[rgba(201,162,39,0.12)]",
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(nextChecked) => {
                  const next = nextChecked ? [...values, item] : values.filter((value) => value !== item);
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
    <div className="rounded-2xl border border-[rgba(201,162,39,0.42)] bg-[rgba(201,162,39,0.12)] p-4 text-sm leading-6 text-[var(--color-secondary)]">
      Thank you for visiting Enthronement Assembly Ontario. We are grateful you joined us today.
    </div>
  );
}
