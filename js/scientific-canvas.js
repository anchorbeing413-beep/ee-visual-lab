/**
 * ============================================================================
 * EE VISUAL LAB - HIGH PRECISION SCIENTIFIC OSCILLOSCOPE CANVAS
 * Dual-trace (Voltage & Current), grid divisions, tau markers & interactive crosshairs
 * ============================================================================
 */

class ScientificOscilloscope {
  constructor(canvasElement, cursorOverlayElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.cursorOverlay = cursorOverlayElement;
    this.dataset = null;
    this.engine = null;
    this.hoverPoint = null;

    this.padding = { top: 30, right: 35, bottom: 45, left: 60 };
    
    this.initEventListeners();
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.render();
    });
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);
  }

  initEventListeners() {
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.dataset || !this.engine) return;
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const plotLeft = this.padding.left;
      const plotRight = this.width - this.padding.right;

      if (mouseX >= plotLeft && mouseX <= plotRight) {
        const tFraction = (mouseX - plotLeft) / (plotRight - plotLeft);
        const t = tFraction * this.engine.maxTime;
        const v = this.engine.voltageAt(t);
        const i = this.engine.currentAt(t);
        const p = this.engine.powerAt(t);

        this.hoverPoint = { x: mouseX, y: mouseY, t, v, i, p };
        this.updateCursorOverlay();
      } else {
        this.hoverPoint = null;
        this.cursorOverlay.style.display = 'none';
      }
      this.render();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.hoverPoint = null;
      if (this.cursorOverlay) this.cursorOverlay.style.display = 'none';
      this.render();
    });
  }

  updateCursorOverlay() {
    if (!this.hoverPoint || !this.cursorOverlay) return;
    const { t, v, i, p } = this.hoverPoint;
    this.cursorOverlay.style.display = 'flex';
    this.cursorOverlay.innerHTML = `
      <div style="color: var(--text-dim); font-size: 0.7rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom:2px; margin-bottom:2px;">INSTANTANEOUS CURSOR</div>
      <div><span style="color: var(--accent-time);">t:</span> ${RCSimulatorEngine.formatSI(t, 's')}</div>
      <div><span style="color: var(--accent-voltage);">v_c(t):</span> ${v.toFixed(3)} V</div>
      <div><span style="color: var(--accent-current);">i(t):</span> ${RCSimulatorEngine.formatSI(i, 'A')}</div>
      <div><span style="color: var(--accent-power);">p(t):</span> ${RCSimulatorEngine.formatSI(p, 'W')}</div>
    `;
  }

  setEngineAndData(engine, dataset) {
    this.engine = engine;
    this.dataset = dataset;
    this.render();
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Clear background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, w, h);

    if (!this.dataset || !this.engine) return;

    const plotW = w - this.padding.left - this.padding.right;
    const plotH = h - this.padding.top - this.padding.bottom;
    const plotX = this.padding.left;
    const plotY = this.padding.top;

    // Draw Scientific Grid
    this.drawGrid(ctx, plotX, plotY, plotW, plotH);

    // Compute dynamic scales
    const maxV = Math.max(1, Math.abs(this.engine.Vs) * 1.15, Math.abs(this.engine.V0) * 1.15);
    const minV = this.engine.mode === 'discharge' ? 0 : Math.min(0, this.engine.V0);
    const vRange = maxV - minV;

    // Current scale (Amps)
    let maxI = 0.000001;
    for (let k = 0; k < this.dataset.current.length; k++) {
      const absI = Math.abs(this.dataset.current[k]);
      if (absI > maxI) maxI = absI;
    }
    maxI *= 1.2;

    const tMax = this.engine.maxTime;

    // Helper mapping functions
    const mapX = (t) => plotX + (t / tMax) * plotW;
    const mapY_V = (v) => plotY + plotH - ((v - minV) / vRange) * plotH;
    const mapY_I = (i) => plotY + (plotH / 2) - (i / maxI) * (plotH * 0.42);

    // Draw Tau Milestone Guidelines
    ctx.save();
    for (const marker of this.dataset.tauMarkers) {
      const mx = mapX(marker.t);
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 1;
      ctx.moveTo(mx, plotY);
      ctx.lineTo(mx, plotY + plotH);
      ctx.stroke();

      // Tau Label at top
      ctx.setLineDash([]);
      ctx.fillStyle = '#f59e0b';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      const label = marker.k === 1 ? '1τ (63.2%)' : `${marker.k}τ`;
      ctx.fillText(label, mx, plotY - 8);
    }
    ctx.restore();

    // 1. Draw Voltage Trace (Cyan #00f0ff)
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
    ctx.shadowBlur = 8;
    for (let i = 0; i < this.dataset.time.length; i++) {
      const x = mapX(this.dataset.time[i]);
      const y = mapY_V(this.dataset.voltage[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // 2. Draw Current Trace (Magenta #ff0055)
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.shadowColor = 'rgba(255, 0, 85, 0.5)';
    ctx.shadowBlur = 6;
    for (let i = 0; i < this.dataset.time.length; i++) {
      const x = mapX(this.dataset.time[i]);
      const y = mapY_I(this.dataset.current[i]);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();

    // Draw Crosshair on Hover
    if (this.hoverPoint) {
      const hx = this.hoverPoint.x;
      const hy_v = mapY_V(this.hoverPoint.v);

      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(hx, plotY);
      ctx.lineTo(hx, plotY + plotH);
      ctx.stroke();

      // Horizontal line to Vc
      ctx.beginPath();
      ctx.moveTo(plotX, hy_v);
      ctx.lineTo(plotX + plotW, hy_v);
      ctx.stroke();

      // Highlight target point dot
      ctx.setLineDash([]);
      ctx.fillStyle = '#00f0ff';
      ctx.beginPath();
      ctx.arc(hx, hy_v, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    // Draw Axis Numbers & SI Units
    this.drawAxisLabels(ctx, plotX, plotY, plotW, plotH, minV, maxV, maxI, tMax);
  }

  drawGrid(ctx, x, y, w, h) {
    ctx.save();
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
    ctx.lineWidth = 0.75;

    const xDivisions = 10;
    const yDivisions = 8;

    // Vertical grid lines
    for (let i = 0; i <= xDivisions; i++) {
      const gx = x + (i / xDivisions) * w;
      ctx.beginPath();
      ctx.moveTo(gx, y);
      ctx.lineTo(gx, y + h);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let j = 0; j <= yDivisions; j++) {
      const gy = y + (j / yDivisions) * h;
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + w, gy);
      ctx.stroke();
    }

    // Outer Border
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
  }

  drawAxisLabels(ctx, x, y, w, h, minV, maxV, maxI, tMax) {
    ctx.save();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';

    // X-axis Time Labels
    ctx.textAlign = 'center';
    const numXSteps = 5;
    for (let i = 0; i <= numXSteps; i++) {
      const t = (i / numXSteps) * tMax;
      const lx = x + (i / numXSteps) * w;
      ctx.fillText(RCSimulatorEngine.formatSI(t, 's'), lx, y + h + 18);
    }
    // X-axis Title
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('Time t (seconds) →', x + w / 2, y + h + 34);

    // Left Y-axis (Voltage)
    ctx.textAlign = 'right';
    const numYSteps = 4;
    for (let j = 0; j <= numYSteps; j++) {
      const vVal = minV + (j / numYSteps) * (maxV - minV);
      const ly = y + h - (j / numYSteps) * h;
      ctx.fillStyle = '#00f0ff';
      ctx.fillText(`${vVal.toFixed(1)}V`, x - 8, ly + 3);
    }

    // Right Y-axis (Current reference)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ff0055';
    ctx.fillText(`+${RCSimulatorEngine.formatSI(maxI, 'A')}`, x + w + 8, y + 12);
    ctx.fillText(`0 A`, x + w + 8, y + h / 2 + 3);
    ctx.fillText(`-${RCSimulatorEngine.formatSI(maxI, 'A')}`, x + w + 8, y + h - 5);

    ctx.restore();
  }
}

window.ScientificOscilloscope = ScientificOscilloscope;
