import { subscribe, recent } from "@/lib/collector/bus";

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 先发一条开场，确保连接建立
      controller.enqueue(encoder.encode(`event: hello\ndata: {}\n\n`));

      for (const evt of recent(50)) {
        controller.enqueue(encoder.encode(`event: collect\ndata: ${JSON.stringify(evt)}\n\n`));
      }

      const unsub = subscribe((evt) => {
        controller.enqueue(encoder.encode(`event: collect\ndata: ${JSON.stringify(evt)}\n\n`));
      });

      const hb = setInterval(() => {
        controller.enqueue(encoder.encode(`event: ping\ndata: {}\n\n`));
      }, 15000);

      // @ts-ignore
      controller.signal?.addEventListener?.("abort", () => {
        clearInterval(hb);
        unsub();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // 关键：很多环境会缓冲 SSE，没有这个会不推送
      "X-Accel-Buffering": "no",
    },
  });
}
