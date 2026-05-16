# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start the dev server (http://localhost:3000)
- `pnpm build` — production build
- `pnpm start` — serve the production build
- `pnpm lint` — run Next.js ESLint

This project uses **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`). There is no test suite.

## Environment

`MAKE_WEBHOOK_URL` must be set (`.env.local`) — the Make.com webhook that visitor
submissions are forwarded to. The API route returns HTTP 500 if it is missing.
See `.env.example` for the format.

## Architecture

A single-page Next.js App Router application: one public form that captures
first-time church visitors and relays validated data to a Make.com automation.

- `lib/visitor-schema.ts` — **single source of truth**. The Zod `visitorSchema`,
  its inferred `VisitorFormValues` type, `visitorDefaultValues`, and the
  option arrays (`hearOptions`, `serviceLikes`) are all consumed by both the
  client form and the server API route. Add/change fields here first.
  Conditional-field requirements (inviter name, "Others" specify fields) are
  enforced via `superRefine`.
- `components/visitor-form.tsx` — `"use client"` form. Uses react-hook-form with
  `zodResolver(visitorSchema)`, `mode: "onBlur"`. Conditionally shown fields are
  cleared via `useEffect` + `setValue` when their trigger option is deselected.
  On submit it POSTs JSON to `/api/visitor`. Helper sub-components (`FormSection`,
  `Field`, `RadioField`, `CheckboxGroup`) live in the same file.
- `app/api/visitor/route.ts` — POST handler. Re-validates the body with
  `visitorSchema.safeParse` (never trust the client), then forwards to the
  Make webhook. Returns 400 on invalid input, 502 on webhook failure.
- `app/page.tsx` / `app/layout.tsx` — render `VisitorForm`; Geist fonts.

Validation runs **twice** — client (UX) and server (trust boundary) — both
against the same schema. Keep them in sync by only editing `visitor-schema.ts`.

## Conventions

- Path alias `@/*` maps to the project root (e.g. `@/lib/visitor-schema`).
- UI is shadcn/ui ("new-york" style) in `components/ui/`, Tailwind v4
  (CSS-first config via `@import "tailwindcss"` in `app/globals.css`).
- Theme colors are CSS custom properties defined in `app/globals.css`
  (`--color-primary` gold, `--color-secondary` purple); reference them as
  `var(--color-*)` in className rather than hardcoding hex values.
