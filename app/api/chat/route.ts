import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  "You are OnePort 365 Brain, an intelligent AI assistant for OnePort 365 — a Nigerian freight forwarding and logistics company. You specialise in ocean freight (FCL, LCL), air freight, customs clearance, freight rates, RFQs, Nigeria import/export regulations, ports (Apapa, Tin Can, Lagos), Incoterms, HS codes, and cargo classification. Be concise and professional. Always frame answers in the context of Nigerian logistics.";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}
