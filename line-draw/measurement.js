/** @format */

import { DRAW_CONFIG } from "./draw_CONFIG.js";

export class MeasurementTool {
  constructor(viewport, stage, leftMenu, sidebarToggle, state) {
    this.viewport = viewport;
    this.stage = stage;
    this.leftMenu = leftMenu;
    this.sidebarToggle = sidebarToggle;
    this.appState = state;

    this.measureStartPoint = null;
    this.measureEndPoint = null;
    this.isSnapEnabled = DRAW_CONFIG.snap.defaultEnabled;
    this.referenceSVG = null; // used for consistent SVG-user-space coordinates

    this.initDOM();
    this.initSVGOverlay();
    this.bindEvents();
    this.updateMenuAndMeasurementStates();
  }

  initDOM() {
    // Top-right controls (Measurement + Snap)
    this.controlContainer = document.createElement("div");
    this.controlContainer.id = "measurement-control-container";
    this.controlContainer.innerHTML = `
      <div class="control-item">
        <input type="checkbox" id="snap-cb" ${this.isSnapEnabled ? "checked" : ""} />
        <label for="snap-cb">Snap 🧲</label>
      </div>
      <div class="control-item">
        <input type="checkbox" id="measurement-cb" disabled />
        <label for="measurement-cb">Measurement 📐</label>
      </div>
    `;
    document.body.appendChild(this.controlContainer);

    // Readout box in top-left with stacked values
    this.displayBox = document.createElement("div");
    this.displayBox.id = "measure-display-box";
    this.displayBox.innerHTML = `
      <div class="measure-title">MEASUREMENT</div>
      <div id="measure-values">
        <span class="measure-row"><strong>0.00</strong> M</span>
        <span class="measure-row"><strong>0.0</strong> CM</span>
        <span class="measure-row"><strong>0</strong> MM</span>
      </div>
    `;
    document.body.appendChild(this.displayBox);

    this.measureCb = document.getElementById("measurement-cb");
    this.snapCb = document.getElementById("snap-cb");
    this.measureValues = document.getElementById("measure-values");
  }

  initSVGOverlay() {
    this.svgOverlay = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.svgOverlay.classList.add("measure-svg-overlay");

    this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.line.setAttribute("stroke", DRAW_CONFIG.style.lineColor);
    this.line.setAttribute("stroke-width", DRAW_CONFIG.style.lineWidth);
    this.line.setAttribute("stroke-dasharray", DRAW_CONFIG.style.lineDashArray);
    // Keep visual thickness constant regardless of viewBox scale / zoom
    this.line.setAttribute("vector-effect", "non-scaling-stroke");

    this.startHandle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this.startHandle.setAttribute("r", DRAW_CONFIG.style.handleRadius);
    this.startHandle.setAttribute("fill", DRAW_CONFIG.style.handleColor);
    this.startHandle.setAttribute("vector-effect", "non-scaling-stroke");
    this.startHandle.style.display = "none";

    this.endHandle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this.endHandle.setAttribute("r", DRAW_CONFIG.style.handleRadius);
    this.endHandle.setAttribute("fill", DRAW_CONFIG.style.handleColor);
    this.endHandle.setAttribute("vector-effect", "non-scaling-stroke");
    this.endHandle.style.display = "none";

    this.svgOverlay.appendChild(this.line);
    this.svgOverlay.appendChild(this.startHandle);
    this.svgOverlay.appendChild(this.endHandle);
    this.stage.appendChild(this.svgOverlay);
  }

  /**
   * Sync the measurement overlay to the same coordinate system as the
   * blueprint SVGs. This makes measured distances independent of viewport
   * size, device, zoom, and aspect-ratio changes.
   */
  syncCoordinateSystem() {
    if (this.referenceSVG) return;

    const svg = this.stage.querySelector(".svg-layer svg");
    if (!svg) return;

    this.referenceSVG = svg;

    // Prefer the explicit viewBox when present (design units)
    if (svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width > 0) {
      const vb = svg.viewBox.baseVal;
      this.svgOverlay.setAttribute(
        "viewBox",
        `${vb.x} ${vb.y} ${vb.width} ${vb.height}`,
      );
      const par = svg.getAttribute("preserveAspectRatio");
      if (par) {
        this.svgOverlay.setAttribute("preserveAspectRatio", par);
      }
    }
  }

  bindEvents() {
    this.sidebarToggle.addEventListener("click", (e) => {
      if (this.measureCb.checked) {
        e.stopPropagation();
        alert("Please uncheck 'Measurement' mode before opening the menu. ⚠️");
        return;
      }
      this.updateMenuAndMeasurementStates();
    });

    this.measureCb.addEventListener("change", (e) => {
      if (e.target.checked) {
        this.enable();
      } else {
        this.disable();
      }
    });

    this.snapCb.addEventListener("change", (e) => {
      this.isSnapEnabled = e.target.checked;
    });

    this.viewport.addEventListener("click", (e) => this.handleCanvasClick(e));
    this.viewport.addEventListener("mousemove", (e) =>
      this.handleCanvasMouseMove(e),
    );

    // Touch support for measurement (pan/zoom is already blocked while measuring)
    this.viewport.addEventListener(
      "touchstart",
      (e) => {
        if (!this.appState.isMeasuring || e.touches.length !== 1) return;
        e.preventDefault();
        this.handleCanvasClick(e.touches[0]);
      },
      { passive: false },
    );
    this.viewport.addEventListener(
      "touchmove",
      (e) => {
        if (!this.appState.isMeasuring || e.touches.length !== 1) return;
        e.preventDefault();
        this.handleCanvasMouseMove(e.touches[0]);
      },
      { passive: false },
    );
  }

