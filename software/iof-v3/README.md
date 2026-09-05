# IOF v3 — FluxEngine (Golden Build)

Real-time multi-axis oscillator system for resonance tracking, synchronization experiments, and AI interop.

## Axes
- **F** — Frequency
- **L** — Luminance
- **U** — Utility
- **X** — eXternal

## Core Components
- `FluxEngine` — spring-damper physics on normalized [0,1] axes
- `PalindromeBuffer` — AI-readable change log with intent classification
- `IOF_PROTOCOL` — shared contract for external agents

## Quick Use (Browser)
```html
<script src="flux-engine.js"></script>
<script>
  const engine = new IOFv3.FluxEngine();
  engine.subscribe(state => console.log(state.resonance));
  engine.start();
  engine.nudge("F", 1);
</script>
```

## Quick Use (Node)
```js
const { FluxEngine } = require("./flux-engine.js");
const engine = new FluxEngine();
engine.subscribe(s => console.log(s.overall, s.resonance));
// Note: requestAnimationFrame is browser-only; replace loop for pure Node if needed.
```

## Physics
```
velocity += (spring × distance − damping × velocity) × dt
value    += velocity × dt
```
Resonance metric: `1 − min(1, variance × 4)`

Originally developed through a multi-AI collaborative pipeline and released here under CC BY 4.0.
