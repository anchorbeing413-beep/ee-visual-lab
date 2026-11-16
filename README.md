# EE Visual Lab: Interactive Electrical Engineering Research & Simulation Platform

> **Milestone 1 Core Focus:** Electric Circuits — First-Order RC Transient Response & Energy Conservation.  
> **Target:** GATE Electrical Engineering, ESE, and IIT/NIT Academic Rigor.

---

## 🔬 Welcome to EE Visual Lab

**EE Visual Lab** is designed from the ground up as a serious engineering learning and research environment. Instead of memorizing formulas or copying coaching solutions, students explore the underlying physics, derive governing differential equations from first principles, interact with high-precision mathematical simulations, and solve diagnostic reverse-engineering challenges.

---

## 📁 Project Structure

```
gate os/
├── index.html                  # Main unified portal & navigation shell
├── README.md                   # Project documentation & execution guide
├── css/
│   ├── lab-theme.css           # Dark scientific laboratory design system & typography
│   ├── components.css          # Reusable cards, telemetry badges, buttons, sliders
│   └── simulation.css          # Oscilloscope viewport, schematic styling, reverse lab
└── js/
    ├── rc-simulator.js         # Exact analytical ODE engine for RC circuits
    ├── scientific-canvas.js    # High-precision dual-trace oscilloscope with crosshair
    ├── research-data.js        # Authentic academic references (IIT Madras, IIT KGP, MIT)
    ├── question-workspace.js   # 17-point standardized GATE Question Workspace
    └── app.js                  # Master application controller and event bus
```

---

## ⚡ How to Run the Project in VS Code

Because this milestone is built with zero complex build tooling (pure modern HTML5, CSS3, and ES6 JavaScript), you can run it immediately without running complex `npm` installs:

### Option 1: VS Code "Live Server" (Recommended)
1. Open the folder in **VS Code**: `File` → `Open Folder...` → select `gate os`.
2. Install the **Live Server** extension by Ritwick Dey (if not already installed).
3. Right-click `index.html` in the file explorer and select **"Open with Live Server"**.
4. Your default browser will open at `http://127.0.0.1:5500/index.html`.

### Option 2: Open Directly in Any Browser
Double-click `index.html` in your file explorer (or right-click `index.html` → Open with Chrome / Edge / Firefox).

### Option 3: Python Local Server
Open PowerShell in the project directory and run:
```powershell
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

---

## 🧮 Mathematical Verification & Physics Engine

The simulation engine (`js/rc-simulator.js`) computes analytical solutions to the non-homogeneous 1st-order linear ordinary differential equation:

$$R \cdot C \frac{dv_C(t)}{dt} + v_C(t) = V_s(t)$$

### 1. Step Charging Response ($v_C(0^-) = 0$):
- **Capacitor Voltage:** $v_C(t) = V_s \left(1 - e^{-t/\tau}\right)$
- **Loop Current:** $i(t) = \frac{V_s}{R} e^{-t/\tau}$
- **Resistor Voltage:** $v_R(t) = V_s e^{-t/\tau}$
- **Time Constant:** $\tau = R \times C$ (seconds)
- **Rise Time (10% to 90%):** $t_r = \tau \ln(9) \approx 2.1972 \cdot \tau$
- **Settling Time (99.3%):** $t_s = 5\tau$

### 2. Universal Energy Proof:
- **Total Energy Supplied by DC Source:** $W_{\text{source}} = C V_s^2$
- **Energy Stored in Capacitor Electric Field:** $W_C = \frac{1}{2} C V_s^2$
- **Energy Dissipated in Series Resistor:** $W_R = \frac{1}{2} C V_s^2$  
  *(Note: Exactly 50% is always lost as heat in the charging resistance, regardless of the value of $R$!)*

---

## 📋 The 17-Point Question Workspace Template

Every problem on the platform follows this structured 17-step template (`js/question-workspace.js`):

1. **Problem Statement** — Clean statement with clear sub-parts.
2. **Understand the Physical Situation** — Charge displacement, dielectric polarization, continuity.
3. **Identify the Engineering Concept** — 1st-order ODE, time constant, state variable.
4. **List the Given Parameters** — Table with SI base units.
5. **Identify the Unknown Variables** — What must be found.
6. **Identify Required Prerequisites** — KVL, capacitor constitutive law.
7. **Mathematical Formulation** — Differential equation setup.
8. **Step-by-Step Derivation** — Integrating factor and boundary conditions.
9. **Numerical Calculation** — Arithmetic walkthrough.
10. **Interactive Visualisation** — Time-constant milestone thresholds (1τ to 5τ).
11. **Engineering Simulation** — "Load This Question into Simulator" button.
12. **Reverse Engineering Challenge** — Interactive inverse calculation with real-time feedback.
13. **Practical Industrial Application** — Switch debouncing, microcontroller POR reset, snubbers.
14. **Common Mistakes (GATE Traps)** — R-independent energy dissipation, misconception of 1τ vs settling time.
15. **Alternative Solution** — Laplace s-domain impedance derivation.
16. **Three New Practice Problems** — Progressive difficulty (GATE Level 1, Level 2, Level 3).
17. **Research References** — Verifiable NPTEL & IEEE open-access literature.

---

## 🗺️ 1-Year Roadmap

| Phase | Milestone | Focus Area | Status |
|:---:|:---|:---|:---:|
| **1** | **Foundation & First Lab** | Project Shell, Design System, RC Transient Lab & 17-Step Workspace | **Completed (Current)** |
| 2 | Advanced Circuits | RL, Series/Parallel RLC, Resonance, AC Transients | Upcoming |
| 3 | Electromagnetic Fields | Electrostatics, Maxwell's Equations, Wave Visualizer | Scheduled |
| 4 | Electrical Machines | Transformer Equivalent Circuit, Induction Motor Torque-Speed | Scheduled |
| 5 | Power Systems | Transmission Line Models, Symmetrical Faults, Load Flow | Scheduled |
| 6 | Control Systems | Root Locus, Bode Plots, State-Space Observer | Scheduled |
| 7 | Power Electronics | Buck/Boost Converters, Inverters, Harmonic Spectrum | Scheduled |
| 8 | Student Platform & Testing | User Accounts, Mistake Notebook, Full GATE EE Question Bank | Long-term |
