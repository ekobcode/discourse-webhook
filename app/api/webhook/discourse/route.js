import { verifyDiscourseSignature } from "@/lib/middlewares/discourse-signature";
import webhookService from "@/lib/services/webhook.service";

export async function POST(request) {
  try {
    // 1️⃣ ambil RAW BODY (WAJIB sebelum json())
    const rawBody = await request.text();

    // 2️⃣ ambil signature header
    const signature = request.headers.get(
      "x-discourse-event-signature"
    );

    // 3️⃣ verifikasi signature
    const valid = verifyDiscourseSignature(
      rawBody,
      signature,
      process.env.DISCOURSE_WEBHOOK_SECRET
    );

    if (!valid) {
      console.warn("[Webhook] invalid signature");
      return Response.json(
        { error: "invalid_signature" },
        { status: 401 }
      );
    }

    // 4️⃣ parse JSON SETELAH signature lolos
    const payload = JSON.parse(rawBody);

    const eventType = request.headers.get("x-discourse-event");

    const discourseUserId =
      payload?.post?.username ||
      payload?.topic?.username ||
      payload?.like?.post?.username;

    if (!eventType || !discourseUserId) {
      console.warn("[Webhook] invalid payload", payload);
      return Response.json({ status: "ignored" });
    }

    await webhookService.processDiscourseEvent({
      eventType,
      discourseUserId
    });

    return Response.json({ status: "ok" });
  } catch (err) {
    console.error("[Webhook] error:", err);
    return Response.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}
