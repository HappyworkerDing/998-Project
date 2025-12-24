import crypto from "crypto";

const url = "http://localhost:3000/api/collect/ingest";

function mk(modality) {
  const now = Date.now();
  const r = Math.random();
  const severity = r > 0.92 ? "high" : r > 0.75 ? "medium" : "low";

  const base = {
    eventId: crypto.randomUUID(),
    ts: now,
    modality,
    source: `mock-${modality}-1`,
    host: "localhost",
    severity,
  };

  if (modality === "network") {
    return {
      ...base,
      type: Math.random() > 0.95 ? "attack_port_scan" : "net_flow",
      features: {
        srcIP: "10.0.0.5",
        dstIP: "10.0.0.9",
        srcPort: 52341,
        dstPort: Math.random() > 0.95 ? 23 : 22,
        proto: "TCP",
        bytes: Math.floor(Math.random() * 50000),
      },
    };
  }

  if (modality === "host") {
    return {
      ...base,
      type: Math.random() > 0.95 ? "attack_proc_inject" : "proc_create",
      features: {
        proc: Math.random() > 0.9 ? "powershell.exe" : "bash",
        pid: Math.floor(Math.random() * 5000),
      },
    };
  }

  return {
    ...base,
    type: Math.random() > 0.95 ? "attack_auth_bruteforce" : "auth_fail",
    features: {
      app: "ssh",
      user: Math.random() > 0.5 ? "root" : "admin",
      msg: "failed login",
    },
  };
}

console.log("Mock collector running...");

setInterval(async () => {
  const modalities = ["network", "host", "log"];
  const m = modalities[Math.floor(Math.random() * modalities.length)];
  const evt = mk(m);

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evt),
  }).catch(() => {});
}, 400);
