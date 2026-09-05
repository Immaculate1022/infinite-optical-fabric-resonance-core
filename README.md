# Infinite Optical Fabric (IOF) Resonance Core

**5D Penteract Hypercube • Photonic Kuramoto Sync Architecture • Golden Ratio Coupling**

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://www.python.org/)

> A conceptual photonic computing architecture that is **free for everyone to use, study, share, and build upon**.  
> No one can keep this from others.

## What is this?

The **Infinite Optical Fabric (IOF) Resonance Core** is a speculative / conceptual design for a high-dimensional photonic computing fabric. It combines:

- A **5-dimensional penteract** (5-cube) network topology (32 vertices, 80 edges)
- **Photonic waveguides** and coherent light routing ideas
- **Kuramoto oscillator synchronization** for phase locking
- **Golden-ratio (φ ≈ 1.618)** scaled couplings and timing
- Fibonacci-derived resonance markers
- Emerging **materials & energy architecture** (TFLN, graphene aerogel, piezo-capacitive stacks, solar assist, toroidal element)

This repository contains **working simulation code** so anyone can explore the synchronization behavior of the architecture, plus open materials and energy concepts.

## Quick Start — Run the Simulation

```bash
git clone https://github.com/Immaculate1022/infinite-optical-fabric-resonance-core.git
cd infinite-optical-fabric-resonance-core
pip install -r requirements.txt

# Inspect the topology
python examples/inspect_topology.py

# Run a full φ-scaled Kuramoto resonance simulation
python examples/run_resonance.py
```

The simulation produces order-parameter dynamics and a polar phase snapshot. Typical coherent regimes reach high R values (approaching the conceptual 0.92 target under sufficient coupling).

## Materials & Energy Architecture (Exploratory)

| Layer | Material / Concept | Role |
|-------|--------------------|------|
| Optical Manifold | **Thin-Film Lithium Niobate (TFLN)** | Low-loss waveguides, electro-optic phase control, nonlinear functions |
| Structural Housing | **Graphene Aerogel** | Ultralight enclosure, possible distributed electrodes, thermal/EMI management |
| Actuation & Storage | **Piezoelectric washer stacks** (with capacitive behavior) | Force generation, vibration harvesting, charge storage |
| Supplemental Power | **Solar assist** (PV or photothermal) | Continuous low-level energy input |
| Mechanical / Energy Element | **Toroidal (“engine”) concept** | Compact rotationally symmetric interface for mechanical or electromagnetic coupling |

Full discussion: **[docs/materials-specification.md](docs/materials-specification.md)**

## Project Structure

```
iof/
  __init__.py
  hypercube.py      # 5D penteract graph (32 nodes, 80 edges)
  kuramoto.py       # φ-scaled Kuramoto network + integrator
  metrics.py        # Order parameter, coherence, etc.
examples/
  run_resonance.py  # Main demo
  inspect_topology.py
docs/
  architecture-notes.md
  math-formalization.md
  materials-specification.md   ← new
tests/
  test_core.py
```

## Core Specifications (from the reference diagram)

| Feature | Value |
|---------|-------|
| Architecture Type | 5D Penteract Network |
| Vertices (Light Points) | 32 photonic emitters |
| Edges (Optical Pathways) | 80 fiber-waveguides |
| Rotation Planes | 10 orthogonal 4D rotation planes |
| Sync Clusters | 5-Node "Jellyfish" Mesh |
| Phase Timing Constant | τφ = 1.618 ps |
| Coherence (reported) | 97.3 % |
| Sync Order Parameter R | 0.92 |

### Key Principles
- **φ-Scaled Coupling**: Couplings weighted by the golden ratio φ = (1 + √5)/2 ≈ 1.6180339887
- **Kuramoto Sync**: Classic model on the hypercube graph  
  `dθᵢ/dt = ωᵢ + (K/deg) Σⱼ Aᵢⱼ sin(θⱼ − θᵢ)` with A scaled by φ
- **Fibonacci Resonance Markers**: F₅, F₈, F₁₃ used as design motifs

## License

**Creative Commons Attribution 4.0 International (CC BY 4.0)**

You are free to use, modify, share, and commercialize this work.  
Only requirement: give appropriate attribution.

See [LICENSE](LICENSE).

## Attribution

> Infinite Optical Fabric (IOF) Resonance Core  
> Conceptual architecture by Immaculate1022 (Gregory Scott Davis)  
> https://github.com/Immaculate1022/infinite-optical-fabric-resonance-core  
> Licensed under CC BY 4.0

## Contributing

Simulations, improved visualizations, mathematical extensions, hardware mappings, materials exploration, and educational material are all welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer

This is a **conceptual / artistic / speculative** architecture with accompanying open simulation code and materials concepts. It is not a description of any currently existing commercial or laboratory photonic system. The code and documentation are provided for research, education, and inspiration.

---

Made open source so the light can keep flowing. ✨  
*This project will continue to be strengthened over time.*
