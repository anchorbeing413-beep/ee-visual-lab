/**
 * ============================================================================
 * EE VISUAL LAB - RC TRANSIENT PHYSICS & SCIENTIFIC COMPUTING ENGINE
 * Pure mathematical formulation verified against differential equations:
 *   R * C * (dv_c / dt) + v_c(t) = V_s(t)
 * ============================================================================
 */

class RCSimulatorEngine {
  constructor(config = {}) {
    this.R = config.R ?? 10000;         // Ohms (10 kOhm)
    this.C = config.C ?? 0.0001;        // Farads (100 uF)
    this.Vs = config.Vs ?? 10.0;        // Volts
    this.V0 = config.V0 ?? 0.0;         // Initial capacitor voltage (Volts)
    this.mode = config.mode ?? 'charge'; // 'charge' | 'discharge'
    this.timeSpanMultiplier = 6;        // Observe up to 6 * tau by default
  }

  // Calculate Time Constant tau = R * C (seconds)
  get tau() {
    return this.R * this.C;
  }

  // Max observation time (seconds)
  get maxTime() {
    return Math.max(0.001, this.tau * this.timeSpanMultiplier);
  }

  // Exact Analytical Capacitor Voltage at time t
  voltageAt(t) {
    if (t < 0) return this.V0;
    const tau = this.tau;
    if (this.mode === 'charge') {
      // General 1st order solution: v_c(t) = v_c(infinity) + [v_c(0) - v_c(infinity)] * e^(-t/tau)
      return this.Vs + (this.V0 - this.Vs) * Math.exp(-t / tau);
    } else {
      // Discharging into resistor R (Vs = 0)
      return this.V0 * Math.exp(-t / tau);
    }
  }

  // Exact Analytical Loop Current at time t (Amperes)
  currentAt(t) {
    if (t < 0) return 0;
    const tau = this.tau;
    if (this.mode === 'charge') {
      return ((this.Vs - this.V0) / this.R) * Math.exp(-t / tau);
    } else {
      // Discharge current flows in reverse direction
      return (-this.V0 / this.R) * Math.exp(-t / tau);
    }
  }

  // Resistor Voltage at time t (Volts)
  resistorVoltageAt(t) {
    return this.currentAt(t) * this.R;
  }

  // Instantaneous Power into Capacitor: p(t) = v_c(t) * i(t) (Watts)
  powerAt(t) {
    return this.voltageAt(t) * this.currentAt(t);
  }

  // Instantaneous Energy Stored in Capacitor: E = 0.5 * C * v_c^2 (Joules)
  energyAt(t) {
    const v = this.voltageAt(t);
    return 0.5 * this.C * v * v;
  }

  // Max energy possible when fully charged to Vs
  get maxEnergy() {
    return 0.5 * this.C * this.Vs * this.Vs;
  }

  // Calculate rise time (10% to 90% of final step)
  // t_90 = tau * ln(1/(1-0.9)) = tau * ln(10) = 2.3026 tau
  // t_10 = tau * ln(1/(1-0.1)) = tau * ln(10/9) = 0.1054 tau
  // t_r = 2.1972 * tau
  get riseTime() {
    return 2.197224577 * this.tau;
  }

  // Settling times
  get timeTo63Percent() {
    return this.tau; // exactly 1 - 1/e = 0.63212
  }

  get timeTo98Percent() {
    return 4 * this.tau; // 1 - e^-4 = 0.98168
  }

  get timeTo99Percent() {
    return 5 * this.tau; // 1 - e^-5 = 0.99326
  }

  // Generate high-resolution dataset for scientific plotting
  generateWaveformData(numPoints = 300) {
    const tMax = this.maxTime;
    const dt = tMax / (numPoints - 1);
    const data = {
      time: new Float64Array(numPoints),
      voltage: new Float64Array(numPoints),
      current: new Float64Array(numPoints),
      resistorV: new Float64Array(numPoints),
      power: new Float64Array(numPoints),
      energy: new Float64Array(numPoints),
      tauMarkers: []
    };

    for (let i = 0; i < numPoints; i++) {
      const t = i * dt;
      data.time[i] = t;
      data.voltage[i] = this.voltageAt(t);
      data.current[i] = this.currentAt(t);
      data.resistorV[i] = this.resistorVoltageAt(t);
      data.power[i] = this.powerAt(t);
      data.energy[i] = this.energyAt(t);
    }

    // Tau milestones for annotations: 1 tau through 5 tau
    for (let k = 1; k <= 5; k++) {
      const tMarker = k * this.tau;
      if (tMarker <= tMax) {
        data.tauMarkers.push({
          k: k,
          t: tMarker,
          v: this.voltageAt(tMarker),
          percentage: this.mode === 'charge' && this.V0 === 0 
            ? ((1 - Math.exp(-k)) * 100).toFixed(1) 
            : null
        });
      }
    }

    return data;
  }

  // Reverse Engineering Solver:
  // Given target voltage fraction V_target/Vs at time t_target, solve for R
  static solveResistanceForTarget(t_target, v_fraction, C) {
    // 1 - e^(-t/(RC)) = v_fraction
    // e^(-t/(RC)) = 1 - v_fraction
    // -t/(RC) = ln(1 - v_fraction)
    // RC = -t / ln(1 - v_fraction)
    // R = -t / (C * ln(1 - v_fraction))
    if (v_fraction <= 0 || v_fraction >= 1) return null;
    const denominator = C * Math.log(1 - v_fraction);
    return -t_target / denominator;
  }

  // Format quantities with engineering SI prefixes
  static formatSI(value, unit = '', decimals = 3) {
    if (value === 0) return `0 ${unit}`;
    const absVal = Math.abs(value);
    const prefixes = [
      { factor: 1e9, symbol: 'G' },
      { factor: 1e6, symbol: 'M' },
      { factor: 1e3, symbol: 'k' },
      { factor: 1, symbol: '' },
      { factor: 1e-3, symbol: 'm' },
      { factor: 1e-6, symbol: 'μ' },
      { factor: 1e-9, symbol: 'n' },
      { factor: 1e-12, symbol: 'p' }
    ];

    for (const p of prefixes) {
      if (absVal >= p.factor * 0.999) {
        const scaled = value / p.factor;
        return `${scaled.toFixed(decimals).replace(/\.?0+$/, '')} ${p.symbol}${unit}`;
      }
    }
    return `${value.toExponential(decimals)} ${unit}`;
  }
}

// Export for browser or Node environment
if (typeof window !== 'undefined') {
  window.RCSimulatorEngine = RCSimulatorEngine;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RCSimulatorEngine;
}
