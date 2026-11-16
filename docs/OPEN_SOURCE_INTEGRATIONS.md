# EE Visual Lab: Open Source Scientific & Engineering Integration Strategy

This document provides a comprehensive evaluation of the 12 candidate open-source scientific and engineering repositories for **EE Visual Lab**, establishing an integration roadmap, dependency requirements, and commercial compliance guidelines.

---

## 1. Repository Evaluation Matrix

| # | Repository | Core Language | Primary Role | License | Integration Tier |
|:---:|:---|:---:|:---|:---:|:---:|
| 1 | `mathjax/MathJax` | JavaScript / TS | Mathematical LaTeX/MathML display engine | Apache 2.0 | **Phase 1 (Frontend)** |
| 2 | `josdejong/mathjs` | JavaScript / TS | Symbolic math, unit dimensional analysis, complex matrices | Apache 2.0 | **Phase 1 (Frontend)** |
| 3 | `plotly/plotly.js` | JavaScript | Publication-grade interactive scientific plotting | MIT | **Phase 1 (Frontend)** |
| 4 | `mermaid-js/mermaid` | JavaScript / TS | Dynamic concept maps & state machine diagrams | MIT | **Phase 1 (Frontend)** |
| 5 | `pfalstad/circuitjs1` | Java / GWT (JS) | Interactive browser electronic circuit simulation | GPLv2 | **Phase 3 (Sandboxed IFrame)** |
| 6 | `mph-/lcapy` | Python | Symbolic linear circuit analysis & transfer functions | LGPLv2.1+ | **Phase 2 (Validation Backend)** |
| 7 | `python-control/python-control` | Python | Control system analysis (Bode, Root Locus, State-space) | BSD 3-Clause | **Phase 3 (Scientific Engine)** |
| 8 | `sympy/sympy` | Python | Computer Algebra System (CAS), ODEs, Laplace transforms | BSD 3-Clause | **Phase 2 (Verification Layer)** |
| 9 | `cdelker/schemdraw` | Python | Programmatic IEEE/IEC vector circuit schematic generation | MIT | **Phase 2 (Asset Pipeline)** |
| 10 | `PySpice-org/PySpice` | Python / C (Ngspice) | SPICE simulation interface for non-ideal physical circuits | GPLv3 | **Phase 4 (Advanced Engine)** |
| 11 | `e2nIEE/pandapower` | Python | Power flow, short-circuit (IEC 60909), grid modeling | BSD 3-Clause | **Phase 4 (Power Systems)** |
| 12 | `PyPSA/PyPSA` | Python | Multi-period power system optimization & renewable grids | MIT | **Phase 4 (Industrial Research)** |

---

## 2. Detailed Technical Profiles

