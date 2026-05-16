"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, type FieldPath, type FieldPathValue, type UseFormRegisterReturn, useForm } from "react-hook-form";
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

type StepId =
  | "welcome"
  | "firstName"
  | "lastName"
  | "phoneNumber"
  | "email"
  | "gender"
  | "profession"
  | "homeAddress"
  | "heardAboutUs"
  | "inviterName"
  | "heardOther"
  | "nextStepsIntent"
  | "likedAboutService"
  | "likedOther"
  | "canContact"
  | "prayerRequest"
  | "review";

type Step = {
  description: string;
  fields: FieldPath<VisitorFormValues>[];
  id: StepId;
  optional?: boolean;
  section: string;
  title: string;
};

const baseSteps: Step[] = [
  {
    id: "welcome",
    title: "Welcome to Enthronement Assembly Ontario",
    description: "A few quick questions will help us thank you, pray with you, and follow up well.",
    fields: [],
    optional: true,
    section: "Welcome",
  },
  {
    id: "firstName",
    title: "What is your first name?",
    description: "Let us know what to call you.",
    fields: ["firstName"],
    section: "Your Details",
  },
  {
    id: "lastName",
    title: "What is your last name?",
    description: "This helps our team identify your visit correctly.",
    fields: ["lastName"],
    section: "Your Details",
  },
  {
    id: "phoneNumber",
    title: "What phone number can we reach you on?",
    description: "We will only use this for pastoral follow-up.",
    fields: ["phoneNumber"],
    section: "Your Details",
  },
  {
    id: "email",
    title: "What is your email address?",
    description: "Use the best email for follow-up or church updates.",
    fields: ["email"],
    section: "Your Details",
  },
  {
    id: "gender",
    title: "What is your gender?",
    description: "Tap one option to continue.",
    fields: ["gender"],
    section: "Your Details",
  },
  {
    id: "profession",
    title: "Are you a student or a professional?",
    description: "Tap one option to continue.",
    fields: ["profession"],
    section: "Your Details",
  },
  {
    id: "homeAddress",
    title: "Where do you live?",
    description: "This is optional. You can skip it if you prefer.",
    fields: ["homeAddress"],
    optional: true,
    section: "Your Details",
  },
  {
    id: "heardAboutUs",
    title: "How did you hear about us?",
    description: "Tap the option that fits best.",
    fields: ["heardAboutUs"],
    section: "How You Found Us",
  },
  {
    id: "nextStepsIntent",
    title: "What is your next step with us?",
    description: "Tap one option to continue.",
    fields: ["nextStepsIntent"],
    section: "Your Experience",
  },
  {
    id: "likedAboutService",
    title: "What did you like about the service?",
    description: "Select all that apply, then continue.",
    fields: ["likedAboutService"],
    section: "Your Experience",
  },
  {
    id: "canContact",
    title: "Can we contact you?",
    description: "Tap one option to continue.",
    fields: ["canContact"],
    section: "How Can We Help?",
  },
  {
    id: "prayerRequest",
    title: "How can we pray with you?",
    description: "This is optional. Share anything you would like us to stand with you about.",
    fields: ["prayerRequest"],
    optional: true,
    section: "How Can We Help?",
  },
  {
    id: "review",
    title: "Review your visit card",
    description: "Check your answers, then submit your visitor form.",
    fields: [],
    optional: true,
    section: "Review",
  },
];

const focusFieldByStep: Partial<Record<StepId, FieldPath<VisitorFormValues>>> = {
  email: "email",
  firstName: "firstName",
  heardOther: "heardOther",
  homeAddress: "homeAddress",
  inviterName: "inviterName",
  lastName: "lastName",
  likedOther: "likedOther",
  phoneNumber: "phoneNumber",
  prayerRequest: "prayerRequest",
};

const chipClass =
  "flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] border-[var(--color-border)] bg-white px-4 py-3 text-left text-base font-medium text-[var(--color-body)] transition-all duration-200 hover:border-[var(--color-gold-bright)] sm:w-auto sm:min-w-44";
