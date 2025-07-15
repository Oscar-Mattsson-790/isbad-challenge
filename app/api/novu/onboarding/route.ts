// app/api/novu/onboarding/route.ts
import { Novu } from "@novu/api";
import { NextResponse } from "next/server";

const novu = new Novu({ secretKey: process.env.NOVU_SECRET_KEY });

export async function POST(req: Request) {
  const body = await req.json();
  const { id, email, fullName } = body;

  try {
    // Skapa subscriber (om den redan finns, gör inget)
    await novu.subscribers.create({
      subscriberId: id,
      email,
      firstName: fullName ?? "ISBAD user",
    });

    // Trigga onboarding-flöde
    await novu.trigger({
      workflowId: "onboarding-isbad-challenge-workflow",
      to: {
        subscriberId: id,
        email,
      },
      payload: {
        fullName: fullName ?? "ISBAD user",
      },
    });

    return NextResponse.json({ success: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Novu trigger error:", error);
    console.error("💬 Full error body:", JSON.stringify(error.body, null, 2));
    return NextResponse.json(
      { error: error.message || "Failed to send onboarding notification" },
      { status: 500 }
    );
  }
}
