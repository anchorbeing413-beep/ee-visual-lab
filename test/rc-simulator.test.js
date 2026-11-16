/**
 * ============================================================================
 * EE VISUAL LAB - VERIFICATION TEST SUITE: RC TRANSIENT ENGINE
 * Run with: node test/rc-simulator.test.js
 * ============================================================================
 */

const RCSimulatorEngine = require('../js/rc-simulator.js');

function runTests() {
  console.log('========================================================');
  console.log('  EE VISUAL LAB: MATHEMATICAL ACCURACY VERIFICATION');
  console.log('========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName} - ${details}`);
      failed++;
    }
  }

  // TEST 1: Time Constant Calculation
  {
    const R = 20000; // 20 kOhm
    const C = 0.00005; // 50 uF
    const sim = new RCSimulatorEngine({ R, C, Vs: 24, V0: 0, mode: 'charge' });
    assert(Math.abs(sim.tau - 1.0) < 1e-12, 'Time Constant tau = R * C (1.000 s)');
  }

  // TEST 2: Voltage at t = 0 (Continuity v_c(0+) = v_c(0-))
  {
    const sim = new RCSimulatorEngine({ R: 10000, C: 0.0001, Vs: 12, V0: 0, mode: 'charge' });
    assert(Math.abs(sim.voltageAt(0) - 0) < 1e-12, 'Capacitor Voltage continuity at t = 0+ (0 V)');
  }

  // TEST 3: Voltage at t = 1 tau (Exact 63.212% of Vs)
  {
    const Vs = 24.0;
    const sim = new RCSimulatorEngine({ R: 20000, C: 0.00005, Vs, V0: 0, mode: 'charge' });
    const expected = Vs * (1 - Math.exp(-1));
    const actual = sim.voltageAt(sim.tau);
    assert(Math.abs(actual - expected) < 1e-9, `Voltage at t = 1 tau equals ${expected.toFixed(4)} V (63.21%)`);
  }

  // TEST 4: Settling Voltage at t = 5 tau (99.326% of Vs)
  {
    const Vs = 24.0;
    const sim = new RCSimulatorEngine({ R: 20000, C: 0.00005, Vs, V0: 0, mode: 'charge' });
    const expected = Vs * (1 - Math.exp(-5));
    const actual = sim.voltageAt(5 * sim.tau);
    assert(Math.abs(actual - expected) < 1e-9, `Voltage at t = 5 tau equals ${expected.toFixed(4)} V (99.33% settled)`);
  }

  // TEST 5: Initial Charging Current i(0+) = Vs / R
  {
    const R = 20000;
    const Vs = 24;
    const sim = new RCSimulatorEngine({ R, C: 0.00005, Vs, V0: 0, mode: 'charge' });
    const expectedI0 = Vs / R; // 1.2 mA
    assert(Math.abs(sim.currentAt(0) - expectedI0) < 1e-12, 'Initial loop current i(0+) = 1.2 mA');
  }

  // TEST 6: Discharging Voltage Exponential Decay
  {
    const V0 = 24.0;
    const sim = new RCSimulatorEngine({ R: 10000, C: 0.0001, Vs: 0, V0, mode: 'discharge' });
    const expectedV_tau = V0 * Math.exp(-1); // 24 * 0.367879 = 8.829 V
    assert(Math.abs(sim.voltageAt(sim.tau) - expectedV_tau) < 1e-9, 'Discharging voltage at t = tau decays to 36.79%');
  }

  // TEST 7: Rise Time Analytical Equation (10% to 90%)
  {
    const sim = new RCSimulatorEngine({ R: 20000, C: 0.00005, Vs: 24, V0: 0, mode: 'charge' });
    // t_90 = tau * ln(10), t_10 = tau * ln(10/9) => delta = tau * ln(9) = 2.197224577
    const expectedRise = sim.tau * Math.log(9);
    assert(Math.abs(sim.riseTime - expectedRise) < 1e-9, 'Analytical Rise Time t_r = tau * ln(9) = 2.197 s');
  }

  // TEST 8: Energy Stored in Capacitor at Full Charge
  {
    const C = 50e-6;
    const Vs = 24;
    const sim = new RCSimulatorEngine({ R: 20000, C, Vs, V0: 0, mode: 'charge' });
    const expectedEnergy = 0.5 * C * Vs * Vs; // 14.4 mJ
    assert(Math.abs(sim.maxEnergy - expectedEnergy) < 1e-12, 'Max Energy Stored = 0.5 * C * Vs^2 (14.40 mJ)');
  }

  // TEST 9: Reverse Engineering Inverse Problem Solver
  {
    // If t = 1.386294 s to reach 75% for C = 50 uF, R must be 20,000 Ohm
    const t_target = 1.3862943611;
    const v_fraction = 0.75;
    const C = 50e-6;
    const solvedR = RCSimulatorEngine.solveResistanceForTarget(t_target, v_fraction, C);
    assert(Math.abs(solvedR - 20000) < 0.01, 'Reverse Engineering calculation solves R = 20,000 Ω for 75% rise');
  }

  console.log('\n--------------------------------------------------------');
  console.log(`  RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