const chipActiveClass =
  "border-[var(--color-secondary)] bg-[var(--color-royal-tint)] font-semibold text-[var(--color-secondary)] shadow-[var(--shadow-sm)]";

export function VisitorForm() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
    reset,
    setError,
    setFocus,
    setValue,
    trigger,
    watch,
  } = useForm<VisitorFormValues>({
    resolver: zodResolver(visitorSchema),
    defaultValues: visitorDefaultValues,
    mode: "onBlur",
  });

  const heardAboutUs = watch("heardAboutUs");
  const likedAboutService = watch("likedAboutService");
  const values = watch();

  const steps = useMemo(() => {
    const dynamicSteps = [...baseSteps];
    const heardIndex = dynamicSteps.findIndex((step) => step.id === "heardAboutUs");

    if (heardAboutUs === "Someone invited me") {
      dynamicSteps.splice(heardIndex + 1, 0, {
        id: "inviterName",
        title: "Who invited you?",
        description: "We would love to thank them too.",
        fields: ["inviterName"],
        section: "How You Found Us",
      });
    }

    if (heardAboutUs === "Others") {
      dynamicSteps.splice(heardIndex + 1, 0, {
        id: "heardOther",
        title: "How did you hear about us?",
        description: "Please share a little more detail.",
        fields: ["heardOther"],
        section: "How You Found Us",
      });
    }

    const likedIndex = dynamicSteps.findIndex((step) => step.id === "likedAboutService");

    if (likedAboutService.includes("Others")) {
      dynamicSteps.splice(likedIndex + 1, 0, {
        id: "likedOther",
        title: "What else stood out to you?",
        description: "Tell us what you enjoyed about the service.",
        fields: ["likedOther"],
        section: "Your Experience",
      });
    }

    return dynamicSteps;
  }, [heardAboutUs, likedAboutService]);

  const activeStep = steps[Math.min(activeIndex, steps.length - 1)];
  const progress = Math.round(((activeIndex + 1) / steps.length) * 100);
  const isFirstStep = activeIndex === 0;
  const isReviewStep = activeStep.id === "review";
  const isWelcomeStep = activeStep.id === "welcome";

  useEffect(() => {
    if (activeIndex > steps.length - 1) {
      setActiveIndex(steps.length - 1);
    }
  }, [activeIndex, steps.length]);

  useEffect(() => {
    if (heardAboutUs !== "Someone invited me") {
      setValue("inviterName", "", { shouldDirty: false, shouldValidate: false });
    }
  }, [heardAboutUs, setValue]);

  useEffect(() => {
    if (heardAboutUs !== "Others") {
      setValue("heardOther", "", { shouldDirty: false, shouldValidate: false });
    }
  }, [heardAboutUs, setValue]);

  useEffect(() => {
    if (!likedAboutService.includes("Others")) {
      setValue("likedOther", "", { shouldDirty: false, shouldValidate: false });
    }
  }, [likedAboutService, setValue]);

  useEffect(() => {
    const field = focusFieldByStep[activeStep.id];

    if (!field) {
      return;
    }

    const timer = window.setTimeout(() => setFocus(field), 180);
    return () => window.clearTimeout(timer);
  }, [activeStep.id, setFocus]);

  async function goNext() {
    if (!activeStep.optional && activeStep.fields.length > 0) {
      const isValid = await trigger(activeStep.fields, { shouldFocus: true });

      if (!isValid) {
        return;
      }
    }

    setActiveIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setActiveIndex((current) => Math.max(current - 1, 0));
  }

  async function selectAndAdvance<TField extends FieldPath<VisitorFormValues>>(
    field: TField,
    value: FieldPathValue<VisitorFormValues, TField>,
  ) {
    setValue(field, value, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    const isValid = await trigger(field, { shouldFocus: true });

    if (!isValid) {
      return;
    }

    window.setTimeout(() => {
      setActiveIndex((current) => Math.min(current + 1, steps.length - 1));
    }, 180);
  }

  async function onSubmit(valuesToSubmit: VisitorFormValues) {
    const payload = visitorSchema.parse(valuesToSubmit);
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

  function submitReview() {
    void handleSubmit(onSubmit)();
  }

  if (submitted) {
    return <SuccessScreen />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="w-full max-w-3xl">
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

        <section className="overflow-hidden rounded-3xl bg-white shadow-[var(--shadow-lg)]">
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
                We&apos;re honoured you joined us today. Share a few details so our team can thank you,
                pray with you, and walk your next step together.
              </p>
            </div>
          </div>
          <ProgressHeader
            activeIndex={activeIndex}
            progress={progress}
            section={activeStep.section}
            stepCount={steps.length}
            stepTitle={activeStep.title}
          />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (isReviewStep) {
                submitReview();
              } else {
                void goNext();
              }
            }}
            className="min-h-[520px] px-6 py-8 sm:px-10 sm:py-10"
          >
            {errors.root ? (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errors.root.message}
              </div>
            ) : null}

            <div key={activeStep.id} className="ea-reveal">
              <p className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
                <span className="h-2 w-2 rotate-45 rounded-[2px] bg-[var(--color-primary)]" />
                {activeStep.section}
              </p>
              <h1 className="mt-3 text-3xl font-extrabold text-[var(--color-secondary)] sm:text-5xl">
                {activeStep.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--color-body)]">
                {activeStep.description}
              </p>

              <div className="mt-8">
                {renderStep({
                  activeStep,
                  control,
                  errors,
                  getValues,
                  goNext,
                  register,
                  selectAndAdvance,
                  setValue,
                  trigger,
                  values,
                })}
              </div>
            </div>

            <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                className={cn("w-full sm:w-auto", isFirstStep && "invisible")}
                onClick={goBack}
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {isReviewStep ? (
                <Button type="button" size="lg" variant="gold" onClick={submitReview} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  {isSubmitting ? "Submitting..." : "Submit Visitor Form"}
                </Button>
              ) : (
                <Button type="submit" size="lg" variant="gold" className="w-full sm:w-auto">
                  {isWelcomeStep ? "Start" : activeStep.optional ? "Continue" : "Continue"}
                </Button>
              )}
            </div>
          </form>
        </section>

        <p className="mt-6 text-center text-xs text-[var(--color-muted)]">
          Enthronement Assembly Ontario &middot; You are Royalty
        </p>
      </div>
    </main>
  );
}

