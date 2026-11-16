/**
 * ============================================================================
 * EE VISUAL LAB - TEST SUITE: SCIENTIFIC VALIDATION LAYER
 * Run with: node test/scientific-validation.test.js
 * ============================================================================
 */

const RCSimulatorEngine = require('../js/rc-simulator.js');
const ScientificValidationLayer = require('../js/scientific-validation.js');

function runScientificValidationTests() {
  console.log('================================================================');
  console.log('  EE VISUAL LAB: SCIENTIFIC VALIDATION & CONVERGENCE TESTS');
  console.log('================================================================\n');

  const validator = new ScientificValidationLayer();

  // Test Case 1: Standard GATE Question parameters (R = 20k, C = 50u, Vs = 24V)
  const engineGate = new RCSimulatorEngine({
    R: 20000,
    C: 0.00005,
    Vs: 24,
    V0: 0,
    mode: 'charge'
  });

  console.log('--- Testing Standard GATE Parameters (R = 20kΩ, C = 50μF, Vs = 24V) ---');
  const reportGate = validator.validateSimulation(engineGate);

  let passed = 0;
  let failed = 0;

  reportGate.auditLog.forEach(item => {
    if (item.passed) {
      console.log(`  ✓ [PASS] ${item.name}`);
      console.log(`     ↳ ${item.details}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${item.name}`);
      console.error(`     ↳ ${item.details}`);
      failed++;
    }
  });

  console.log(`\n  Result: ${reportGate.status} (${reportGate.checksPassed}/${reportGate.totalChecks} Checks Passed)`);
  console.assert(reportGate.status === 'VERIFIED', 'GATE validation should be VERIFIED');

  // Test Case 2: Extreme parameter limits (Fast Debounce: R = 1k, C = 10nF, tau = 10us)
  console.log('\n--- Testing Fast Transients (R = 1kΩ, C = 10nF, tau = 10μs) ---');
  const engineFast = new RCSimulatorEngine({
    R: 1000,
    C: 0.00000001,
    Vs: 5,
    V0: 0,
    mode: 'charge'
  });
  const reportFast = validator.validateSimulation(engineFast);
  reportFast.auditLog.forEach(item => {
    if (item.passed) {
      console.log(`  ✓ [PASS] ${item.name}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${item.name}`);
      failed++;
    }
  });

  // Test Case 3: Discharging Mode
  console.log('\n--- Testing Discharging Transient Mode (V0 = 24V, Vs = 0V) ---');
  const engineDischarge = new RCSimulatorEngine({
    R: 10000,
    C: 0.0001,
    Vs: 0,
    V0: 24,
    mode: 'discharge'
  });
  const reportDischarge = validator.validateSimulation(engineDischarge);
  reportDischarge.auditLog.forEach(item => {
    if (item.passed) {
      console.log(`  ✓ [PASS] ${item.name}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${item.name}`);
      failed++;
    }
  });

  console.log('\n================================================================');
  console.log(`  TOTAL CHECKS: ${passed} Passed, ${failed} Failed`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runScientificValidationTests();
