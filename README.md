# Enthronement Assembly Ontario Visitor Form

Mobile-first Next.js App Router form for first-time visitors at Enthronement Assembly Ontario.

The form collects visitor details, validates them with Zod, and forwards successful submissions to a Make.com webhook for Google Sheets or other follow-up automation.

## Tech Stack

- Next.js App Router
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui-style components
- Make.com webhook integration

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create `.env.local`:

```bash
MAKE_WEBHOOK_URL=https://hook.us2.make.com/your-webhook-id
```

Run the development server:

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
pnpm build
```

## Submission Flow

1. The visitor fills out the form.
2. The browser validates the form using `visitorSchema`.
3. The client submits the parsed payload to `/api/visitor`.
4. The API route validates the payload again.
5. The API route forwards the payload to `MAKE_WEBHOOK_URL`.

The Make webhook URL is stored server-side only and should not be exposed in client code.

## Payload Fields

The form sends these fields:

```text
firstName
lastName
phoneNumber
email
gender
homeAddress
profession
heardAboutUs
inviterName
heardOther
nextStepsIntent
likedAboutService
likedOther
canContact
prayerRequest
```

`likedAboutService` is an array and should be joined with commas when mapping into a single Google Sheets cell.

## Key Files

- `components/visitor-form.tsx` - client form UI and submission flow
- `lib/visitor-schema.ts` - shared Zod schema, types, defaults, and option lists
- `app/api/visitor/route.ts` - server route that validates and forwards to Make.com
- `app/globals.css` - brand colors and global styling

## Brand

Church: Enthronement Assembly Ontario  
Motto: Activating and actualizing God's royalty in you

Brand colors:

```css
--color-primary: #c9a227;
--color-secondary: #3b235a;
--color-bg: #ffffff;
--color-surface: #f8f6f2;
--color-text: #1f1f1f;
--color-muted: #6b6b6b;
```