function renderStep({
  activeStep,
  control,
  errors,
  getValues,
  goNext,
  register,
  selectAndAdvance,
  setValue,
  trigger,
  values,
}: {
  activeStep: Step;
  control: ReturnType<typeof useForm<VisitorFormValues>>["control"];
  errors: ReturnType<typeof useForm<VisitorFormValues>>["formState"]["errors"];
  getValues: ReturnType<typeof useForm<VisitorFormValues>>["getValues"];
  goNext: () => Promise<void>;
  register: ReturnType<typeof useForm<VisitorFormValues>>["register"];
  selectAndAdvance: <TField extends FieldPath<VisitorFormValues>>(
    field: TField,
    value: FieldPathValue<VisitorFormValues, TField>,
  ) => Promise<void>;
  setValue: ReturnType<typeof useForm<VisitorFormValues>>["setValue"];
  trigger: ReturnType<typeof useForm<VisitorFormValues>>["trigger"];
  values: VisitorFormValues;
}) {
  switch (activeStep.id) {
    case "welcome":
      return (
        <div className="rounded-2xl bg-[var(--color-royal-tint)] p-5 text-[var(--color-secondary)]">
          <p className="text-lg font-semibold">This will take about one minute.</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-body)]">
            Use your keyboard&apos;s Next key on typed questions. Choice questions move forward automatically.
          </p>
        </div>
      );
    case "firstName":
      return (
        <TextStep
          autoComplete="given-name"
          enterKeyHint="next"
          error={errors.firstName?.message}
          placeholder="First name"
          registration={register("firstName")}
          onNext={goNext}
        />
      );
    case "lastName":
      return (
        <TextStep
          autoComplete="family-name"
          enterKeyHint="next"
          error={errors.lastName?.message}
          placeholder="Last name"
          registration={register("lastName")}
          onNext={goNext}
        />
      );
    case "phoneNumber":
      return (
        <TextStep
          autoComplete="tel"
          enterKeyHint="next"
          error={errors.phoneNumber?.message}
          inputMode="tel"
          placeholder="e.g. 0803 000 0000"
          registration={register("phoneNumber")}
          type="tel"
          onNext={goNext}
        />
      );
    case "email":
      return (
        <TextStep
          autoComplete="email"
          enterKeyHint="next"
          error={errors.email?.message}
          inputMode="email"
          placeholder="you@example.com"
          registration={register("email")}
          type="email"
          onNext={goNext}
        />
      );
    case "gender":
      return (
        <AutoRadioStep
          control={control}
          error={errors.gender?.message}
          name="gender"
          options={["Male", "Female"]}
          onSelect={selectAndAdvance}
        />
      );
    case "profession":
      return (
        <AutoRadioStep
          control={control}
          error={errors.profession?.message}
          name="profession"
          options={["Student", "Professional"]}
          onSelect={selectAndAdvance}
        />
      );
    case "homeAddress":
      return (
        <TextareaStep
          autoComplete="street-address"
          error={errors.homeAddress?.message}
          placeholder="Street, area, city"
          registration={register("homeAddress")}
        />
      );
    case "heardAboutUs":
      return (
        <AutoRadioStep
          control={control}
          error={errors.heardAboutUs?.message}
          name="heardAboutUs"
          options={[...hearOptions]}
          onSelect={selectAndAdvance}
        />
      );
    case "inviterName":
      return (
        <TextStep
          enterKeyHint="next"
          error={errors.inviterName?.message}
          placeholder="Inviter's full name"
          registration={register("inviterName")}
          onNext={goNext}
        />
      );
    case "heardOther":
      return (
        <TextStep
          enterKeyHint="next"
          error={errors.heardOther?.message}
          placeholder="How did you hear about us?"
          registration={register("heardOther")}
          onNext={goNext}
        />
      );
    case "nextStepsIntent":
      return (
        <AutoRadioStep
          control={control}
          error={errors.nextStepsIntent?.message}
          name="nextStepsIntent"
          options={["Just visiting", "I want to become a member"]}
          onSelect={selectAndAdvance}
        />
      );
    case "likedAboutService":
      return (
        <CheckboxStep
          error={errors.likedAboutService?.message}
          values={values.likedAboutService}
          onChange={(value) => setValue("likedAboutService", value, { shouldDirty: true, shouldValidate: true })}
          onValidate={() => trigger("likedAboutService", { shouldFocus: true })}
        />
      );
    case "likedOther":
      return (
        <TextStep
          enterKeyHint="next"
          error={errors.likedOther?.message}
          placeholder="What else stood out to you?"
          registration={register("likedOther")}
          onNext={goNext}
        />
      );
    case "canContact":
      return (
        <AutoRadioStep
          control={control}
          error={errors.canContact?.message}
          name="canContact"
          options={["Yes", "No"]}
          onSelect={selectAndAdvance}
        />
      );
    case "prayerRequest":
      return (
        <TextareaStep
          error={errors.prayerRequest?.message}
          placeholder="Share anything you would like us to stand with you in prayer about."
          registration={register("prayerRequest")}
        />
      );
    case "review":
      return <ReviewStep values={getValues()} />;
    default:
      return null;
  }
}

