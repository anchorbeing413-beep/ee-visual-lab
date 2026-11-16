/**
 * ============================================================================
 * EE VISUAL LAB - MAIN APPLICATION CONTROLLER
 * Coordinates UI tabs, simulation engine, oscilloscope and question workspace
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Simulator Engine with default 10kOhm, 100uF, 10V
  const simEngine = new RCSimulatorEngine({
    R: 10000,
    C: 0.0001,
    Vs: 10.0,
    V0: 0.0,
    mode: 'charge'
  });

  // 2. Initialize Oscilloscope
  const canvasEl = document.getElementById('oscilloscopeCanvas');
  const cursorOverlayEl = document.getElementById('scopeCursorOverlay');
  let oscilloscope = null;
  if (canvasEl && cursorOverlayEl) {
    oscilloscope = new ScientificOscilloscope(canvasEl, cursorOverlayEl);
  }

  // UI Elements
  const inputR = document.getElementById('paramR');
  const unitR = document.getElementById('unitR');
  const sliderR = document.getElementById('sliderR');

  const inputC = document.getElementById('paramC');
  const unitC = document.getElementById('unitC');
  const sliderC = document.getElementById('sliderC');

  const inputVs = document.getElementById('paramVs');
  const sliderVs = document.getElementById('sliderVs');

  const inputV0 = document.getElementById('paramV0');
  const sliderV0 = document.getElementById('sliderV0');

  const btnModeCharge = document.getElementById('btnModeCharge');
  const btnModeDischarge = document.getElementById('btnModeDischarge');
  const btnResetSim = document.getElementById('btnResetSim');

  // Telemetry Elements
  const teleTau = document.getElementById('teleTau');
  const teleRise = document.getElementById('teleRise');
  const teleI0 = document.getElementById('teleI0');
  const teleEnergy = document.getElementById('teleEnergy');
  const teleEq = document.getElementById('teleEq');

  // Circuit Schematic elements
  const circuitWirePath = document.getElementById('circuitCurrentPath');
  const capChargeRect = document.getElementById('capChargeLevel');
  const switchArm = document.getElementById('schematicSwitchArm');
  const nodeVsText = document.getElementById('schematicVsText');
  const nodeRText = document.getElementById('schematicRText');
  const nodeCText = document.getElementById('schematicCText');

  // Calculate actual R in Ohms from input + unit
  function getActualR() {
    const val = parseFloat(inputR.value) || 10;
    const factor = parseFloat(unitR.value) || 1000;
    return Math.max(1, val * factor);
  }

  // Calculate actual C in Farads from input + unit
  function getActualC() {
    const val = parseFloat(inputC.value) || 100;
    const factor = parseFloat(unitC.value) || 0.000001;
    return Math.max(1e-12, val * factor);
  }

  // Refresh Simulation State and Oscilloscope Display
  function updateSimulation() {
    simEngine.R = getActualR();
    simEngine.C = getActualC();
    simEngine.Vs = parseFloat(inputVs.value) || 10;
    simEngine.V0 = parseFloat(inputV0.value) || 0;

    // Generate waveform data
    const dataset = simEngine.generateWaveformData(350);

    // Update Oscilloscope
    if (oscilloscope) {
      oscilloscope.setEngineAndData(simEngine, dataset);
    }

    // Update Telemetry Panel
    if (teleTau) teleTau.textContent = RCSimulatorEngine.formatSI(simEngine.tau, 's');
    if (teleRise) teleRise.textContent = RCSimulatorEngine.formatSI(simEngine.riseTime, 's');
    
    const initialI = simEngine.mode === 'charge'
      ? (simEngine.Vs - simEngine.V0) / simEngine.R
      : -simEngine.V0 / simEngine.R;
    if (teleI0) teleI0.textContent = RCSimulatorEngine.formatSI(initialI, 'A');

    const maxE = 0.5 * simEngine.C * Math.pow(simEngine.mode === 'charge' ? simEngine.Vs : simEngine.V0, 2);
    if (teleEnergy) teleEnergy.textContent = RCSimulatorEngine.formatSI(maxE, 'J');

    // Update Live Analytical Equation string
    if (teleEq) {
      const tauStr = simEngine.tau >= 0.01 
        ? simEngine.tau.toFixed(3) + ' s' 
        : simEngine.tau.toExponential(2) + ' s';
      if (simEngine.mode === 'charge') {
        if (simEngine.V0 === 0) {
          teleEq.textContent = `v_c(t) = ${simEngine.Vs.toFixed(1)} · (1 - e^(-t / ${tauStr}))`;
        } else {
          teleEq.textContent = `v_c(t) = ${simEngine.Vs.toFixed(1)} + (${(simEngine.V0 - simEngine.Vs).toFixed(1)}) · e^(-t / ${tauStr})`;
        }
      } else {
        teleEq.textContent = `v_c(t) = ${simEngine.V0.toFixed(1)} · e^(-t / ${tauStr})`;
      }
    }

    // Update Schematic Text Labels
    if (nodeVsText) nodeVsText.textContent = `${simEngine.Vs}V DC`;
    if (nodeRText) nodeRText.textContent = RCSimulatorEngine.formatSI(simEngine.R, 'Ω');
    if (nodeCText) nodeCText.textContent = RCSimulatorEngine.formatSI(simEngine.C, 'F');

    // Update Schematic Visual State
    if (switchArm) {
      if (simEngine.mode === 'charge') {
        switchArm.setAttribute('y2', '50'); // Closed
      } else {
        switchArm.setAttribute('y2', '35'); // Diverted / discharge
      }
    }
  }

  // Synchronize inputs & sliders
  // Resistance
  if (inputR && sliderR && unitR) {
    inputR.addEventListener('input', () => {
      sliderR.value = inputR.value;
      updateSimulation();
    });
    sliderR.addEventListener('input', () => {
      inputR.value = sliderR.value;
      updateSimulation();
    });
    unitR.addEventListener('change', () => {
      updateSimulation();
    });
  }

  // Capacitance
  if (inputC && sliderC && unitC) {
    inputC.addEventListener('input', () => {
      sliderC.value = inputC.value;
      updateSimulation();
    });
    sliderC.addEventListener('input', () => {
      inputC.value = sliderC.value;
      updateSimulation();
    });
    unitC.addEventListener('change', () => {
      updateSimulation();
    });
  }

  // Voltage Vs
  if (inputVs && sliderVs) {
    inputVs.addEventListener('input', () => {
      sliderVs.value = inputVs.value;
      updateSimulation();
    });
    sliderVs.addEventListener('input', () => {
      inputVs.value = sliderVs.value;
      updateSimulation();
    });
  }

  // Initial Voltage V0
  if (inputV0 && sliderV0) {
    inputV0.addEventListener('input', () => {
      sliderV0.value = inputV0.value;
      updateSimulation();
    });
    sliderV0.addEventListener('input', () => {
      inputV0.value = sliderV0.value;
      updateSimulation();
    });
  }

  // Mode buttons
  if (btnModeCharge && btnModeDischarge) {
    btnModeCharge.addEventListener('click', () => {
      simEngine.mode = 'charge';
      btnModeCharge.classList.add('active');
      btnModeDischarge.classList.remove('active');
      if (circuitWirePath) circuitWirePath.classList.add('circuit-active-wire');
      updateSimulation();
    });

    btnModeDischarge.addEventListener('click', () => {
      simEngine.mode = 'discharge';
      // If V0 is 0, initialize it to previous Vs for meaningful discharge demo
      if (simEngine.V0 === 0) {
        inputV0.value = inputVs.value;
        sliderV0.value = inputVs.value;
      }
      btnModeDischarge.classList.add('active');
      btnModeCharge.classList.remove('active');
      if (circuitWirePath) circuitWirePath.classList.remove('circuit-active-wire');
      updateSimulation();
    });
  }

  // Reset Button
  if (btnResetSim) {
    btnResetSim.addEventListener('click', () => {
      inputR.value = 10;
      unitR.value = 1000;
      sliderR.value = 10;

      inputC.value = 100;
      unitC.value = 0.000001;
      sliderC.value = 100;

      inputVs.value = 10;
      sliderVs.value = 10;

      inputV0.value = 0;
      sliderV0.value = 0;

      simEngine.mode = 'charge';
      btnModeCharge.classList.add('active');
      btnModeDischarge.classList.remove('active');
      updateSimulation();
    });
  }

  // 3. Navigation / Tab Controller
  const navLinks = document.querySelectorAll('.nav-link[data-tab]');
  const tabViews = document.querySelectorAll('.tab-view');

  function switchTab(tabId) {
    navLinks.forEach(link => {
      if (link.dataset.tab === tabId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    tabViews.forEach(view => {
      if (view.id === `tab-${tabId}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // If switching to simulation, trigger canvas resize and render
    if (tabId === 'simulation' && oscilloscope) {
      setTimeout(() => {
        oscilloscope.resize();
        oscilloscope.render();
      }, 50);
    }

    // Scroll to top of content smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.tab);
    });
  });

  // Action button links with data-tab
  document.querySelectorAll('[data-switch-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(btn.dataset.switchTab);
    });
  });

  // 4. Render 17-Point Question Workspace
  renderQuestionWorkspace();

  function renderQuestionWorkspace() {
    const container = document.getElementById('questionStepsContainer');
    if (!container || !window.STANDARD_GATE_QUESTION) return;

    const q = window.STANDARD_GATE_QUESTION;
    container.innerHTML = '';

    q.sections.forEach((sec, idx) => {
      const card = document.createElement('div');
      card.className = 'step-card';
      card.id = `step-${sec.num}`;

      card.innerHTML = `
        <div class="step-header" data-toggle-step="${sec.num}">
          <div class="step-title-wrap">
            <span class="step-number">${sec.num}</span>
            <span class="step-title">${sec.title}</span>
          </div>
          <span style="color: var(--text-dim); font-size: 0.8rem;">▼</span>
        </div>
        <div class="step-content" id="content-${sec.num}">
          ${sec.content}
        </div>
      `;

      container.appendChild(card);
    });

    // Bind Question Workspace Button: "Load This Question into Simulator"
    setTimeout(() => {
      const btnLoadPreset = document.getElementById('btnLoadPreset');
      if (btnLoadPreset) {
        btnLoadPreset.addEventListener('click', () => {
          // Set R = 20k, C = 50u, Vs = 24V, V0 = 0V
          inputR.value = 20;
          unitR.value = 1000;
          sliderR.value = 20;

          inputC.value = 50;
          unitC.value = 0.000001;
          sliderC.value = 50;

          inputVs.value = 24;
          sliderVs.value = 24;

          inputV0.value = 0;
          sliderV0.value = 0;

          simEngine.mode = 'charge';
          if (btnModeCharge) btnModeCharge.classList.add('active');
          if (btnModeDischarge) btnModeDischarge.classList.remove('active');

          updateSimulation();
          switchTab('simulation');
        });
      }

      // Bind Reverse Engineering Challenge Button in Section 12
      const btnVerifyReverse = document.getElementById('btnVerifyReverse');
      const revInputR = document.getElementById('revInputR');
      const revFeedback = document.getElementById('revFeedback');

      if (btnVerifyReverse && revInputR && revFeedback) {
        btnVerifyReverse.addEventListener('click', () => {
          const userVal = parseFloat(revInputR.value);
          // Target: t = 1.386 s, v_fraction = 0.75, C = 50 uF
          // R = -1.386294 / (50e-6 * ln(1 - 0.75)) = -1.386294 / (50e-6 * (-1.386294)) = 1 / 50e-6 = 20,000 Ohms
          const exactR = 20000;
          const errorPercent = Math.abs((userVal - exactR) / exactR) * 100;

          revFeedback.style.display = 'block';
          if (errorPercent < 1.0) {
            revFeedback.style.background = 'rgba(16, 185, 129, 0.15)';
            revFeedback.style.border = '1px solid #10b981';
            revFeedback.style.color = '#a7f3d0';
            revFeedback.innerHTML = `✓ <strong>EXCELLENT! Exact Engineering Verification Passed!</strong><br>
            Calculated: R = 20,000 Ω (20 kΩ).<br>
            Physical check: τ = RC = 20kΩ · 50μF = 1.000 s.<br>
            At t = 1.386 s = ln(4) · τ, v_c = Vs(1 - e^-ln(4)) = Vs(1 - 0.25) = 0.75 Vs.`;
          } else {
            revFeedback.style.background = 'rgba(255, 0, 85, 0.15)';
            revFeedback.style.border = '1px solid #ff0055';
            revFeedback.style.color = '#fda4af';
            revFeedback.innerHTML = `✗ <strong>Verification Failed:</strong> Your entry of ${userVal} Ω has ${errorPercent.toFixed(1)}% deviation.<br>
            Hint: Use 1 - e^(-t/RC) = 0.75 ⟹ e^(-t/RC) = 0.25 ⟹ t/RC = ln(4) ≈ 1.3863. Hence RC = 1.0 s!`;
          }
        });
      }
    }, 100);
  }

  // 5. Render Research Library Cards
  renderResearchLibrary();

  function renderResearchLibrary() {
    const grid = document.getElementById('researchGrid');
    if (!grid || !window.ACADEMIC_RESEARCH_LIBRARY) return;

    grid.innerHTML = '';
    window.ACADEMIC_RESEARCH_LIBRARY.forEach(item => {
      const card = document.createElement('div');
      card.className = 'research-card';
      card.innerHTML = `
        <div>
          <div class="research-meta">
            <span class="research-source">${item.institution}</span>
            <span>•</span>
            <span>${item.year}</span>
          </div>
          <h3 class="research-title">${item.title}</h3>
          <p style="font-size: 0.8rem; color: var(--accent-voltage); font-family: var(--font-mono); margin-bottom: 0.5rem;">
            Author: ${item.authors} (${item.type})
          </p>
          <p class="research-abstract">${item.abstract}</p>
          <div class="research-tags">
            ${item.concepts.map(c => `<span class="card-tag">${c}</span>`).join('')}
          </div>
        </div>
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; margin-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-dim);">${item.courseId}</span>
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" style="font-size: 0.75rem;">
            Official Academic Link ↗
          </a>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // Initial simulation run
  updateSimulation();
});