  updateMenuAndMeasurementStates() {
    setTimeout(() => {
      const isMenuOpen = this.leftMenu.classList.contains("open");
      this.measureCb.disabled = isMenuOpen;
      if (isMenuOpen && this.measureCb.checked) {
        this.measureCb.checked = false;
        this.disable();
      }
    }, 0);
  }

  enable() {
    this.appState.isMeasuring = true;
    this.viewport.style.cursor = "crosshair";
    this.displayBox.style.display = "block";
    this.syncCoordinateSystem(); // ensure viewBox is ready before first click
    this.clearLine();
  }

  disable() {
    this.appState.isMeasuring = false;
    this.viewport.style.cursor = "default";
    this.displayBox.style.display = "none";
    this.clearLine();
  }

  clearLine() {
    this.measureStartPoint = null;
    this.measureEndPoint = null;
    this.line.setAttribute("x1", "0");
    this.line.setAttribute("y1", "0");
    this.line.setAttribute("x2", "0");
    this.line.setAttribute("y2", "0");
    this.startHandle.style.display = "none";
    this.endHandle.style.display = "none";
    this.measureValues.innerHTML = `
      <span class="measure-row"><strong>0.00</strong> M</span>
      <span class="measure-row"><strong>0.0</strong> CM</span>
      <span class="measure-row"><strong>0</strong> MM</span>
    `;
  }

  getStageCoordinates(e) {
    this.syncCoordinateSystem();

    // Prefer mapping through the SVG user coordinate system so measurements
    // stay consistent across desktop, mobile, window resizes and zoom levels.
    if (this.referenceSVG && this.svgOverlay.getScreenCTM) {
      const ctm = this.svgOverlay.getScreenCTM();
      if (ctm) {
        const pt = this.svgOverlay.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const svgPt = pt.matrixTransform(ctm.inverse());
        return { x: svgPt.x, y: svgPt.y };
      }
    }

    // Fallback (should only happen before any SVG has loaded)
    const rect = this.stage.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / this.appState.zoom,
      y: (e.clientY - rect.top) / this.appState.zoom,
    };
  }

  applySnapPoint(start, current) {
    if (!this.isSnapEnabled || !start) return current;

    const dx = Math.abs(current.x - start.x);
    const dy = Math.abs(current.y - start.y);

    if (dx > dy) {
      return { x: current.x, y: start.y };
    } else {
      return { x: start.x, y: current.y };
    }
  }

  calculateUnits(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const svgCoordinateDistance = Math.sqrt(dx * dx + dy * dy);

    const meters = svgCoordinateDistance / DRAW_CONFIG.scale.svgUnitsPerMeter;
    const centimeters = meters * 100;
    const millimeters = meters * 1000;

    return {
      m: meters.toFixed(2),
      cm: centimeters.toFixed(1),
      mm: Math.round(millimeters),
    };
  }

  handleCanvasClick(e) {
    if (!this.appState.isMeasuring) return;

    let point = this.getStageCoordinates(e);

    if (!this.measureStartPoint || this.measureEndPoint) {
      this.measureStartPoint = point;
      this.measureEndPoint = null;

      this.line.setAttribute("x1", point.x);
      this.line.setAttribute("y1", point.y);
      this.line.setAttribute("x2", point.x);
      this.line.setAttribute("y2", point.y);

      this.startHandle.setAttribute("cx", point.x);
      this.startHandle.setAttribute("cy", point.y);
      this.startHandle.style.display = "block";

      this.endHandle.setAttribute("cx", point.x);
      this.endHandle.setAttribute("cy", point.y);
      this.endHandle.style.display = "block";

      this.updateReadout(point, point);
    } else {
      point = this.applySnapPoint(this.measureStartPoint, point);
      this.measureEndPoint = point;

      this.line.setAttribute("x2", point.x);
      this.line.setAttribute("y2", point.y);
      this.endHandle.setAttribute("cx", point.x);
      this.endHandle.setAttribute("cy", point.y);

      this.updateReadout(this.measureStartPoint, point);
    }
  }

  handleCanvasMouseMove(e) {
    if (
      !this.appState.isMeasuring ||
      !this.measureStartPoint ||
      this.measureEndPoint
    )
      return;

    let currentPoint = this.getStageCoordinates(e);
    currentPoint = this.applySnapPoint(this.measureStartPoint, currentPoint);

    this.line.setAttribute("x2", currentPoint.x);
    this.line.setAttribute("y2", currentPoint.y);
    this.endHandle.setAttribute("cx", currentPoint.x);
    this.endHandle.setAttribute("cy", currentPoint.y);

    this.updateReadout(this.measureStartPoint, currentPoint);
  }

  updateReadout(p1, p2) {
    const units = this.calculateUnits(p1, p2);
    this.measureValues.innerHTML = `
      <span class="measure-row"><strong>${units.m}</strong> M</span>
      <span class="measure-row"><strong>${units.cm}</strong> CM</span>
      <span class="measure-row"><strong>${units.mm}</strong> MM</span>
    `;
  }
}
