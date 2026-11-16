/**
 * ============================================================================
 * EE VISUAL LAB - MAIN APPLICATION CONTROLLER
 * Coordinates UI, Simulation Engine, MathJax, Math.js, Plotly.js, Mermaid,
 * and the Independent Scientific Validation Layer
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Simulator Engine & Validation Layer
  const simEngine = new RCSimulatorEngine({
    R: 10000,
    C: 0.0001,
    Vs: 10.0,
    V0: 0.0,
    mode: 'charge'
  });

  const validator = new ScientificValidationLayer();

  // 2. Initialize Oscilloscope Canvas
  const canvasEl = document.getElementById('oscilloscopeCanvas');
  const cursorOverlayEl = document.getElementById('scopeCursorOverlay');
  let oscilloscope = null;
  if (canvasEl && cursorOverlayEl) {
    oscilloscope = new ScientificOscilloscope(canvasEl, cursorOverlayEl);
  }

  // Active display mode for oscilloscope: 'canvas' | 'plotly'
  let currentScopeMode = 'canvas';

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

  // Scope Mode Buttons
  const btnModeCanvas = document.getElementById('btnScopeCanvas');
  const btnModePlotly = document.getElementById('btnScopePlotly');
  const canvasWrapper = document.getElementById('canvasScopeWrapper');
  const plotlyWrapper = document.getElementById('plotlyScopeContainer');

  // Telemetry Elements
  const teleTau = document.getElementById('teleTau');
  const teleRise = document.getElementById('teleRise');
  const teleI0 = document.getElementById('teleI0');
  const teleEnergy = document.getElementById('teleEnergy');
  const teleEq = document.getElementById('teleEq');

  // Validation report container
  const valAuditSummary = document.getElementById('valAuditSummary');

  // Circuit Schematic elements
  const circuitWirePath = document.getElementById('circuitCurrentPath');
  const switchArm = document.getElementById('schematicSwitchArm');
  const nodeVsText = document.getElementById('schematicVsText');
  const nodeRText = document.getElementById('schematicRText');
  const nodeCText = document.getElementById('schematicCText');

  // Calculate actual R in Ohms
  function getActualR() {
    const val = parseFloat(inputR.value) || 10;
    const factor = parseFloat(unitR.value) || 1000;
    return Math.max(1, val * factor);
  }

  // Calculate actual C in Farads
  function getActualC() {
    const val = parseFloat(inputC.value) || 100;
    const factor = parseFloat(unitC.value) || 0.000001;
    return Math.max(1e-12, val * factor);
  }

  // Update Plotly Scientific Graph
  function renderPlotlyGraph(dataset) {
    if (typeof Plotly === 'undefined' || !plotlyWrapper) return;

    const tArray = Array.from(dataset.time);
    const vArray = Array.from(dataset.voltage);
    const iArray = Array.from(dataset.current).map(val => val * 1000); // in mA

    const traceV = {
      x: tArray,
      y: vArray,
      name: 'v_C(t) Voltage',
      type: 'scatter',
      mode: 'lines',
      line: { color: '#38bdf8', width: 2.5 }
    };

    const traceI = {
      x: tArray,
      y: iArray,
      name: 'i(t) Current',
      yaxis: 'y2',
      type: 'scatter',
      mode: 'lines',
      line: { color: '#f43f5e', width: 2, dash: 'dot' }
    };

    const shapes = [];
    dataset.tauMarkers.forEach(m => {
      shapes.push({
        type: 'line',
        x0: m.t,
        x1: m.t,
        y0: 0,
        y1: 1,
        yref: 'paper',
        line: { color: 'rgba(245, 158, 11, 0.45)', width: 1, dash: 'dash' }
      });
    });

    const layout = {
      margin: { l: 55, r: 55, t: 30, b: 40 },
      paper_bgcolor: '#020408',
      plot_bgcolor: '#020408',
      font: { family: 'JetBrains Mono, monospace', color: '#94a3b8', size: 10 },
      xaxis: {
        title: 'Time t (s)',
        gridcolor: '#1e293b',
        zerolinecolor: '#334155'
      },
      yaxis: {
        title: 'Capacitor Voltage v_C (V)',
        titlefont: { color: '#38bdf8' },
        tickfont: { color: '#38bdf8' },
        gridcolor: '#1e293b',
        zerolinecolor: '#334155'
      },
      yaxis2: {
        title: 'Current i (mA)',
        titlefont: { color: '#f43f5e' },
        tickfont: { color: '#f43f5e' },
        overlaying: 'y',
        side: 'right',
        zerolinecolor: '#334155'
      },
      legend: { orientation: 'h', x: 0.1, y: 1.12 },
      shapes: shapes,
      hovermode: 'x unified'
    };

    const config = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d']
    };

    Plotly.react(plotlyWrapper, [traceV, traceI], layout, config);
  }

  // Refresh Simulation State, Validation, and Displays
  function updateSimulation() {
    simEngine.R = getActualR();
    simEngine.C = getActualC();
    simEngine.Vs = parseFloat(inputVs.value) || 10;
    simEngine.V0 = parseFloat(inputV0.value) || 0;

    // Run Independent Scientific Validation
    const valResult = validator.validateSimulation(simEngine);
    if (valAuditSummary) {
      valAuditSummary.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span class="val-status-badge val-status-verified">✓ ${valResult.status}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${valResult.checksPassed}/${valResult.totalChecks} Checks Passed</span>
          </div>
          <span style="font-size: 0.7rem; color: var(--text-dim); font-family: var(--font-mono);">Checked: ODE Continuity, Dimensional [R][C]=[s], Energy 50/50, Convergence</span>
        </div>
      `;
    }

    // Generate waveform data
    const dataset = simEngine.generateWaveformData(350);

    // Update Oscilloscope Display
    if (currentScopeMode === 'canvas' && oscilloscope) {
      oscilloscope.setEngineAndData(simEngine, dataset);
    } else if (currentScopeMode === 'plotly') {
      renderPlotlyGraph(dataset);
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

    // Update Analytical Equation
    if (teleEq) {
      const tauStr = simEngine.tau >= 0.01 
        ? simEngine.tau.toFixed(3) + '\\text{ s}' 
        : simEngine.tau.toExponential(2) + '\\text{ s}';
      if (simEngine.mode === 'charge') {
        if (simEngine.V0 === 0) {
          teleEq.innerHTML = `\\(v_C(t) = ${simEngine.Vs.toFixed(1)} \\left(1 - e^{-t / ${tauStr}}\\right)\\)`;
        } else {
          teleEq.innerHTML = `\\(v_C(t) = ${simEngine.Vs.toFixed(1)} + (${(simEngine.V0 - simEngine.Vs).toFixed(1)}) e^{-t / ${tauStr}}\\)`;
        }
      } else {
        teleEq.innerHTML = `\\(v_C(t) = ${simEngine.V0.toFixed(1)} e^{-t / ${tauStr}}\\)`;
      }

      // Re-render LaTeX in equation box if MathJax loaded
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([teleEq]).catch(() => {});
      }
    }

    // Update Schematic Text Labels
    if (nodeVsText) nodeVsText.textContent = `${simEngine.Vs}V DC`;
    if (nodeRText) nodeRText.textContent = RCSimulatorEngine.formatSI(simEngine.R, 'Ω');
    if (nodeCText) nodeCText.textContent = RCSimulatorEngine.formatSI(simEngine.C, 'F');

    // Update Schematic Visual State
    if (switchArm) {
      if (simEngine.mode === 'charge') {
        switchArm.setAttribute('y2', '50');
      } else {
        switchArm.setAttribute('y2', '35');
      }
    }
  }

  // Synchronize inputs & sliders
  if (inputR && sliderR && unitR) {
    inputR.addEventListener('input', () => { sliderR.value = inputR.value; updateSimulation(); });
    sliderR.addEventListener('input', () => { inputR.value = sliderR.value; updateSimulation(); });
    unitR.addEventListener('change', () => { updateSimulation(); });
  }

  if (inputC && sliderC && unitC) {
    inputC.addEventListener('input', () => { sliderC.value = inputC.value; updateSimulation(); });
    sliderC.addEventListener('input', () => { inputC.value = sliderC.value; updateSimulation(); });
    unitC.addEventListener('change', () => { updateSimulation(); });
  }

  if (inputVs && sliderVs) {
    inputVs.addEventListener('input', () => { sliderVs.value = inputVs.value; updateSimulation(); });
    sliderVs.addEventListener('input', () => { inputVs.value = sliderVs.value; updateSimulation(); });
  }

  if (inputV0 && sliderV0) {
    inputV0.addEventListener('input', () => { sliderV0.value = inputV0.value; updateSimulation(); });
    sliderV0.addEventListener('input', () => { inputV0.value = sliderV0.value; updateSimulation(); });
  }

  // Mode Buttons
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

  // Scope Display Mode Switcher (Canvas vs. Plotly)
  if (btnModeCanvas && btnModePlotly && canvasWrapper && plotlyWrapper) {
    btnModeCanvas.addEventListener('click', () => {
      currentScopeMode = 'canvas';
      btnModeCanvas.classList.add('active');
      btnModePlotly.classList.remove('active');
      canvasWrapper.style.display = 'block';
      plotlyWrapper.style.display = 'none';
      if (oscilloscope) {
        oscilloscope.resize();
        oscilloscope.render();
      }
    });

    btnModePlotly.addEventListener('click', () => {
      currentScopeMode = 'plotly';
      btnModePlotly.classList.add('active');
      btnModeCanvas.classList.remove('active');
      canvasWrapper.style.display = 'none';
      plotlyWrapper.style.display = 'block';
      const dataset = simEngine.generateWaveformData(350);
      renderPlotlyGraph(dataset);
    });
  }

  // Reset Button
  if (btnResetSim) {
    btnResetSim.addEventListener('click', () => {
      inputR.value = 10; unitR.value = 1000; sliderR.value = 10;
      inputC.value = 100; unitC.value = 0.000001; sliderC.value = 100;
      inputVs.value = 10; sliderVs.value = 10;
      inputV0.value = 0; sliderV0.value = 0;
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
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.tab === tabId));
    tabViews.forEach(view => view.classList.toggle('active', view.id === `tab-${tabId}`));

    if (tabId === 'simulation') {
      setTimeout(() => {
        if (currentScopeMode === 'canvas' && oscilloscope) {
          oscilloscope.resize();
          oscilloscope.render();
        } else if (currentScopeMode === 'plotly') {
          const dataset = simEngine.generateWaveformData(350);
          renderPlotlyGraph(dataset);
        }
      }, 50);
    }

    if (tabId === 'workspace') {
      // Re-trigger MathJax rendering if needed
      if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([document.getElementById('questionStepsContainer')]).catch(() => {});
      }
      // Re-trigger Mermaid rendering if needed
      if (window.mermaid) {
        try { mermaid.run(); } catch (e) {}
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.tab);
    });
  });

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

    q.sections.forEach((sec) => {
      const card = document.createElement('div');
      card.className = 'step-card';
      card.id = `step-${sec.num}`;

      card.innerHTML = `
        <div class="step-header">
          <div class="step-title-wrap">
            <span class="step-number">${sec.num}</span>
            <span class="step-title">${sec.title}</span>
          </div>
          <span style="color: var(--text-dim); font-size: 0.75rem; font-family: var(--font-mono);">SECTION ${sec.num}</span>
        </div>
        <div class="step-content" id="content-${sec.num}">
          ${sec.content}
        </div>
      `;

      container.appendChild(card);
    });

    // Typeset LaTeX with MathJax
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise([container]).catch(() => {});
    }

    // Render Mermaid diagrams
    if (window.mermaid) {
      try { mermaid.run(); } catch (e) {}
    }

    // Bind Workspace Action Buttons
    setTimeout(() => {
      const btnLoadPreset = document.getElementById('btnLoadPreset');
      if (btnLoadPreset) {
        btnLoadPreset.addEventListener('click', () => {
          inputR.value = 20; unitR.value = 1000; sliderR.value = 20;
          inputC.value = 50; unitC.value = 0.000001; sliderC.value = 50;
          inputVs.value = 24; sliderVs.value = 24;
          inputV0.value = 0; sliderV0.value = 0;
          simEngine.mode = 'charge';
          if (btnModeCharge) btnModeCharge.classList.add('active');
          if (btnModeDischarge) btnModeDischarge.classList.remove('active');

          updateSimulation();
          switchTab('simulation');
        });
      }

      // Reverse Engineering Verification
      const btnVerifyReverse = document.getElementById('btnVerifyReverse');
      const revInputR = document.getElementById('revInputR');
      const revFeedback = document.getElementById('revFeedback');

      if (btnVerifyReverse && revInputR && revFeedback) {
        btnVerifyReverse.addEventListener('click', () => {
          const userVal = parseFloat(revInputR.value);
          const exactR = 20000;
          const errorPercent = Math.abs((userVal - exactR) / exactR) * 100;

          revFeedback.style.display = 'block';
          if (errorPercent < 1.0) {
            revFeedback.style.background = 'rgba(16, 185, 129, 0.12)';
            revFeedback.style.border = '1px solid #10b981';
            revFeedback.style.color = '#a7f3d0';
            revFeedback.innerHTML = `✓ <strong>Exact Engineering Verification Passed!</strong><br>
            R = 20,000 Ω (20 kΩ).<br>
            Physical check: τ = RC = 20kΩ · 50μF = 1.000 s.<br>
            At t = 1.386 s = ln(4) · τ, v_C(t) = Vs(1 - e^-ln(4)) = Vs(1 - 0.25) = 0.75 Vs.`;
          } else {
            revFeedback.style.background = 'rgba(244, 63, 94, 0.12)';
            revFeedback.style.border = '1px solid #f43f5e';
            revFeedback.style.color = '#fda4af';
            revFeedback.innerHTML = `✗ <strong>Verification Failed:</strong> Your entry of ${userVal} Ω has ${errorPercent.toFixed(1)}% deviation.<br>
            Hint: Use 1 - e^(-t/RC) = 0.75 ⟹ e^(-t/RC) = 0.25 ⟹ t/RC = ln(4) ≈ 1.3863 s. Hence RC = 1.000 s.`;
          }
        });
      }
    }, 150);
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
          <p style="font-size: 0.8rem; color: var(--color-voltage); font-family: var(--font-mono); margin-bottom: 0.5rem;">
            Author: ${item.authors} (${item.type})
          </p>
          <p class="research-abstract">${item.abstract}</p>
          <div class="research-tags">
            ${item.concepts.map(c => `<span class="card-tag">${c}</span>`).join('')}
          </div>
        </div>
        <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; margin-top: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.725rem; font-family: var(--font-mono); color: var(--text-dim);">${item.courseId}</span>
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
