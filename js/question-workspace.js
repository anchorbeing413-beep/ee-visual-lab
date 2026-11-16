/**
 * ============================================================================
 * EE VISUAL LAB - 17-POINT STANDARD QUESTION WORKSPACE ENGINE
 * Topic: Series RC Circuit Step Response & Energy Conservation
 * Formatted with standard LaTeX for MathJax rendering and Mermaid diagrams
 * ============================================================================
 */

const STANDARD_GATE_QUESTION = {
  id: "GATE-EE-CKT-01",
  subject: "Electric Circuits",
  topic: "First-Order RC Transient Response",
  difficulty: "GATE Core (2 Marks)",
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
        <div class="lab-card" style="border-left: 3px solid #0284c7; background: #060a14;">
          <p style="font-size: 0.95rem; color: #fff; line-height: 1.7;">
            In the series RC circuit shown, the series resistance is \\(R = 20\\text{ k}\\Omega\\) and the capacitance is \\(C = 50\\text{ }\\mu\\text{F}\\). 
            The capacitor is completely uncharged prior to switching (\\(v_C(0^-) = 0\\text{ V}\\)). At \\(t = 0\\), a constant DC voltage source of \\(V_s = 24\\text{ V}\\) is connected across the network.
          </p>
          <ul style="margin: 0.85rem 0 0.5rem 1.5rem; color: var(--text-secondary); line-height: 1.8;">
            <li><strong>Part (a):</strong> Determine the exact capacitor voltage \\(v_C(t)\\) and loop current \\(i(t)\\) at time \\(t = 1.5\\text{ s}\\).</li>
            <li><strong>Part (b):</strong> Calculate the precise instant \\(t^*\\) at which the capacitor voltage reaches \\(18\\text{ V}\\) (75% of steady-state voltage).</li>
            <li><strong>Part (c):</strong> Compute the total energy delivered by the DC source \\(W_{\\text{source}}\\), energy stored in the electric field \\(W_C\\), and energy dissipated as Joule heat in the resistor \\(W_R\\) as \\(t \\to \\infty\\).</li>
          </ul>
        </div>
      `
    },
    {
      num: "02",
      id: "sec-physical",
      title: "Understand the Physical Situation",
      content: `
        <p>Before \\(t = 0\\), the capacitor plates are electrically neutral; the electric field inside the dielectric is zero. At \\(t = 0^+\\), the DC voltage source is applied:</p>
        <ul style="margin: 0.75rem 0 0.75rem 1.5rem; line-height: 1.8;">
          <li><strong>Displacement and Conduction Current:</strong> Electrons leave the positive plate and accumulate on the negative plate. Across the dielectric, an equal displacement current density \\(J_D = \\varepsilon \\frac{\\partial E}{\\partial t}\\) maintains Ampère-Maxwell continuity.</li>
          <li><strong>Inability to Jump Voltage Instantaneously:</strong> For voltage to change discontinuously (\\(\\Delta v_C > 0\\) in \\(\\Delta t = 0\\)), it would require infinite current \\(i = C \\frac{dv_C}{dt} \\to \\infty\\), demanding infinite source power. In any physically resistive network, the capacitor state variable is strictly continuous:
          $$\\lim_{t \\to 0^+} v_C(t) = v_C(0^-) = 0\\text{ V}$$
          The uncharged capacitor momentarily acts as an ideal short-circuit at \\(t = 0^+\\).</li>
          <li><strong>Steady-State Equilibrium:</strong> As charge \\(q(t) = C v_C(t)\\) accumulates, the opposing electrostatic potential rises until \\(v_C(\\infty) = V_s\\). The net loop voltage drop across \\(R\\) drops to zero, loop current ceases (\\(i(\\infty) = 0\\)), and the capacitor acts as an open-circuit.</li>
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
            <strong>Core Concept:</strong> First-order non-homogeneous linear ordinary differential equation (ODE) with constant coefficients, governing the zero-state step response of an energy-storage element in a linear time-invariant (LTI) network.
          </div>
        </div>
        <p>The characteristic time constant \\(\\tau = R_{\\text{Th}} C\\) dictates the relaxation rate of the system state variable \\(v_C(t)\\).</p>
      `
    },
    {
      num: "04",
      id: "sec-given",
      title: "List the Given Parameters",
      content: `
        <table style="width: 100%; border-collapse: collapse; margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.85rem;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-medium); text-align: left; color: var(--text-muted);">
              <th style="padding: 6px;">Parameter</th>
              <th style="padding: 6px;">Symbol</th>
              <th style="padding: 6px;">Value</th>
              <th style="padding: 6px;">SI Base Units</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid var(--border-subtle);">
              <td style="padding: 6px;">Series Resistance</td>
              <td style="padding: 6px; color: var(--color-voltage);">\\(R\\)</td>
              <td style="padding: 6px;">\\(20\\text{ k}\\Omega\\)</td>
              <td style="padding: 6px;">\\(20\\times 10^3\\text{ }\\Omega\\text{ (V}\\cdot\\text{A}^{-1}\\text{)}\\)</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-subtle);">
              <td style="padding: 6px;">Capacitance</td>
              <td style="padding: 6px; color: var(--color-voltage);">\\(C\\)</td>
              <td style="padding: 6px;">\\(50\\text{ }\\mu\\text{F}\\)</td>
              <td style="padding: 6px;">\\(50\\times 10^{-6}\\text{ F (A}\\cdot\\text{s}\\cdot\\text{V}^{-1}\\text{)}\\)</td>
            </tr>
            <tr style="border-bottom: 1px solid var(--border-subtle);">
              <td style="padding: 6px;">Source Voltage</td>
              <td style="padding: 6px; color: var(--color-voltage);">\\(V_s\\)</td>
              <td style="padding: 6px;">\\(24\\text{ V}\\)</td>
              <td style="padding: 6px;">\\(24.0\\text{ V (J}\\cdot\\text{C}^{-1}\\text{)}\\)</td>
            </tr>
            <tr>
              <td style="padding: 6px;">Initial Capacitor Charge</td>
              <td style="padding: 6px; color: var(--color-voltage);">\\(v_C(0^-)\\)</td>
              <td style="padding: 6px;">\\(0\\text{ V}\\)</td>
              <td style="padding: 6px;">\\(0.0\\text{ V}\\)</td>
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
          <li>Characteristic Time Constant: \\(\\tau = R C\\) \\([\\text{s}]\\)</li>
          <li>Capacitor voltage at \\(t = 1.5\\text{ s}\\): \\(v_C(1.5)\\) \\([\\text{V}]\\)</li>
          <li>Loop current at \\(t = 1.5\\text{ s}\\): \\(i(1.5)\\) \\([\\text{A}]\\)</li>
          <li>Time required to reach \\(18\\text{ V}\\): \\(t^*\\) \\([\\text{s}]\\)</li>
          <li>Asymptotic Energy Balance at \\(t \\to \\infty\\): \\(W_{\\text{source}}, W_C, W_R\\) \\([\\text{Joules}]\\)</li>
        </ul>
      `
    },
    {
      num: "06",
      id: "sec-prereq",
      title: "Identify Required Prerequisites & Concept Dependency Map",
      content: `
        <p>This problem rests on fundamental circuit theorems and differential calculus:</p>
        <ol style="margin: 0.5rem 0 0.75rem 1.5rem; line-height: 1.8;">
          <li><strong>Kirchhoff's Voltage Law (KVL):</strong> \\(\\sum_{k} v_k = 0\\) around any closed loop.</li>
          <li><strong>Capacitor V-I Constitutive Law:</strong> \\(i(t) = C \\frac{dv_C}{dt}\\).</li>
          <li><strong>Integrating Factor Method</strong> for first-order linear ODEs.</li>
        </ol>

        <!-- Mermaid Prerequisite Flowchart -->
        <div class="mermaid-diagram-wrap">
          <pre class="mermaid">
