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
    this.simulatedCursorPoint = null;

    this.isSnapEnabled = DRAW_CONFIG.snap.defaultEnabled;
    this.isSimulateCursorEnabled = false;
    this.referenceSVG = null;

    this.initDOM();
    this.initSVGOverlay();
    this.bindEvents();
    this.updateMenuAndMeasurementStates();
  }

  initDOM() {
    // Controls Bar (Snap 🧲 | Cursor 🎯 | Measurement 📐)
    this.controlContainer = document.createElement("div");
    this.controlContainer.id = "measurement-control-container";
    this.controlContainer.innerHTML = `
      <div class="control-item">
        <input type="checkbox" id="snap-cb" ${this.isSnapEnabled ? "checked" : ""} />
        <label for="snap-cb">Snap 🧲</label>
      </div>
      <div class="control-item">
        <input type="checkbox" id="sim-cursor-cb" disabled />
        <label for="sim-cursor-cb">Cursor 🎯</label>
      </div>
      <div class="control-item">
        <input type="checkbox" id="measurement-cb" disabled />
        <label for="measurement-cb">Measurement 📐</label>
      </div>
    `;
    document.body.appendChild(this.controlContainer);

    // Readout Display Box
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

    // Floating Trigger Action Button (#)
    this.triggerBtn = document.createElement("button");
    this.triggerBtn.id = "trigger-action-btn";
    this.triggerBtn.textContent = "#";
    this.triggerBtn.setAttribute("aria-label", "Trigger Target Action");
    document.body.appendChild(this.triggerBtn);

    this.measureCb = document.getElementById("measurement-cb");
    this.simCursorCb = document.getElementById("sim-cursor-cb");
    this.snapCb = document.getElementById("snap-cb");
    this.measureValues = document.getElementById("measure-values");
  }

  initSVGOverlay() {
    this.svgOverlay = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.svgOverlay.classList.add("measure-svg-overlay");

    // Line
    this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.line.setAttribute("stroke", DRAW_CONFIG.style.lineColor);
    this.line.setAttribute("stroke-width", DRAW_CONFIG.style.lineWidth);
    this.line.setAttribute("stroke-dasharray", DRAW_CONFIG.style.lineDashArray);
    this.line.setAttribute("vector-effect", "non-scaling-stroke");

    // Start Handle
    this.startHandle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this.startHandle.setAttribute("r", DRAW_CONFIG.style.handleRadius);
    this.startHandle.setAttribute("fill", DRAW_CONFIG.style.handleColor);
    this.startHandle.setAttribute("vector-effect", "non-scaling-stroke");
    this.startHandle.style.display = "none";

    // End Handle
    this.endHandle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this.endHandle.setAttribute("r", DRAW_CONFIG.style.handleRadius);
    this.endHandle.setAttribute("fill", DRAW_CONFIG.style.handleColor);
    this.endHandle.setAttribute("vector-effect", "non-scaling-stroke");
    this.endHandle.style.display = "none";

    // 🎯 Crosshair Cursor Pointer (+) Group
    this.cursorGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    this.cursorGroup.style.display = "none";

    const arm = DRAW_CONFIG.style.cursorSize;
    const strokeColor = DRAW_CONFIG.style.cursorColor;

    this.cursorHLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    this.cursorHLine.setAttribute("stroke", strokeColor);
    this.cursorHLine.setAttribute("stroke-width", "2");
    this.cursorHLine.setAttribute("vector-effect", "non-scaling-stroke");

    this.cursorVLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    this.cursorVLine.setAttribute("stroke", strokeColor);
    this.cursorVLine.setAttribute("stroke-width", "2");
    this.cursorVLine.setAttribute("vector-effect", "non-scaling-stroke");

    this.cursorGroup.appendChild(this.cursorHLine);
    this.cursorGroup.appendChild(this.cursorVLine);

    this.svgOverlay.appendChild(this.line);
    this.svgOverlay.appendChild(this.startHandle);
    this.svgOverlay.appendChild(this.endHandle);
    this.svgOverlay.appendChild(this.cursorGroup);

    this.stage.appendChild(this.svgOverlay);
  }

  syncCoordinateSystem() {
    if (this.referenceSVG) return;

    const svg = this.stage.querySelector(".svg-layer svg");
    if (!svg) return;

    this.referenceSVG = svg;

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

    this.simCursorCb.addEventListener("change", (e) => {
      this.isSimulateCursorEnabled = e.target.checked;
      this.updateTriggerBtnVisibility();
      if (!this.isSimulateCursorEnabled) {
        this.cursorGroup.style.display = "none";
        this.simulatedCursorPoint = null;
      }
    });

    this.snapCb.addEventListener("change", (e) => {
      this.isSnapEnabled = e.target.checked;
    });

    // 🎯 Trigger Button (#) Click Action
    this.triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.handleTriggerAction();
    });

    // Viewport Interactions
    this.viewport.addEventListener("click", (e) => this.handleCanvasClick(e));
    this.viewport.addEventListener("mousemove", (e) =>
      this.handleCanvasMouseMove(e),
    );

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
      this.simCursorCb.disabled = isMenuOpen;

      if (isMenuOpen && this.measureCb.checked) {
        this.measureCb.checked = false;
        this.disable();
      }

      this.updateTriggerBtnVisibility();
    }, 0);
  }

  updateTriggerBtnVisibility() {
    const isMenuOpen = this.leftMenu.classList.contains("open");
    if (
      this.appState.isMeasuring &&
      this.isSimulateCursorEnabled &&
      !isMenuOpen
    ) {
      this.triggerBtn.style.display = "flex";
    } else {
      this.triggerBtn.style.display = "none";
    }
  }

  enable() {
    this.appState.isMeasuring = true;
    this.viewport.style.cursor = "crosshair";
    this.displayBox.style.display = "block";
    this.syncCoordinateSystem();
    this.clearLine();
    this.updateTriggerBtnVisibility();
  }

  disable() {
    this.appState.isMeasuring = false;
    this.viewport.style.cursor = "default";
    this.displayBox.style.display = "none";
    this.cursorGroup.style.display = "none";
    this.simulatedCursorPoint = null;
    this.clearLine();
    this.updateTriggerBtnVisibility();
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

    const rect = this.stage.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / this.appState.zoom,
      y: (e.clientY - rect.top) / this.appState.zoom,
    };
  }

  renderSimulatedCursor(point) {
    const arm = DRAW_CONFIG.style.cursorSize;
    this.cursorHLine.setAttribute("x1", point.x - arm);
    this.cursorHLine.setAttribute("y1", point.y);
    this.cursorHLine.setAttribute("x2", point.x + arm);
    this.cursorHLine.setAttribute("y2", point.y);

    this.cursorVLine.setAttribute("x1", point.x);
    this.cursorVLine.setAttribute("y1", point.y - arm);
    this.cursorVLine.setAttribute("x2", point.x);
    this.cursorVLine.setAttribute("y2", point.y + arm);

    this.cursorGroup.style.display = "block";
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

    // 🎯 SIMULATE CURSOR MODE: Reposition cursor crosshair without setting points
    if (this.isSimulateCursorEnabled) {
      this.simulatedCursorPoint = point;
      this.renderSimulatedCursor(point);

      // If already drawing, update end point dynamically to target cursor
      if (this.measureStartPoint && !this.measureEndPoint) {
        const targetPoint = this.applySnapPoint(
          this.measureStartPoint,
          this.simulatedCursorPoint,
        );
        this.line.setAttribute("x2", targetPoint.x);
        this.line.setAttribute("y2", targetPoint.y);
        this.endHandle.setAttribute("cx", targetPoint.x);
        this.endHandle.setAttribute("cy", targetPoint.y);
        this.updateReadout(this.measureStartPoint, targetPoint);
      }
      return;
    }

    // NORMAL MODE: Set start / end points directly via tap
    this.commitPoint(point);
  }

  // 🎯 Action triggered when tapping `#`
  handleTriggerAction() {
    if (!this.appState.isMeasuring || !this.simulatedCursorPoint) return;
    this.commitPoint(this.simulatedCursorPoint);
  }

  commitPoint(point) {
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
    if (!this.appState.isMeasuring) return;

    let currentPoint = this.getStageCoordinates(e);

    if (this.isSimulateCursorEnabled) {
      this.simulatedCursorPoint = currentPoint;
      this.renderSimulatedCursor(currentPoint);
    }

    if (!this.measureStartPoint || this.measureEndPoint) return;

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
