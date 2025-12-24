export type Modality = "network" | "host" | "log";
export type Severity = "low" | "medium" | "high";

export type CollectEvent = {
  eventId: string;
  ts: number; // Date.now()
  modality: Modality;
  source?: string;
  host?: string;
  type?: string;
  severity?: Severity;
  features: Record<string, any>;
  raw?: Record<string, any>;
};