graph LR
    CALC["Calculus: 1st Order ODEs"] --> KVL["Kirchhoff's Voltage Law"]
    CONST["Capacitor Law: i = C dv/dt"] --> KVL
    KVL --> RC["Series RC ODE: dv/dt + v/τ = Vs/τ"]
    RC --> STEP["Step Response: v(t) = Vs(1 - e^-t/τ)"]
    STEP --> LAP["Laplace Transform Analysis"]
    STEP --> IND["Industrial Apps: Debounce & Snubbers"]
          </pre>
        </div>
      `
    },
    {
      num: "07",
      id: "sec-formulation",
      title: "Mathematical Formulation",
      content: `
        <p>Applying Kirchhoff's Voltage Law (KVL) around the clockwise loop for \\(t \\ge 0\\):</p>
        $$V_s - v_R(t) - v_C(t) = 0 \\implies V_s - R \\cdot i(t) - v_C(t) = 0$$
        <p>Substituting the constitutive relation \\(i(t) = C \\frac{dv_C(t)}{dt}\\):</p>
        $$R C \\frac{dv_C(t)}{dt} + v_C(t) = V_s$$
        <p>Dividing by \\(RC\\) yields the standard state-space canonical form:</p>
        $$\\frac{dv_C(t)}{dt} + \\frac{1}{\\tau} v_C(t) = \\frac{V_s}{\\tau}, \\quad \\text{where } \\tau = R C$$
      `
    },
    {
      num: "08",
      id: "sec-derivation",
      title: "Step-by-Step Derivation",
      content: `
        <p>Multiply both sides by integrating factor \\(\\mu(t) = e^{\\int (1/\\tau) dt} = e^{t/\\tau}\\):</p>
        $$e^{t/\\tau} \\frac{dv_C}{dt} + \\frac{1}{\\tau} e^{t/\\tau} v_C = \\frac{V_s}{\\tau} e^{t/\\tau}$$
        <p>Recognizing the product rule on the left-hand side:</p>
        $$\\frac{d}{dt} \\left[ v_C(t) e^{t/\\tau} \\right] = \\frac{V_s}{\\tau} e^{t/\\tau}$$
        <p>Integrating both sides from \\(0\\) to \\(t\\):</p>
        $$\\left[ v_C(u) e^{u/\\tau} \\right]_{0}^{t} = \\int_{0}^{t} \\frac{V_s}{\\tau} e^{u/\\tau} du = V_s \\left[ e^{t/\\tau} - 1 \\right]$$
        $$v_C(t) e^{t/\\tau} - v_C(0) = V_s e^{t/\\tau} - V_s$$
        <p>Multiplying by \\(e^{-t/\\tau}\\) yields the universal closed-form step response:</p>
        <div class="math-block">
          $$v_C(t) = V_s + \\left( v_C(0) - V_s \\right) e^{-t/\\tau} = V_s \\left( 1 - e^{-t/\\tau} \\right) \\quad [\\text{for } v_C(0)=0]$$
        </div>
        <p>Differentiating to obtain the loop current \\(i(t)\\):</p>
        <div class="math-block" style="border-left-color: #f43f5e;">
          $$i(t) = C \\frac{dv_C}{dt} = C \\cdot V_s \\left( \\frac{1}{\\tau} e^{-t/\\tau} \\right) = \\frac{V_s}{R} e^{-t/\\tau}$$
        </div>
      `
    },
    {
      num: "09",
      id: "sec-calculation",
      title: "Numerical Walkthrough",
      content: `
        <div style="background: #040812; padding: 1rem; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.8; border: 1px solid var(--border-subtle);">
          <p><strong>1. Time Constant Calculation:</strong></p>
          <p>$$\\tau = R \\cdot C = (20 \\times 10^3\\text{ }\\Omega) \\times (50 \\times 10^{-6}\\text{ F}) = \\mathbf{1.000\\text{ s}}$$</p>
          <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 0.5rem 0;" />
          
          <p><strong>2. Values at \\(t = 1.5\\text{ s}\\):</strong></p>
          <p>$$\\frac{t}{\\tau} = \\frac{1.5}{1.0} = 1.5 \\implies e^{-1.5} \\approx 0.223130$$</p>
          <p>$$v_C(1.5) = 24 \\cdot (1 - 0.223130) = 24 \\cdot 0.776870 = \\mathbf{18.645\\text{ V}}$$</p>
          <p>$$i(1.5) = \\left( \\frac{24}{20000} \\right) \\cdot e^{-1.5} = 1.20\\text{ mA} \\times 0.223130 = \\mathbf{0.2678\\text{ mA (267.8 }\\mu\\text{A)}}$$</p>
          <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 0.5rem 0;" />

          <p><strong>3. Time Required to Reach \\(18\\text{ V}\\):</strong></p>
          <p>$$18 = 24 \\cdot (1 - e^{-t^*/\\tau}) \\implies 1 - e^{-t^*} = \\frac{18}{24} = 0.75$$</p>
          <p>$$e^{-t^*} = 0.25 \\implies -t^* = \\ln(0.25) = -\\ln(4)$$</p>
          <p>$$t^* = 2 \\cdot \\ln(2) \\cdot \\tau \\approx 2 \\times 0.693147 \\times 1.0\\text{ s} = \\mathbf{1.3863\\text{ s}}$$</p>
          <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 0.5rem 0;" />

          <p><strong>4. Asymptotic Energy Partition at \\(t \\to \\infty\\):</strong></p>
          <p>$$W_C = \\frac{1}{2} C V_s^2 = 0.5 \\times (50 \\times 10^{-6}) \\times (24)^2 = \\mathbf{14.40\\text{ mJ}}$$</p>
          <p>$$W_{\\text{source}} = \\int_0^\\infty V_s \\cdot i(t) dt = V_s \\cdot Q_{\\text{final}} = C V_s^2 = \\mathbf{28.80\\text{ mJ}}$$</p>
          <p>$$W_R = W_{\\text{source}} - W_C = 28.80 - 14.40 = \\mathbf{14.40\\text{ mJ (Exact 50.0%)}}$$</p>
        </div>
      `
    },
    {
      num: "10",
      id: "sec-visual",
      title: "Interactive Visualisation",
      content: `
        <p>The time constant \\(\\tau = 1.0\\text{ s}\\) characterizes the natural response. Observe the exact analytical milestones:</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; margin-top: 0.75rem;">
          <div style="background: var(--bg-surface-subtle); padding: 0.6rem; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--border-subtle);">
            <div style="color: var(--text-dim); font-size: 0.7rem;">AT t = 1τ (1.0s)</div>
            <div style="color: var(--color-voltage); font-weight: 700;">63.2% (15.17 V)</div>
          </div>
          <div style="background: var(--bg-surface-subtle); padding: 0.6rem; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--border-subtle);">
            <div style="color: var(--text-dim); font-size: 0.7rem;">AT t = 2τ (2.0s)</div>
            <div style="color: var(--color-voltage); font-weight: 700;">86.5% (20.75 V)</div>
          </div>
          <div style="background: var(--bg-surface-subtle); padding: 0.6rem; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--border-subtle);">
            <div style="color: var(--text-dim); font-size: 0.7rem;">AT t = 3τ (3.0s)</div>
            <div style="color: var(--color-voltage); font-weight: 700;">95.0% (22.80 V)</div>
          </div>
          <div style="background: var(--bg-surface-subtle); padding: 0.6rem; border-radius: var(--radius-sm); text-align: center; border: 1px solid var(--border-subtle);">
            <div style="color: var(--text-dim); font-size: 0.7rem;">AT t = 5τ (5.0s)</div>
            <div style="color: var(--color-power); font-weight: 700;">99.3% (23.84 V)</div>
          </div>
        </div>
      `
    },
    {
      num: "11",
      id: "sec-sim-link",
      title: "Engineering Simulation",
      content: `
        <p>Transfer these parameters directly into the laboratory workbench:</p>
        <div style="margin-top: 0.75rem;">
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div>
              <h4 style="color: var(--color-time); font-size: 0.95rem;">Diagnostic Inverse Problem</h4>
              <p style="font-size: 0.8rem; color: var(--text-muted);">Reconstruct physical circuit parameters from an oscilloscope waveform.</p>
            </div>
          </div>
          <p style="font-size: 0.85rem;">
            An oscilloscope trace of an unknown RC network shows that the capacitor charges from \\(0\\text{ V}\\) to <strong>75% of steady-state voltage in exactly 1.386 seconds</strong>.
            If an LCR meter measures the capacitance as \\(C = 50\\text{ }\\mu\\text{F}\\), calculate the value of series resistance \\(R\\):
          </p>
          <div class="reverse-interactive">
            <input type="number" id="revInputR" class="reverse-input" placeholder="e.g. 20000" />
            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">Ohms (Ω)</span>
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
          <li><strong>Switch Debounce Filters:</strong> Mechanical switch contacts bounce for 5–20 ms on closure, producing false clock edges in digital microcontrollers. A low-pass RC filter with \\(\\tau \\approx 10\\text{ ms}\\) suppresses high-frequency chatter.</li>
          <li><strong>Microcontroller Power-On Reset (POR):</strong> An external RC network maintains the active-low \\(\\overline{\\text{RESET}}\\) pin at logic 0 until the power supply rail stabilizes above the brownout threshold.</li>
          <li><strong>RC Snubbers in Power Electronics:</strong> Placed in parallel with IGBTs and Thyristors to suppress high transient \\(dv/dt\\) voltage spikes caused by circuit stray inductance during turn-off.</li>
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
            <strong>Trap 1: Assuming 100% capacitor charge is reached at \\(t = \\tau\\):</strong><br>
            At \\(t = \\tau\\), the capacitor reaches only <strong>63.2%</strong> of the final step, NOT 100%. Settling to within 2% requires \\(4\\tau\\), and within 1% requires \\(5\\tau\\).
          </div>
        </div>
        <div class="lab-alert alert-warning">
          <div>
            <strong>Trap 2: Believing resistor heat dissipation depends on resistance \\(R\\):</strong><br>
            The total heat energy dissipated during full charging from a constant DC source is \\(W_R = \\frac{1}{2} C V_s^2\\), which is <em>strictly independent</em> of \\(R\\)! A smaller \\(R\\) results in higher peak current for a shorter duration; a larger \\(R\\) results in smaller current for a longer duration. The integral \\(\\int_0^\\infty i(t)^2 R dt\\) always evaluates to exactly \\(\\frac{1}{2} C V_s^2\\).
          </div>
        </div>
      `
    },
    {
      num: "15",
      id: "sec-alternative",
      title: "Alternative Solution Approach (s-Domain / Laplace)",
      content: `
        <p>In the Laplace \\(s\\)-domain, the DC step source is \\(V_s(s) = \\frac{V_s}{s}\\) and the capacitor impedance is \\(Z_C(s) = \\frac{1}{sC}\\).</p>
        <p>Using the s-domain voltage divider:</p>
        $$V_C(s) = V_s(s) \\cdot \\frac{Z_C}{R + Z_C} = \\frac{V_s}{s} \\cdot \\frac{1/(sC)}{R + 1/(sC)} = \\frac{V_s / (RC)}{s(s + 1/(RC))}$$
        <p>Expanding into partial fractions:</p>
        $$V_C(s) = V_s \\left[ \\frac{1}{s} - \\frac{1}{s + 1/\\tau} \\right]$$
        <p>Applying the inverse Laplace transform \\(\\mathcal{L}^{-1}\\{V_C(s)\\}\\):</p>
        $$v_C(t) = V_s \\left( 1 - e^{-t/\\tau} \\right) u(t)$$
        <p>This confirms the exact analytical result derived from the time-domain ODE.</p>
      `
    },
    {
      num: "16",
      id: "sec-practice",
      title: "Three New Practice Problems",
      content: `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="background: var(--bg-surface-subtle); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid #10b981; border-top: 1px solid var(--border-subtle); border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
            <div style="font-weight: 700; color: #a7f3d0; font-size: 0.85rem; margin-bottom: 0.35rem;">PRACTICE PROBLEM 1 (GATE Standard - Non-zero Initial Condition)</div>
            <p style="font-size: 0.85rem;">A \\(100\\text{ }\\mu\\text{F}\\) capacitor is initially pre-charged to \\(10\\text{ V}\\). At \\(t = 0\\), it is connected to a \\(30\\text{ V}\\) DC source through a \\(5\\text{ k}\\Omega\\) resistor. Find the capacitor voltage at \\(t = 0.5\\text{ s}\\).</p>
            <div style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">[Answer: \\(\\tau = 0.5\\text{ s}\\), \\(v_C(0.5) = 30 + (10 - 30)e^{-1} = 30 - 20(0.3679) = \\mathbf{22.64\\text{ V}}\\)]</div>
          </div>
          <div style="background: var(--bg-surface-subtle); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid #f59e0b; border-top: 1px solid var(--border-subtle); border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
            <div style="font-weight: 700; color: #fde68a; font-size: 0.85rem; margin-bottom: 0.35rem;">PRACTICE PROBLEM 2 (GATE Advanced - Energy Fraction)</div>
            <p style="font-size: 0.85rem;">In an uncharged RC charging circuit, the switch is closed at \\(t = 0\\) and opened again at \\(t = 2\\tau\\). Express the peak energy stored in the capacitor as a percentage of the theoretical maximum energy (\\(\\frac{1}{2} C V_s^2\\)).</p>
            <div style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">[Answer: \\(v_C(2\\tau) = V_s(1 - e^{-2}) \\approx 0.8647 V_s\\); Energy fraction = \\((0.8647)^2 \\approx \\mathbf{74.8\\%}\\)]</div>
          </div>
          <div style="background: var(--bg-surface-subtle); padding: 1rem; border-radius: var(--radius-md); border-left: 3px solid #f43f5e; border-top: 1px solid var(--border-subtle); border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
            <div style="font-weight: 700; color: #fda4af; font-size: 0.85rem; margin-bottom: 0.35rem;">PRACTICE PROBLEM 3 (Real-World Component - Dielectric Leakage)</div>
            <p style="font-size: 0.85rem;">A real electrolytic capacitor has an internal parallel leakage resistance of \\(R_{\\text{leak}} = 2\\text{ M}\\Omega\\) in parallel with \\(C = 100\\text{ }\\mu\\text{F}\\). If charged from a \\(50\\text{ V}\\) source via \\(R_{\\text{series}} = 10\\text{ k}\\Omega\\), determine the steady-state final capacitor voltage \\(v_C(\\infty)\\).</p>
            <div style="margin-top: 0.5rem; font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-dim);">[Answer: By voltage divider, \\(v_C(\\infty) = 50 \\times \\frac{2000\\text{k}}{2000\\text{k} + 10\\text{k}} = 50 \\times \\frac{2000}{2010} = \\mathbf{49.75\\text{ V}}\\)]</div>
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
          <li>Prof. Nagendra Krishnapura, <em>"Basic Electrical Circuits"</em>, Module 5: First-Order Circuit Transients, NPTEL Course ID: 108106075, Department of Electrical Engineering, IIT Madras.</li>
          <li>Prof. Tapas Kumar Bhattacharya, <em>"Network Analysis"</em>, Lecture 18: Transient Response of Linear Systems, NPTEL Course ID: 108105159, IIT Kharagpur.</li>
          <li>Prof. Anant Agarwal and Jeffrey Lang, <em>"Foundations of Analog and Digital Electronic Circuits"</em>, Chapter 10: Energy Storage Elements and First-Order RC Circuits, MIT OpenCourseWare (Course 6.002).</li>
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
