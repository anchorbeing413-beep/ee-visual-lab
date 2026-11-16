/**
 * ============================================================================
 * EE VISUAL LAB - 17-POINT STANDARD QUESTION WORKSPACE ENGINE
 * Topic: Series RC Circuit Step Response & Energy Conservation
 * Follows the rigorous IIT/NIT academic framework.
 * ============================================================================
 */

const STANDARD_GATE_QUESTION = {
  id: "GATE-EE-CKT-01",
  subject: "Electric Circuits",
  topic: "First-Order RC Transient Response",
  difficulty: "GATE Medium (2 Marks Core)",
  targetExam: "GATE EE / ESE",
  presetParams: {
    R: 20000,   // 20 kOhm
    C: 0.00005, // 50 uF
    Vs: 24,     // 24 V
    V0: 0       // 0 V
  },
  sections: [
    {
      num: "01",
      id: "sec-problem",
      title: "Problem Statement",
      content: `
        <div class="lab-card" style="border-left: 3px solid var(--accent-voltage); background: var(--bg-primary);">
          <p style="font-size: 1rem; color: #fff; line-height: 1.7;">
            In the series RC circuit shown below, the resistance is <span class="math-inline">R = 20\\text{ k}\\Omega</span> and the capacitance is <span class="math-inline">C = 50\\text{ }\\mu\\text{F}</span>. 
            The capacitor is uncharged prior to switching (<span class="math-inline">v_C(0^-) = 0\\text{ V}</span>). At <span class="math-inline">t = 0</span>, a constant DC source of <span class="math-inline">V_s = 24\\text{ V}</span> is connected.
          </p>
          <ul style="margin: 1rem 0 0.5rem 1.5rem; color: var(--text-muted); line-height: 1.8;">
            <li><strong>Part (a):</strong> Determine the capacitor voltage <span class="math-inline">v_C(t)</span> and current <span class="math-inline">i(t)</span> at <span class="math-inline">t = 1.5\\text{ s}</span>.</li>
            <li><strong>Part (b):</strong> Find the time <span class="math-inline">t^*</span> required for the capacitor voltage to reach <span class="math-inline">18\\text{ V}</span> (75% of steady-state voltage).</li>
            <li><strong>Part (c):</strong> Compute the total energy delivered by the DC source, energy stored in the electric field of the capacitor, and energy dissipated as heat in the resistor as <span class="math-inline">t \\to \\infty</span>.</li>
          </ul>
        </div>
      `
    },
    {
      num: "02",
      id: "sec-physical",
      title: "Understand the Physical Situation",
      content: `
        <p>Before <span class="math-inline">t = 0</span>, the capacitor plates have neutral net charge; the electric field inside the dielectric is zero. At <span class="math-inline">t = 0^+</span>, the switch closes:</p>
        <ul style="margin: 0.75rem 0 0.75rem 1.5rem; line-height: 1.8;">
          <li><strong>Displacement & Conduction Current:</strong> Electrons are drawn from the positive plate toward the battery terminal and pushed onto the negative plate. An equal displacement current density <span class="math-inline">J_D = \\varepsilon \\frac{\\partial E}{\\partial t}</span> develops within the dielectric.</li>
          <li><strong>Inability to Change Voltage Instantaneously:</strong> For voltage across a linear capacitor to jump discontinuously (<span class="math-inline">\\Delta v_C > 0</span> in <span class="math-inline">\\Delta t = 0</span>), it would require infinite current <span class="math-inline">i = C \\frac{dv}{dt} \\to \\infty</span>, requiring infinite source power. In any physical resistive network, <span class="math-inline">v_C(0^+) = v_C(0^-) = 0\\text{ V}</span>. The capacitor momentarily behaves as an ideal short circuit at <span class="math-inline">t = 0^+</span>.</li>
          <li><strong>Steady-State Equilibrium:</strong> As charge accumulates, the opposing electric field inside the capacitor increases until <span class="math-inline">v_C(\\infty) = V_s</span>, causing the net loop voltage drop across <span class="math-inline">R</span> to become zero. The current ceases (<span class="math-inline">i(\\infty) = 0</span>), and the capacitor acts as an open circuit.</li>
        </ul>
      `
    },
    {
      num: "03",
      id: "sec-concept",
      title: "Identify the Engineering Concept",
      content: `
        <div class="lab-alert alert-info">
          <div>
            <strong>Core Concept:</strong> First-order non-homogeneous linear ordinary differential equation (ODE) with constant coefficients, governing zero-state response of an energy-storage element in a linear time-invariant (LTI) network.
          </div>
        </div>
        <p>The time constant <span class="math-inline">\\tau = R_{Th} C</span> characterizes the natural relaxation rate of the state variable <span class="math-inline">v_C(t)</span>.</p>
      `
    },
    {
      num: "04",
      id: "sec-given",
      title: "List the Given Parameters",
      content: `
        <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.85rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-active); text-align: left; color: var(--text-muted);">
              <th style="padding: 6px;">Parameter</th>
              <th style="padding: 6px;">Symbol</th>
              <th style="padding: 6px;">Value</th>
              <th style="padding: 6px;">SI Base Units</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border-subtle);">
              <td style="padding: 6px;">Series Resistance</td>
              <td style="padding: 6px; color: var(--accent-voltage);">R</td>
              <td style="padding: 6px;">20 kΩ</td>
              <td style="padding: 6px;">20,000 Ω (V·A⁻¹)</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-subtle);">
              <td style="padding: 6px;">Capacitance</td>
              <td style="padding: 6px; color: var(--accent-voltage);">C</td>
              <td style="padding: 6px;">50 μF</td>
              <td style="padding: 6px;">50 × 10⁻⁶ F (A·s·V⁻¹)</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-subtle);">
              <td style="padding: 6px;">Source Voltage</td>
              <td style="padding: 6px; color: var(--accent-voltage);">V_s</td>
              <td style="padding: 6px;">24 V</td>
              <td style="padding: 6px;">24.0 V (J·C⁻¹)</td>
            </tr>
            <tr>
              <td style="padding: 6px;">Initial Capacitor Voltage</td>
              <td style="padding: 6px; color: var(--accent-voltage);">v_C(0⁻)</td>
              <td style="padding: 6px;">0 V</td>
              <td style="padding: 6px;">0.0 V</td>
            </tr>
          </tbody>
        </table>
      `
    },
    {
      num: "05",
      id: "sec-unknowns",
      title: "Identify the Unknown Variables",
      content: `
        <ul style="margin: 0.5rem 0 0.5rem 1.5rem; line-height: 1.8;">
          <li>Time Constant: <span class="math-inline">\\tau = R C</span> [s]</li>
          <li>Capacitor voltage at <span class="math-inline">t = 1.5\\text{ s}</span>: <span class="math-inline">v_C(1.5)</span> [V]</li>
          <li>Current at <span class="math-inline">t = 1.5\\text{ s}</span>: <span class="math-inline">i(1.5)</span> [A]</li>
          <li>Time required to reach 18 V: <span class="math-inline">t^*</span> [s]</li>
          <li>Energies at <span class="math-inline">t \\to \\infty</span>: <span class="math-inline">W_{source}, W_C, W_R</span> [Joules]</li>
        </ul>
      `
    },
    {
      num: "06",
      id: "sec-prereq",
      title: "Identify Required Prerequisites",
      content: `
        <ol style="margin: 0.5rem 0 0.5rem 1.5rem; line-height: 1.8;">
          <li><strong>Kirchhoff's Voltage Law (KVL):</strong> Algebraic sum of potential differences in any closed loop is identically zero: <span class="math-inline">\\sum V_k = 0</span>.</li>
          <li><strong>Capacitor V-I Constitutive Relation:</strong> <span class="math-inline">i(t) = C \\frac{dv_C}{dt}</span>.</li>
          <li><strong>First-order linear ODE solution</strong> via separation of variables or integrating factor.</li>
        </ol>
      `
    },
    {
      num: "07",
      id: "sec-formulation",
      title: "Mathematical Formulation",
      content: `
        <p>Applying KVL around the series loop for <span class="math-inline">t \\ge 0</span>:</p>
        <div class="math-block">
          V_s - v_R(t) - v_C(t) = 0 \\implies V_s - R \\cdot i(t) - v_C(t) = 0
        </div>
        <p>Substitute constitutive relation <span class="math-inline">i(t) = C \\frac{dv_C(t)}{dt}</span>:</p>
        <div class="math-block">
          R C \\frac{dv_C(t)}{dt} + v_C(t) = V_s
        </div>
        <p>Standard normalized canonical state-space form:</p>
        <div class="math-block">
          \\frac{dv_C(t)}{dt} + \\frac{1}{\\tau} v_C(t) = \\frac{V_s}{\\tau}, \\quad \\text{where } \\tau = R C
        </div>
      `
    },
    {
      num: "08",
      id: "sec-derivation",
      title: "Step-by-Step Derivation",
      content: `
        <p>Multiply both sides by integrating factor <span class="math-inline">\\mu(t) = e^{\\int (1/\\tau) dt} = e^{t/\\tau}</span>:</p>
        <div class="math-block">
          e^{t/\\tau} \\frac{dv_C}{dt} + \\frac{1}{\\tau} e^{t/\\tau} v_C = \\frac{V_s}{\\tau} e^{t/\\tau}
        </div>
        <p>Recognizing product rule on the left side:</p>
        <div class="math-block">
          \\frac{d}{dt} \\left[ v_C(t) e^{t/\\tau} \\right] = \\frac{V_s}{\\tau} e^{t/\\tau}
        </div>
        <p>Integrating both sides from <span class="math-inline">0</span> to <span class="math-inline">t</span>:</p>
        <div class="math-block">
          \\left[ v_C(u) e^{u/\\tau} \\right]_{0}^{t} = \\int_{0}^{t} \\frac{V_s}{\\tau} e^{u/\\tau} du = V_s \\left[ e^{t/\\tau} - 1 \\right]
        </div>
        <div class="math-block">
          v_C(t) e^{t/\\tau} - v_C(0) = V_s e^{t/\\tau} - V_s
        </div>
        <p>Multiplying by <span class="math-inline">e^{-t/\\tau}</span> yields the universal first-order step response:</p>
        <div class="math-block" style="border-left-color: #10b981; color: #a7f3d0;">
          v_C(t) = V_s + \\left( v_C(0) - V_s \\right) e^{-t/\\tau} = V_s \\left( 1 - e^{-t/\\tau} \\right) \\quad [\\text{for } v_C(0)=0]
        </div>
        <p>Differentiating to obtain current:</p>
        <div class="math-block" style="border-left-color: #ff0055; color: #fda4af;">
          i(t) = C \\frac{dv_C}{dt} = C \\cdot V_s \\left( \\frac{1}{\\tau} e^{-t/\\tau} \\right) = \\frac{V_s}{R} e^{-t/\\tau}
        </div>
      `
    },
    {
      num: "09",
      id: "sec-calculation",
      title: "Numerical Calculation",
      content: `
        <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.8;">
          <p><strong>1. Time Constant Calculation:</strong></p>
          <p>τ = R · C = (20 × 10³ Ω) × (50 × 10⁻⁶ F) = <strong>1.000 second</strong>.</p>
          <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 0.5rem 0;" />
          
          <p><strong>2. Values at t = 1.5 seconds:</strong></p>
          <p>t / τ = 1.5 / 1.0 = 1.5</p>
          <p>e^(-1.5) ≈ 0.22313016</p>
          <p>v_C(1.5) = 24 · (1 - 0.22313016) = 24 · 0.7768698 = <strong>18.645 V</strong></p>
          <p>i(1.5) = (24 / 20000) · e^(-1.5) = 1.2 mA · 0.22313 = <strong>0.2678 mA (267.8 μA)</strong></p>
          <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 0.5rem 0;" />

          <p><strong>3. Time required to reach 18 V:</strong></p>
          <p>18 = 24 · (1 - e^(-t*/τ))  ⟹  1 - e^(-t*) = 18/24 = 0.75</p>
          <p>e^(-t*) = 0.25  ⟹  -t* = ln(0.25) = -ln(4)</p>
          <p>t* = ln(4) · τ = 2 · ln(2) · (1.0 s) ≈ 2 · 0.693147 = <strong>1.3863 seconds</strong></p>
          <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 0.5rem 0;" />

          <p><strong>4. Energy Calculations as t → ∞:</strong></p>
          <p>Total Energy stored in Capacitor: W_C = ½ C V_s² = 0.5 × (50 × 10⁻⁶) × 24² = <strong>14.40 mJ</strong></p>
          <p>Total Energy supplied by Source: W_s = ∫₀^∞ V_s · i(t) dt = V_s · Q = V_s · (C V_s) = C V_s² = <strong>28.80 mJ</strong></p>
          <p>Energy dissipated in Resistor R: W_R = W_s - W_C = 28.80 - 14.40 = <strong>14.40 mJ (Exactly 50%)</strong></p>
        </div>
      `
    },
    {
      num: "10",
      id: "sec-visual",
      title: "Interactive Visualisation",
      content: `
        <p>The time constant <span class="math-inline">\\tau = 1.0\\text{ s}</span> is the characteristic signature of this network. Notice the key percentage thresholds:</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; margin-top: 0.75rem;">
          <div style="background: var(--bg-tertiary); padding: 0.5rem; border-radius: var(--radius-sm); text-align: center;">
            <div style="color: var(--text-dim); font-size: 0.7rem;">AT t = 1τ (1.0s)</div>
            <div style="color: var(--accent-voltage); font-weight: 700;">63.2% (15.17 V)</div>
          </div>
          <div style="background: var(--bg-tertiary); padding: 0.5rem; border-radius: var(--radius-sm); text-align: center;">
            <div style="color: var(--text-dim); font-size: 0.7rem;">AT t = 2τ (2.0s)</div>
            <div style="color: var(--accent-voltage); font-weight: 700;">86.5% (20.75 V)</div>
          </div>
          <div style="background: var(--bg-tertiary); padding: 0.5rem; border-radius: var(--radius-sm); text-align: center;">
            <div style="color: var(--text-dim); font-size: 0.7rem;">AT t = 3τ (3.0s)</div>
            <div style="color: var(--accent-voltage); font-weight: 700;">95.0% (22.80 V)</div>
          </div>
          <div style="background: var(--bg-tertiary); padding: 0.5rem; border-radius: var(--radius-sm); text-align: center;">
            <div style="color: var(--text-dim); font-size: 0.7rem;">AT t = 5τ (5.0s)</div>
            <div style="color: var(--accent-power); font-weight: 700;">99.3% (23.84 V)</div>
          </div>
        </div>
      `
    },
    {
      num: "11",
      id: "sec-sim-link",
      title: "Engineering Simulation",
      content: `
        <p>Launch these exact parameters directly into the interactive oscilloscope simulator with one click:</p>
        <div style="margin-top: 1rem;">
          <button id="btnLoadPreset" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Load This Question into Simulator (R = 20kΩ, C = 50μF, Vs = 24V)
          </button>
        </div>
      `
    },
    {
      num: "12",
      id: "sec-reverse",
      title: "Reverse Engineering Challenge",
      content: `
        <div class="reverse-lab-box">
          <div class="reverse-header">
            <div class="reverse-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div>
              <h4 style="color: var(--accent-time);">Diagnostic Inverse Problem</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Work backwards like a senior design engineer.</p>
            </div>
          </div>
          <p style="font-size: 0.875rem;">
            An oscilloscope measurement of an unlabelled RC timing circuit shows that the voltage across the capacitor rises from 0 V to <strong>75% of supply voltage in exactly 1.386 seconds</strong>.
            If the capacitor value is measured on an LCR meter as <span class="math-inline">C = 50\\text{ }\\mu\\text{F}</span>, calculate the unknown resistance <span class="math-inline">R</span>:
          </p>
          <div class="reverse-interactive">
            <input type="number" id="revInputR" class="reverse-input" placeholder="e.g. 20000" />
            <span style="font-family: var(--font-mono); color: var(--text-muted);">Ohms (Ω)</span>
            <button id="btnVerifyReverse" class="btn btn-secondary btn-sm">Verify Resistance</button>
          </div>
          <div id="revFeedback" class="reverse-feedback"></div>
        </div>
      `
    },
    {
      num: "13",
      id: "sec-practical",
      title: "Practical Industrial Application",
      content: `
        <ul style="margin: 0.5rem 0 0.5rem 1.5rem; line-height: 1.8;">
          <li><strong>Switch Debounce Filters:</strong> Mechanical push-buttons bounce for 5–20 ms, generating false triggers in digital microcontrollers. An RC low-pass filter with <span class="math-inline">\\tau \\approx 10\\text{ ms}</span> smooths out high-frequency contact chatter.</li>
          <li><strong>Microcontroller Power-On Reset (POR):</strong> An RC network holds the active-low RESET pin at logic 0 until the main power rail stabilizes to guaranteed operating voltage.</li>
          <li><strong>RC Snubbers in Power Electronics:</strong> Connected in parallel with IGBTs and Thyristors to limit <span class="math-inline">dv/dt</span> voltage spikes during abrupt switching turn-off.</li>
        </ul>
      `
    },
    {
      num: "14",
      id: "sec-mistakes",
      title: "Common Mistakes (GATE Traps)",
      content: `
        <div class="lab-alert alert-warning">
          <div>
            <strong>1. Assuming 100% capacitor charge is reached at t = τ:</strong><br>
            At <span class="math-inline">t = \\tau</span>, the capacitor reaches only <strong>63.2%</strong> of the step input, NOT 100%. Settling to within 2% requires <span class="math-inline">4\\tau</span>, and 1% requires <span class="math-inline">5\\tau</span>.
          </div>
        </div>
        <div class="lab-alert alert-warning">
          <div>
            <strong>2. Thinking Resistor Energy Loss Depends on Resistance Value R:</strong><br>
            Total heat energy dissipated during full charging is <span class="math-inline">W_R = \\frac{1}{2} C V_s^2</span>, which is <em>completely independent</em> of <span class="math-inline">R</span>! Making <span class="math-inline">R</span> smaller causes higher peak current for shorter time; making <span class="math-inline">R</span> larger causes smaller current for longer time. The integral <span class="math-inline">\\int_0^\\infty i^2 R dt</span> always evaluates to exactly <span class="math-inline">\\frac{1}{2} C V_s^2</span>.
          </div>
        </div>
      `
    },
    {
      num: "15",
      id: "sec-alternative",
      title: "Alternative Solution Approach (s-Domain / Laplace)",
      content: `
        <p>In the Laplace s-domain, the DC step source is <span class="math-inline">V_s(s) = \\frac{V_s}{s}</span> and the uncharged capacitor has impedance <span class="math-inline">Z_C(s) = \\frac{1}{sC}</span>.</p>
        <p>Using the voltage divider rule directly in the s-domain:</p>
        <div class="math-block">
          V_C(s) = V_s(s) \\cdot \\frac{Z_C}{R + Z_C} = \\frac{V_s}{s} \\cdot \\frac{1/(sC)}{R + 1/(sC)} = \\frac{V_s}{s(sRC + 1)} = \\frac{V_s / (RC)}{s(s + 1/(RC))}
        </div>
        <p>Expanding into partial fractions:</p>
        <div class="math-block">
          V_C(s) = V_s \\left[ \\frac{1}{s} - \\frac{1}{s + 1/\\tau} \\right]
        </div>
        <p>Taking the inverse Laplace transform <span class="math-inline">\\mathcal{L}^{-1}\\{V_C(s)\\}</span>:</p>
        <div class="math-block" style="border-left-color: var(--accent-voltage);">
          v_C(t) = V_s \\left( 1 - e^{-t/\\tau} \\right) u(t)
        </div>
        <p>This confirms the identical analytical time-domain result without solving ODEs directly!</p>
      `
    },
    {
      num: "16",
      id: "sec-practice",
      title: "Three New Practice Problems",
      content: `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid #10b981;">
            <div style="font-weight: 700; color: #a7f3d0; font-size: 0.85rem; margin-bottom: 0.35rem;">PRACTICE PROBLEM 1 (GATE Standard - Moderate)</div>
            <p style="font-size: 0.85rem;">A 100 μF capacitor is initially pre-charged to 10 V. At t = 0, it is connected to a 30 V DC source through a 5 kΩ resistor. Find the capacitor voltage at t = 0.5 s.</p>
            <div style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">[Answer: τ = 0.5 s, v_C(0.5) = 30 + (10 - 30)e⁻¹ = 30 - 20(0.3679) = 22.64 V]</div>
          </div>
          <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid #f59e0b;">
            <div style="font-weight: 700; color: #fde68a; font-size: 0.85rem; margin-bottom: 0.35rem;">PRACTICE PROBLEM 2 (GATE Advanced - Multi-Switch)</div>
            <p style="font-size: 0.85rem;">In an RC charging circuit, the switch is closed at t = 0 and opened again at t = 2τ. Express the peak energy stored in the capacitor as a fraction of the maximum theoretical energy (½CVs²).</p>
            <div style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">[Answer: v_C(2τ) = Vs(1 - e⁻²) ≈ 0.8647 Vs; Energy fraction = (0.8647)² ≈ 0.7476 or 74.8%]</div>
          </div>
          <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid #ff0055;">
            <div style="font-weight: 700; color: #fda4af; font-size: 0.85rem; margin-bottom: 0.35rem;">PRACTICE PROBLEM 3 (Industrial Research Level - Real Capacitor)</div>
            <p style="font-size: 0.85rem;">A real electrolytic capacitor has an internal parallel leakage resistance of R_leak = 2 MΩ in parallel with C = 100 μF. If charged from a 50 V source via R_series = 10 kΩ, determine the steady-state final capacitor voltage v_C(∞).</p>
            <div style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">[Answer: By voltage divider, v_C(∞) = 50 · (2M / (2M + 10k)) = 50 · (2000 / 2010) = 49.75 V]</div>
          </div>
        </div>
      `
    },
    {
      num: "17",
      id: "sec-references",
      title: "Research References",
      content: `
        <ul style="margin: 0.5rem 0 0.5rem 1.5rem; line-height: 1.8; font-size: 0.85rem;">
          <li>Prof. Nagendra Krishnapura, <em>"Basic Electrical Circuits"</em>, Module 5: First-Order Circuit Transients, NPTEL Course 108106075, IIT Madras.</li>
          <li>Prof. Tapas Kumar Bhattacharya, <em>"Network Analysis"</em>, Lecture 18: Transient Response of Linear Systems, NPTEL Course 108105159, IIT Kharagpur.</li>
          <li>Prof. Anant Agarwal and Jeffrey Lang, <em>"Foundations of Analog and Digital Electronic Circuits"</em>, Chapter 10: Energy Storage Elements and First-Order RC Circuits, Morgan Kaufmann / MIT OpenCourseWare.</li>
          <li>GATE Official Electrical Engineering Syllabus: Section 2 (Electric Circuits), Network Equations & First-Order Transients.</li>
        </ul>
      `
    }
  ]
};

// Export for browser or Node environment
if (typeof window !== 'undefined') {
  window.STANDARD_GATE_QUESTION = STANDARD_GATE_QUESTION;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = STANDARD_GATE_QUESTION;
}
