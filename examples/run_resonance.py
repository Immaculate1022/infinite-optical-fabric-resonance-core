#!/usr/bin/env python3
"""
Run a basic φ-scaled Kuramoto resonance simulation on the IOF penteract.

Usage:
    python examples/run_resonance.py
"""

import sys
from pathlib import Path

# Allow running from repo root without installation
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import numpy as np
import matplotlib.pyplot as plt

from iof import PhiKuramotoNetwork, PenteractGraph


def main():
    print("Infinite Optical Fabric — Resonance Core Simulation")
    print("=" * 55)

    # Topology check
    g = PenteractGraph()
    print(g.summary())

    # Create the φ-scaled Kuramoto network
    net = PhiKuramotoNetwork(K=3.5, phi=1.618033988749895, omega_scale=0.3, seed=42)

    print(f"Coupling K = {net.K}")
    print(f"Golden ratio φ = {net.phi:.6f}")
    print(f"Nodes = {net.N}")
    print("Integrating oscillators...")

    results = net.run_and_measure(t_span=(0.0, 100.0), transient=30.0)

    print("\n--- Resonance Metrics ---")
    print(f"Mean order parameter ⟨R⟩ : {results['mean_order_parameter']:.4f}")
    print(f"Final order parameter R  : {results['final_order_parameter']:.4f}")
    print(f"Coherence proxy          : {results['coherence_proxy']:.4f}")

    # Simple visualization
    fig, axes = plt.subplots(2, 1, figsize=(10, 7), sharex=False)

    # Order parameter over time (after transient)
    axes[0].plot(results["t_ss"], results["r_series"], color="#f0c040", lw=1.8)
    axes[0].axhline(0.92, color="cyan", ls="--", alpha=0.7, label="Target ~0.92 (diagram)")
    axes[0].set_ylabel("Order parameter R(t)")
    axes[0].set_title("IOF Resonance Core — Synchronization Dynamics")
    axes[0].set_ylim(0, 1.05)
    axes[0].legend()
    axes[0].grid(True, alpha=0.3)

    # Final phase snapshot (circular)
    final_theta = results["theta"][-1]
    ax = axes[1]
    ax = plt.subplot(2, 1, 2, projection="polar")
    ax.scatter(final_theta, np.ones_like(final_theta), c="#40c0f0", s=60, alpha=0.85)
    ax.set_title("Final phase distribution on the circle")
    ax.set_rticks([])

    plt.tight_layout()
    out = Path("resonance_output.png")
    plt.savefig(out, dpi=150, facecolor="#0a0a12")
    print(f"\nPlot saved to {out.resolve()}")
    plt.show()


if __name__ == "__main__":
    main()
