import { z } from "zod";

export const hearOptions = ["Someone invited me", "Social Media", "Flyer", "Others"] as const;
export const serviceLikes = ["Praise & Worship", "Prayer", "The Word", "Others"] as const;

export const visitorSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    phoneNumber: z.string().trim().min(7, "Enter a valid phone number."),
    email: z.string().trim().email("Enter a valid email address."),
    gender: z.enum(["Male", "Female"], { error: "Please select your gender." }),
    homeAddress: z.string().trim().optional(),
    profession: z.enum(["Student", "Professional"], { error: "Please select your profession." }),
    heardAboutUs: z.enum(hearOptions, { error: "Please select how you heard about us." }),
    inviterName: z.string().trim().optional(),
    heardOther: z.string().trim().optional(),
    nextStepsIntent: z.enum(["Just visiting", "I want to become a member"], {
      error: "Please select your next step.",
    }),
    likedAboutService: z.array(z.enum(serviceLikes)).min(1, "Select at least one option."),
    likedOther: z.string().trim().optional(),
    canContact: z.enum(["Yes", "No"], { error: "Please choose an option." }),
    prayerRequest: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.heardAboutUs === "Someone invited me" && !data.inviterName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["inviterName"],
        message: "Please enter the inviter's name.",
      });
    }

    if (data.heardAboutUs === "Others" && !data.heardOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["heardOther"],
        message: "Please specify how you heard about us.",
      });
    }

    if (data.likedAboutService.includes("Others") && !data.likedOther) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["likedOther"],
        message: "Please specify what you liked.",
      });
    }
  });

export type VisitorFormValues = z.infer<typeof visitorSchema>;

export const visitorDefaultValues: VisitorFormValues = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  email: "",
  gender: undefined as unknown as VisitorFormValues["gender"],
  homeAddress: "",
  profession: undefined as unknown as VisitorFormValues["profession"],
  heardAboutUs: undefined as unknown as VisitorFormValues["heardAboutUs"],
  inviterName: "",
  heardOther: "",
  nextStepsIntent: undefined as unknown as VisitorFormValues["nextStepsIntent"],
  likedAboutService: [],
  likedOther: "",
  canContact: undefined as unknown as VisitorFormValues["canContact"],
  prayerRequest: "",
};