function ProgressHeader({
  activeIndex,
  progress,
  section,
  stepCount,
  stepTitle,
}: {
  activeIndex: number;
  progress: number;
  section: string;
  stepCount: number;
  stepTitle: string;
}) {
  return (
    <div className="border-b border-[var(--color-border)] bg-white px-6 py-5 sm:px-10">
      <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-muted)]">
        <span>
          {activeIndex + 1}/{stepCount}
        </span>
        <span className="truncate text-[var(--color-secondary)]">{section}</span>
        <span>{progress}%</span>
      </div>
      <div className="mt-3 truncate text-sm font-semibold text-[var(--color-text)]">{stepTitle}</div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--color-royal-tint)]">
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500 ease-[var(--ease)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function TextStep({
  error,
  onNext,
  registration,
  ...props
}: React.ComponentProps<"input"> & {
  error?: string;
  onNext: () => Promise<void>;
  registration: UseFormRegisterReturn;
}) {
  return (
    <div className="space-y-3">
      <Input
        {...registration}
        {...props}
        className="min-h-16 rounded-2xl px-5 text-xl"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void onNext();
          }

          props.onKeyDown?.(event);
        }}
      />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function TextareaStep({
  error,
  registration,
  ...props
}: React.ComponentProps<"textarea"> & {
  error?: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <div className="space-y-3">
      <Textarea {...registration} {...props} className="min-h-44 rounded-2xl px-5 py-4 text-lg" />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function AutoRadioStep<TName extends "gender" | "profession" | "heardAboutUs" | "nextStepsIntent" | "canContact">({
  control,
  error,
  name,
  onSelect,
  options,
}: {
  control: ReturnType<typeof useForm<VisitorFormValues>>["control"];
  error?: string;
  name: TName;
  onSelect: (field: TName, value: FieldPathValue<VisitorFormValues, TName>) => Promise<void>;
  options: readonly FieldPathValue<VisitorFormValues, TName>[];
}) {
  return (
    <div className="space-y-3">
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            onValueChange={(value) => void onSelect(name, value as FieldPathValue<VisitorFormValues, TName>)}
            value={field.value ?? ""}
            className="grid gap-3 sm:grid-cols-2"
          >
            {options.map((option) => (
              <Label key={option} className={cn(chipClass, field.value === option && chipActiveClass)}>
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

function CheckboxStep({
  error,
  onChange,
  onValidate,
  values,
}: {
  error?: string;
  onChange: (value: VisitorFormValues["likedAboutService"]) => void;
  onValidate: () => Promise<boolean>;
  values: VisitorFormValues["likedAboutService"];
}) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {serviceLikes.map((item) => {
          const checked = values.includes(item);
          return (
            <Label key={item} className={cn(chipClass, checked && chipActiveClass)}>
              <Checkbox
                checked={checked}
                onCheckedChange={(nextChecked) => {
                  const next = nextChecked ? [...values, item] : values.filter((value) => value !== item);
                  onChange(next);
                  window.setTimeout(() => void onValidate(), 0);
                }}
              />
              <span>{item}</span>
            </Label>
          );
        })}
      </div>
      {error ? <ErrorText>{error}</ErrorText> : null}
      <p className="text-sm text-[var(--color-muted)]">Choose one or more, then tap Continue.</p>
    </div>
  );
}

function ReviewStep({ values }: { values: VisitorFormValues }) {
  const rows = [
    ["First Name", values.firstName],
    ["Last Name", values.lastName],
    ["Phone Number", values.phoneNumber],
    ["Email", values.email],
    ["Gender", values.gender],
    ["Profession", values.profession],
    ["Home Address", values.homeAddress || "Not provided"],
    ["Heard About Us", values.heardAboutUs],
    ["Inviter", values.inviterName || "Not provided"],
    ["Other Source", values.heardOther || "Not provided"],
    ["Next Step", values.nextStepsIntent],
    ["Liked Service", values.likedAboutService.join(", ")],
    ["Other Feedback", values.likedOther || "Not provided"],
    ["Can Contact", values.canContact],
    ["Prayer Request", values.prayerRequest || "Not provided"],
  ];

  return (
    <div className="grid gap-3">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">{label}</p>
          <p className="mt-1 text-base font-semibold text-[var(--color-text)]">{value}</p>
        </div>
      ))}
    </div>
  );
}

function SuccessScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="w-full max-w-2xl rounded-3xl bg-white p-8 text-center shadow-[var(--shadow-lg)] sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(97,206,112,0.14)] text-[var(--color-green-deep)]">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-[var(--color-secondary)] sm:text-5xl">
          Thank you for visiting.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[var(--color-body)]">
          We&apos;re grateful you joined Enthronement Assembly Ontario today. Welcome to the family.
        </p>
      </section>
    </main>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-red-600">{children}</p>;
}
