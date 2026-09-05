/**
 * IOF v3 — WebSocket Server
 * Station: Final Convergence Build
 * "The right frequency changes everything."
 *
 * Integrated into the open Infinite Optical Fabric repository
 * under CC BY 4.0 — attribution to Gregory Scott Davis / Immaculate1022
 * and collaborative contributors.
 */

const { WebSocketServer } = require("ws");
const { performance } = require("perf_hooks");

// ─────────────────────────────────────────────
// 🔹 CORE CONSTANTS (mirrored from golden build)
// ─────────────────────────────────────────────
const IOF_CONSTANTS = {
  MAX_VELOCITY: 2,
  SPRING: 2.0,
  DAMPING: 0.92,
  STEP: 0.12,
  KICK: 0.08
};

const IOF_PROTOCOL = {
  name: "IOFv3",
  version: "3.0",
  schema: {
    values: "0..1 normalized axes",
    targets: "desired state",
    deltas: "change log with intent",
    resonance: "system coherence metric"
  },
  actions: ["nudge", "setTarget", "subscribe", "getState", "getProtocol"]
};

// ─────────────────────────────────────────────
// 🔹 PALINDROME BUFFER
// ─────────────────────────────────────────────
class PalindromeBuffer {
  constructor(capacity = 128) {
    this.capacity = capacity;
    this.primary = new Array(capacity);
    this.mirror = new Array(capacity);
    this.cursor = 0;
  }

  classifyIntent(reason) {
    if (!reason) return "unknown";
    if (reason.includes("manual")) return "user_input";
    if (reason.includes("auto")) return "system";
    return "external";
  }

  write(key, value, prev, reason = "system") {
    const ts = performance.now();
    const delta = {
      key,
      from: prev,
      to: value,
      delta: (typeof value === "number" && typeof prev === "number") ? value - prev : null,
      intent: this.classifyIntent(reason),
      reason,
      ts,
      idx: this.cursor
    };
    this.primary[this.cursor % this.capacity] = { key, value, ts };
    this.mirror[this.cursor % this.capacity] = delta;
    this.cursor++;
    return delta;
  }

  read(n = 25) {
    const out = [];
    const start = Math.max(0, this.cursor - n);
    for (let i = start; i < this.cursor; i++) {
      const d = this.mirror[i % this.capacity];
      if (d) out.push(d);
    }
    return out;
  }
}

// ─────────────────────────────────────────────
// 🔹 FLUX ENGINE
// ─────────────────────────────────────────────
class FluxEngine {
  constructor(seedState) {
    this.values = seedState || { F: 0.72, L: 0.45, U: 0.88, X: 0.61 };
    this.targets = { ...this.values };
    this.velocity = Object.fromEntries(Object.keys(this.values).map(k => [k, 0]));
    this.buffer = new PalindromeBuffer(128);
    this.subscribers = new Set();
    this.lastTime = performance.now();
    this.running = false;
    this._intervalId = null;
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  notify() {
    const snapshot = this.getState();
    this.subscribers.forEach(fn => fn(snapshot));
  }

  getState() {
    return {
      values: { ...this.values },
      targets: { ...this.targets },
      deltas: this.buffer.read(20),
      overall: this.getOverall(),
      resonance: this.getResonance(),
      timestamp: performance.now()
    };
  }

  getOverall() {
    const vals = Object.values(this.values);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }

  getResonance() {
    const vals = Object.values(this.values);
    const mean = this.getOverall();
    const variance = vals.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / vals.length;
    return 1 - Math.min(1, variance * 4);
  }

  nudge(key, dir = 1, reason = "manual-nudge") {
    if (!(key in this.targets)) return;
    const prev = this.targets[key];
    const next = Math.max(0, Math.min(1, prev + dir * IOF_CONSTANTS.STEP));
    this.targets[key] = next;
    this.velocity[key] += dir * IOF_CONSTANTS.KICK;
    this.buffer.write(key, next, prev, reason);
    this.notify();
  }

  setTarget(key, value, reason = "external-set") {
    if (!(key in this.targets)) return;
    const prev = this.targets[key];
    this.targets[key] = Math.max(0, Math.min(1, value));
    this.buffer.write(key, this.targets[key], prev, reason);
    this.notify();
  }

  step(dt) {
    for (const key in this.values) {
      const dist = this.targets[key] - this.values[key];
      const spring = dist * IOF_CONSTANTS.SPRING;
      const damping = this.velocity[key] * IOF_CONSTANTS.DAMPING;
      this.velocity[key] += (spring - damping) * dt;
      this.velocity[key] = Math.max(
        -IOF_CONSTANTS.MAX_VELOCITY,
        Math.min(IOF_CONSTANTS.MAX_VELOCITY, this.velocity[key])
      );
      this.values[key] += this.velocity[key] * dt;
      this.values[key] = Math.max(0, Math.min(1, this.values[key]));
    }
  }

  start(tickMs = 16) {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this._intervalId = setInterval(() => {
      const now = performance.now();
      const dt = (now - this.lastTime) / 1000;
      this.lastTime = now;
      this.step(dt);
      this.notify();
    }, tickMs);
  }

  stop() {
    this.running = false;
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
  }
}

// ─────────────────────────────────────────────
// 🔹 WEBSOCKET SERVER
// ─────────────────────────────────────────────
const PORT = process.env.IOF_PORT || 8765;
const engine = new FluxEngine();
const wss = new WebSocketServer({ port: PORT });
let clientCount = 0;

// Broadcast state to all connected clients
engine.subscribe((state) => {
  const msg = JSON.stringify({ type: "state", payload: state });
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
});

wss.on("connection", (ws) => {
  clientCount++;
  const id = clientCount;
  console.log(`[IOFv3] Client #${id} connected. Total: ${wss.clients.size}`);

  ws.send(JSON.stringify({ type: "handshake", payload: IOF_PROTOCOL }));
  ws.send(JSON.stringify({ type: "state", payload: engine.getState() }));

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      ws.send(JSON.stringify({ type: "error", payload: "Invalid JSON" }));
      return;
    }

    const { action, key, value, dir, reason } = msg;
    switch (action) {
      case "nudge":
        engine.nudge(key, dir ?? 1, reason ?? "manual-nudge");
        break;
      case "setTarget":
        engine.setTarget(key, value, reason ?? "external-set");
        break;
      case "getState":
        ws.send(JSON.stringify({ type: "state", payload: engine.getState() }));
        break;
      case "getProtocol":
        ws.send(JSON.stringify({ type: "handshake", payload: IOF_PROTOCOL }));
        break;
      default:
        ws.send(JSON.stringify({ type: "error", payload: `Unknown action: ${action}` }));
    }
  });

  ws.on("close", () => {
    console.log(`[IOFv3] Client #${id} disconnected. Total: ${wss.clients.size}`);
  });

  ws.on("error", (err) => {
    console.error(`[IOFv3] Client #${id} error:`, err.message);
  });
});

wss.on("listening", () => {
  console.log(`[IOFv3] WebSocket server running on ws://localhost:${PORT}`);
  console.log(`[IOFv3] Protocol: ${IOF_PROTOCOL.name} v${IOF_PROTOCOL.version}`);
  engine.start();
  console.log(`[IOFv3] FluxEngine started. Axes: F, L, U, X`);
});

wss.on("error", (err) => {
  console.error(`[IOFv3] Server error:`, err.message);
});

process.on("SIGINT", () => {
  console.log("\n[IOFv3] Shutting down…");
  engine.stop();
  wss.close(() => process.exit(0));
});
