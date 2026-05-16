import { NextResponse } from "next/server";
import { visitorSchema } from "@/lib/visitor-schema";

export async function POST(request: Request) {
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json({ error: "Make webhook URL is not configured." }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const result = visitorSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        error: "Invalid visitor form submission.",
        issues: result.error.flatten(),
      },
      { status: 400 },
    );
  }

  console.log("First-time visitor payload", result.data);

  const makeResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result.data),
  });

  if (!makeResponse.ok) {
    return NextResponse.json(
      { error: "Make webhook request failed." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
