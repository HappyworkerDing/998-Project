import type { CollectEvent } from "./types";

type Listener = (evt: CollectEvent) => void;

const listeners = new Set<Listener>();
const ring: CollectEvent[] = [];

export function publish(evt: CollectEvent) {
  ring.push(evt);
  if (ring.length > 200) ring.shift();
  for (const fn of listeners) fn(evt);
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function recent(n = 50) {
  return ring.slice(-n);
}
