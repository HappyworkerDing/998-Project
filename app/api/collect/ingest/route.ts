import { publish } from "@/lib/collector/bus";
import type { CollectEvent } from "@/lib/collector/types";

function isValid(e: any): e is CollectEvent {
  return (
    e &&
    typeof e.eventId === "string" &&
    typeof e.ts === "number" &&
    (e.modality === "network" || e.modality === "host" || e.modality === "log") &&
    e.features &&
    typeof e.features === "object"
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = Array.isArray(body) ? body : [body];

    for (const e of events) {
      if (!isValid(e)) {
        return Response.json({ ok: false, error: "Invalid event schema" }, { status: 400 });
      }
      publish(e);
    }

    return Response.json({ ok: true, count: events.length });
  } catch (err: any) {
    return Response.json({ ok: false, error: err?.message ?? "Bad Request" }, { status: 400 });
  }
}