### 01. `mathjax/MathJax`
* **Official URL:** [https://github.com/mathjax/MathJax](https://github.com/mathjax/MathJax)
* **Main Functionality:** Cross-browser JavaScript rendering engine that translates LaTeX equations into crisp, scalable SVG and MathML with typographic accuracy.
* **Programming Language:** JavaScript / TypeScript.
* **Licence:** Apache License 2.0.
* **Integration Possibilities:** Directly replaces raw text formulas in the 17-point Question Workspace and live simulation telemetry. Enables rendering derivations, boundary conditions, and matrix equations with zero latency.
* **Hardware & Dependencies:** Client-side browser only. Version 3/4 minified bundle loaded asynchronously (~150 KB gzip).
* **Relevant EE Subjects:** All 9 GATE EE subjects (Universal mathematical foundation).
* **Commercial Considerations:** Fully permissive under Apache 2.0. Requires standard copyright notice.

### 02. `josdejong/mathjs`
* **Official URL:** [https://github.com/josdejong/mathjs](https://github.com/josdejong/mathjs)
* **Main Functionality:** Comprehensive mathematical library providing an expression parser, unit dimensional verification ($20\text{ k}\Omega \times 50\ \mu\text{F} = 1\text{ s}$), complex number arithmetic ($Z = R + j\omega L$), and matrix algebra.
* **Programming Language:** JavaScript / TypeScript.
* **Licence:** Apache License 2.0.
* **Integration Possibilities:** 
  1. Powers the client-side validation layer to prevent dimensional mistakes.
  2. Solves AC sinusoidal steady-state phasor impedances directly in browser.
  3. Evaluates custom student-entered algebraic expressions in Reverse Engineering challenges.
* **Hardware & Dependencies:** Runs in any modern browser or Node.js runtime. Minimal memory footprint (< 10 MB).
* **Relevant EE Subjects:** Electric Circuits, Control Systems, Engineering Mathematics.
* **Commercial Considerations:** Apache 2.0 permissive. Fully compliant for commercial platforms.

### 03. `plotly/plotly.js`
* **Official URL:** [https://github.com/plotly/plotly.js](https://github.com/plotly/plotly.js)
* **Main Functionality:** High-performance, publication-grade scientific graphing library built on D3.js and WebGL. Supports responsive 2D/3D plots, logarithmic axes, contour plots, and vector fields with interactive hover, zoom, pan, and SVG export.
* **Programming Language:** JavaScript.
* **Licence:** MIT License.
* **Integration Possibilities:** Standardizes scientific visualization across laboratories:
  - Time-domain transient waveforms with dual-trace y-axes.
  - Frequency response (Bode magnitude and phase diagrams).
  - Root-locus plots and s-plane pole-zero constellations.
  - Induction machine torque-slip curves.
* **Hardware & Dependencies:** Client-side browser with WebGL/Canvas acceleration.
* **Relevant EE Subjects:** Electric Circuits, Control Systems, Electrical Machines, Power Systems.
* **Commercial Considerations:** Highly permissive MIT license.

### 04. `mermaid-js/mermaid`
* **Official URL:** [https://github.com/mermaid-js/mermaid](https://github.com/mermaid-js/mermaid)
* **Main Functionality:** Markdown-inspired diagramming library that converts declarative text into vector SVG flowcharts, state diagrams, sequence charts, and class trees.
* **Programming Language:** JavaScript / TypeScript.
* **Licence:** MIT License.
* **Integration Possibilities:**
  1. Visualizes hierarchical subject prerequisite trees (e.g. *Calculus ODEs → RC Transients → Laplace Transform*).
  2. Generates finite state machine (FSM) diagrams in Digital Electronics.
  3. Represents power system flowcharts and protection relay logic.
* **Hardware & Dependencies:** Pure client-side JavaScript.
* **Relevant EE Subjects:** Concept Library, Digital Electronics, Learning Pathways.
* **Commercial Considerations:** Permissive MIT license.

### 05. `pfalstad/circuitjs1`
* **Official URL:** [https://github.com/pfalstad/circuitjs1](https://github.com/pfalstad/circuitjs1)
* **Main Functionality:** Full electronic circuit simulator running in the browser (GWT/JavaScript port of Paul Falstad’s circuit simulator). Solves non-linear circuits using Modified Nodal Analysis (MNA) with live switch interactions and voltage/current animations.
* **Programming Language:** Java (compiled to JavaScript via Google Web Toolkit).
* **Licence:** GNU General Public License v2.0 (GPLv2).
* **Integration Possibilities:** Sandboxed embedded `<iframe>` widget for freeform "Open Sandbox" circuit design and troubleshooting, linked through encoded URL circuit definitions.
* **Hardware & Dependencies:** Client CPU intensive during complex multi-node transient calculations.
* **Relevant EE Subjects:** Electric Circuits, Analog Electronics, Power Electronics.
* **Commercial Considerations:** **GPLv2 Strict Isolation Required.** To prevent GPL copyleft obligations from spreading to EE Visual Lab proprietary codebase, CircuitJS1 must *never* be compiled or bundled into the platform's core source. It must remain strictly an isolated external iframe service.

### 06. `mph-/lcapy`
* **Official URL:** [https://github.com/mph-/lcapy](https://github.com/mph-/lcapy)
* **Main Functionality:** Linear circuit analysis in Python. Uses SymPy to compute exact symbolic transfer functions, Laplace transforms, step/impulse responses, and node voltage expressions from text netlists.
* **Programming Language:** Python 3.
* **Licence:** GNU Lesser General Public License v2.1 or later (LGPLv2.1+).
* **Integration Possibilities:** Backend verification engine or offline pre-generation script. Automatically derives analytical steps and verifies question workspace equations before publication.
* **Hardware & Dependencies:** Python 3.8+, SymPy, NumPy, Matplotlib.
* **Relevant EE Subjects:** Electric Circuits, Signals & Systems, Analog Electronics.
* **Commercial Considerations:** LGPL allows usage as a separated microservice or CLI validation tool without open-sourcing the main platform.

### 07. `python-control/python-control`
* **Official URL:** [https://github.com/python-control/python-control](https://github.com/python-control/python-control)
* **Main Functionality:** Implements basic operations for analysis and design of feedback control systems (open-source counterpart to MATLAB's Control Systems Toolbox). Computes Bode, Nyquist, Nichols, Root Locus, state-space representations, and optimal state feedback (LQR).
* **Programming Language:** Python 3.
* **Licence:** BSD 3-Clause License.
* **Integration Possibilities:** Powers Phase 3 backend calculations for the Control Systems laboratory, producing benchmark data for step response overshoots, phase margins, and gain margins.
* **Hardware & Dependencies:** Python 3, NumPy, SciPy, Matplotlib.
* **Relevant EE Subjects:** Control Systems (GATE EE Topic 06).
* **Commercial Considerations:** Highly permissive BSD 3-Clause license.

### 08. `sympy/sympy`
* **Official URL:** [https://github.com/sympy/sympy](https://github.com/sympy/sympy)
* **Main Functionality:** Full-featured Computer Algebra System (CAS). Evaluates symbolic calculus, differential equations, Fourier/Laplace transforms, matrices, and outputs formatted LaTeX strings.
* **Programming Language:** Pure Python.
* **Licence:** BSD 3-Clause License.
* **Integration Possibilities:**
  1. Offline verification layer for mathematical correctness.
  2. Can run client-side in the browser via Pyodide (WebAssembly) for offline symbolic math solving if serverless execution is desired.
* **Hardware & Dependencies:** Python 3 (or Pyodide WebAssembly in browser).
* **Relevant EE Subjects:** Engineering Mathematics, Electric Circuits, Electromagnetic Fields, Control Systems.
* **Commercial Considerations:** Permissive BSD 3-Clause.

### 09. `cdelker/schemdraw`
* **Official URL:** [https://github.com/cdelker/schemdraw](https://github.com/cdelker/schemdraw)
* **Main Functionality:** Python library for programmatically generating publication-quality vector circuit schematics (SVG, PDF, PNG) complying with IEEE and IEC standards.
* **Programming Language:** Python 3.
* **Licence:** MIT License.
* **Integration Possibilities:** Automated build pipeline tool to generate pixel-perfect, scalable SVG circuit diagrams for every GATE question and textbook derivation, ensuring visual consistency.
* **Hardware & Dependencies:** Python 3, Matplotlib or direct SVG backend.
* **Relevant EE Subjects:** Electric Circuits, Analog Electronics, Power Electronics, Machines.
* **Commercial Considerations:** Permissive MIT license.

### 10. `PySpice-org/PySpice`
* **Official URL:** [https://github.com/PySpice-org/PySpice](https://github.com/PySpice-org/PySpice)
* **Main Functionality:** Python wrapper around Ngspice and Xyce circuit simulation engines. Enables scripted SPICE simulations of non-linear semiconductors, parasitic elements, and thermal characteristics.
* **Programming Language:** Python / C.
* **Licence:** GPLv3.
* **Integration Possibilities:** Phase 4 backend validation harness: compares theoretical first-order ideal formulas against full non-ideal SPICE simulations (e.g. non-ideal capacitor ESR and dielectric leakage).
* **Hardware & Dependencies:** Requires compiled Ngspice shared C libraries (`libngspice.so` / `ngspice.dll`).
* **Relevant EE Subjects:** Power Electronics, Analog Circuits, Advanced Transient Analysis.
* **Commercial Considerations:** GPLv3 requires strict process isolation (REST API boundary) to avoid license contagion.

### 11. `e2nIEE/pandapower`
* **Official URL:** [https://github.com/e2nIEE/pandapower](https://github.com/e2nIEE/pandapower)
* **Main Functionality:** Power system analysis and optimization library based on pandas and PYPOWER. Implements Newton-Raphson & Gauss-Seidel load flow, short-circuit calculations (IEC 60909), state estimation, and optimal power flow.
* **Programming Language:** Python 3.
* **Licence:** BSD 3-Clause License.
* **Integration Possibilities:** Backend scientific engine for Subject 04 (Power Systems), computing bus admittance matrices ($Y_{\text{bus}}$), line losses, fault currents, and voltage stability margins.
* **Hardware & Dependencies:** Python 3, NumPy, SciPy, pandas, networkx.
* **Relevant EE Subjects:** Power Systems (GATE EE Topic 04).
* **Commercial Considerations:** Permissive BSD 3-Clause.

### 12. `PyPSA/PyPSA`
* **Official URL:** [https://github.com/PyPSA/PyPSA](https://github.com/PyPSA/PyPSA)
* **Main Functionality:** Python for Power System Analysis. Open-source tool for simulating and optimizing modern energy grids across multiple time periods, including renewable wind/solar integration, storage dispatch, and linear optimal power flow.
* **Programming Language:** Python 3.
* **Licence:** MIT License.
* **Integration Possibilities:** Industrial and renewable energy case studies (Practical Engineering Laboratory), demonstrating real-world grid dynamics and battery energy storage system (BESS) dispatch.
* **Hardware & Dependencies:** Python 3, numerical linear solvers (HiGHS, GLPK, or Cbc).
* **Relevant EE Subjects:** Power Systems, Renewable Energy Systems, Industrial Applications.
* **Commercial Considerations:** Permissive MIT license.

---

## 3. Phased Integration Roadmap

```
[Phase 1: Pure Frontend Enhancement] (Active)
   ├── MathJax 3.x      --> Clean LaTeX rendering for all 17-point workspace equations
   ├── Math.js 12.x     --> Unit & dimensional checking, symbolic evaluation
   ├── Plotly.js 2.x    --> Scientific oscilloscope graphs, zoom, pan, export
   └── Mermaid 10.x     --> Dynamic prerequisite trees & concept flowcharts

[Phase 2: Offline Verification & Diagram Pipeline]
   ├── SymPy            --> Automated analytical ODE & Laplace solver
   ├── Lcapy            --> Symbolic circuit transfer function derivation
   └── Schemdraw        --> Automated IEEE/IEC vector SVG schematic generation

[Phase 3: Interactive Exploration & Control Systems]
   ├── Python-Control   --> Bode plots, Nyquist, and Root Locus engines
   └── CircuitJS1       --> Sandboxed iframe for open circuit experimentation

[Phase 4: Heavy Scientific Computing]
   ├── PySpice          --> Non-ideal transient & semiconductor validation
   ├── pandapower       --> 3-phase load flow, fault calculation (IEC 60909)
   └── PyPSA            --> Renewable integration & industrial power systems
```

---

## 4. Scientific Validation Layer Specification

To enforce our core principle—**Accuracy First, Zero Unverified Calculations**—every numerical simulation and practice problem must pass an automated validation checklist:

1. **Equation Verification:** Mathematical formulation must be checked against closed-form symbolic solutions (SymPy / Lcapy).
2. **Dimensional & Unit Consistency:** Physical quantities must be validated using `math.unit()` (e.g. $[R][C] = [\Omega][\text{F}] = [\text{s}]$).
3. **Boundary & Limiting Cases:**
   - $t \to 0^+$: Voltage continuity $v_C(0^+) = v_C(0^-)$.
   - $t \to \infty$: Capacitor acts as open circuit ($i(\infty) = 0$, $v_C(\infty) = V_s$).
   - $R \to 0$ or $R \to \infty$: Asymptotic behavior verified.
4. **Analytical vs. Numerical Error Threshold:** Numerical integration error must stay below $0.05\%$ against the exact analytical solution.
5. **Audit Record:** Test results must be logged in `test/` verification reports before publication.
6. **Human Review Sign-off:** Every question must have instructor sign-off acknowledging verified derivations.
