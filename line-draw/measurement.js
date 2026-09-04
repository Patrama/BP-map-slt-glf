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

    this.touchStartPos = null;
    this.cursorStartPos = null;

    this.isSnapEnabled = false;
    this.dimensionMode = true; // Default to true per requirements
    this.isSimulateCursorEnabled = DRAW_CONFIG.cursor?.defaultEnabled ?? true;
    this.referenceSVG = null;

    this.initDOM();
    this.applyPaletteColors();
    this.initSVGOverlay();
    this.bindEvents();
    this.updateMenuAndMeasurementStates();
  }

  applyPaletteColors() {
    // Override CSS root variables if provided in DRAW_CONFIG.palette
    // This ensures #measure-display-box stacks pull colors from config
    const root = document.documentElement;
    const palette = DRAW_CONFIG.palette || {};
    if (palette.widthColor) {
      root.style.setProperty("--color-measure-width", palette.widthColor);
    }
    if (palette.lengthColor) {
      root.style.setProperty("--color-measure-length", palette.lengthColor);
    }
    if (palette.diagColor) {
      root.style.setProperty("--color-measure-diag", palette.diagColor);
    }
  }

  initDOM() {
    this.controlContainer = document.createElement("div");
    this.controlContainer.id = "measurement-control-container";

    // Order: Snap CB -> Dim CB -> Cursor CB -> Measurement CB
    this.controlContainer.innerHTML = `
      <div class="control-item" id="snap-control-item" style="display: none;">
        <input type="checkbox" id="snap-cb" disabled />
        <label for="snap-cb">🧲</label>
      </div>
      <div class="control-item" id="dim-control-item" style="display: none;">
        <input type="checkbox" id="dim-cb" checked />
        <label for="dim-cb" id="dim-label">Luas ✔️</label>
      </div>
      <div class="control-item" id="cursor-control-item" style="display: none;">
        <input type="checkbox" id="sim-cursor-cb" ${this.isSimulateCursorEnabled ? "checked" : ""} />
        <label for="sim-cursor-cb">Cursor 🎯</label>
      </div>
      <div class="control-item">
        <input type="checkbox" id="measurement-cb" disabled />
        <label for="measurement-cb">Measurement 📐</label>
      </div>
    `;
    document.body.appendChild(this.controlContainer);

    this.displayBox = document.createElement("div");
    this.displayBox.id = "measure-display-box";
    document.body.appendChild(this.displayBox);

    this.triggerBtn = document.createElement("button");
    this.triggerBtn.id = "trigger-action-btn";
    this.triggerBtn.textContent = "#";
    this.triggerBtn.setAttribute("aria-label", "Trigger Target Action");
    document.body.appendChild(this.triggerBtn);

    // Elements
    this.snapControlItem = document.getElementById("snap-control-item");
    this.dimControlItem = document.getElementById("dim-control-item");
    this.cursorControlItem = document.getElementById("cursor-control-item");

    this.snapCb = document.getElementById("snap-cb");
    this.dimCb = document.getElementById("dim-cb");
    this.dimLabel = document.getElementById("dim-label");
    this.measureCb = document.getElementById("measurement-cb");
    this.simCursorCb = document.getElementById("sim-cursor-cb");
  }

  initSVGOverlay() {
    this.svgOverlay = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );
    this.svgOverlay.classList.add("measure-svg-overlay");

    const getWidthColor = () =>
      DRAW_CONFIG.palette?.widthColor || "var(--color-measure-width)";
    const getLengthColor = () =>
      DRAW_CONFIG.palette?.lengthColor || "var(--color-measure-length)";
    const getDiagColor = () =>
      DRAW_CONFIG.palette?.diagColor || "var(--color-measure-diag)";

    // Single Line Mode (dimMode = FALSE)
    this.line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.line.setAttribute("stroke", getDiagColor());
    this.line.setAttribute("stroke-width", DRAW_CONFIG.style.lineWidth);
    if (DRAW_CONFIG.style.linecap) {
      this.line.setAttribute("stroke-linecap", DRAW_CONFIG.style.linecap);
    }
    this.line.setAttribute("stroke-dasharray", DRAW_CONFIG.style.lineDashArray);
    this.line.setAttribute("vector-effect", "non-scaling-stroke");
    this.line.style.display = "none";

    // Horizontal Edges (Width)
    this.widthTop = this._createDashedLine(getWidthColor());
    this.widthBottom = this._createDashedLine(getWidthColor());

    // Vertical Edges (Length)
    this.lengthLeft = this._createDashedLine(getLengthColor());
    this.lengthRight = this._createDashedLine(getLengthColor());

    // Diagonal Line inside Bounding Box
    this.diagLine = this._createDashedLine(getDiagColor());

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

    this.cursorGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g",
    );
    this.cursorGroup.style.display = "none";

    const strokeColor = DRAW_CONFIG.style.cursorColor;
    const dotColor = DRAW_CONFIG.style.cursorDotColor || "#ffff00";
    const strokeWidth = DRAW_CONFIG.style.cursorStrokeWidth || 1;
    const dotRadius = DRAW_CONFIG.style.cursorDotRadius || 1.5;

    this.cursorHLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    this.cursorHLine.setAttribute("stroke", strokeColor);
    this.cursorHLine.setAttribute("stroke-width", strokeWidth);
    this.cursorHLine.setAttribute("vector-effect", "non-scaling-stroke");

    this.cursorVLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    this.cursorVLine.setAttribute("stroke", strokeColor);
    this.cursorVLine.setAttribute("stroke-width", strokeWidth);
    this.cursorVLine.setAttribute("vector-effect", "non-scaling-stroke");

    this.cursorDot = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    this.cursorDot.setAttribute("r", dotRadius);
    this.cursorDot.setAttribute("fill", dotColor);
    this.cursorDot.setAttribute("vector-effect", "non-scaling-stroke");

    this.cursorGroup.appendChild(this.cursorHLine);
    this.cursorGroup.appendChild(this.cursorVLine);
    this.cursorGroup.appendChild(this.cursorDot);

    this.svgOverlay.appendChild(this.line);
    this.svgOverlay.appendChild(this.widthTop);
    this.svgOverlay.appendChild(this.widthBottom);
    this.svgOverlay.appendChild(this.lengthLeft);
    this.svgOverlay.appendChild(this.lengthRight);
    this.svgOverlay.appendChild(this.diagLine);
    this.svgOverlay.appendChild(this.startHandle);
    this.svgOverlay.appendChild(this.endHandle);
    this.svgOverlay.appendChild(this.cursorGroup);

    this.stage.appendChild(this.svgOverlay);
  }

  /** Helper: create a dashed measurement line with consistent styling */
  _createDashedLine(strokeColor) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("stroke", strokeColor);
    line.setAttribute("stroke-width", DRAW_CONFIG.style.lineWidth);
    if (DRAW_CONFIG.style.linecap) {
      line.setAttribute("stroke-linecap", DRAW_CONFIG.style.linecap);
    }
    line.setAttribute("stroke-dasharray", DRAW_CONFIG.style.lineDashArray);
    line.setAttribute("vector-effect", "non-scaling-stroke");
    line.style.display = "none";
    return line;
  }

  /** Helper: create a dashed measurement line with consistent styling */
  _createDashedLine(strokeColor) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("stroke", strokeColor);
    line.setAttribute("stroke-width", DRAW_CONFIG.style.lineWidth);
    line.setAttribute("stroke-dasharray", DRAW_CONFIG.style.lineDashArray);
    line.setAttribute("vector-effect", "non-scaling-stroke");
    line.style.display = "none";
    return line;
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

    // 1. #measurement-cb controls attached state of sub-CBs
    this.measureCb.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      if (isChecked) {
        this.snapControlItem.style.display = "flex";
        this.dimControlItem.style.display = "flex";
        this.cursorControlItem.style.display = "flex";
        this.syncDimAndSnapState();
        this.enable();
      } else {
        this.snapControlItem.style.display = "none";
        this.dimControlItem.style.display = "none";
        this.cursorControlItem.style.display = "none";
        this.disable();
      }
    });

    // 2. #dim-cb toggles dimension vs single line mode
    this.dimCb.addEventListener("change", (e) => {
      this.dimensionMode = e.target.checked;
      this.dimLabel.textContent = this.dimensionMode ? "Luas ✔️" : "Line ✔️";
      this.syncDimAndSnapState();
      this.clearLine();
    });

    this.snapCb.addEventListener("change", (e) => {
      this.isSnapEnabled = e.target.checked;
    });

    this.simCursorCb.addEventListener("change", (e) => {
      this.isSimulateCursorEnabled = e.target.checked;
      this.updateTriggerBtnVisibility();
      if (!this.isSimulateCursorEnabled) {
        this.cursorGroup.style.display = "none";
        this.simulatedCursorPoint = null;
      }
    });

    this.triggerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.handleTriggerAction();
    });

    this.viewport.addEventListener("click", (e) => this.handleCanvasClick(e));
    this.viewport.addEventListener("mousemove", (e) =>
      this.handleCanvasMouseMove(e),
    );

    this.viewport.addEventListener(
      "touchstart",
      (e) => {
        if (!this.appState.isMeasuring || e.touches.length !== 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        const currentStagePt = this.getStageCoordinates(touch);

        if (this.isSimulateCursorEnabled) {
          if (!this.simulatedCursorPoint) {
            this.simulatedCursorPoint = currentStagePt;
            this.renderSimulatedCursor(this.simulatedCursorPoint);
          }
          this.touchStartPos = { x: touch.clientX, y: touch.clientY };
          this.cursorStartPos = { ...this.simulatedCursorPoint };
        } else {
          this.commitPoint(currentStagePt);
        }
      },
      { passive: false },
    );

    this.viewport.addEventListener(
      "touchmove",
      (e) => {
        if (!this.appState.isMeasuring || e.touches.length !== 1) return;
        e.preventDefault();
        const touch = e.touches[0];

        if (this.isSimulateCursorEnabled && this.touchStartPos) {
          const deltaX = touch.clientX - this.touchStartPos.x;
          const deltaY = touch.clientY - this.touchStartPos.y;
          const scale = this.getStageScale();

          this.simulatedCursorPoint = {
            x: this.cursorStartPos.x + deltaX * scale.x,
            y: this.cursorStartPos.y + deltaY * scale.y,
          };

          this.renderSimulatedCursor(this.simulatedCursorPoint);
          this.updateActiveMeasurementLine();
        }
      },
      { passive: false },
    );

    this.viewport.addEventListener("touchend", () => {
      this.touchStartPos = null;
      this.cursorStartPos = null;
    });
  }

  /**
   * Synchronizes #snap-cb according to #dim-cb:
   * - #dim-cb = true  -> forces #snap-cb = false and grayed (disabled)
   * - #dim-cb = false -> forces #snap-cb = true and active (not grayed)
   */
  syncDimAndSnapState() {
    if (this.dimensionMode) {
      this.snapCb.checked = false;
      this.snapCb.disabled = true;
      this.isSnapEnabled = false;
    } else {
      this.snapCb.checked = true;
      this.snapCb.disabled = false;
      this.isSnapEnabled = true;
    }
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
      if (par) this.svgOverlay.setAttribute("preserveAspectRatio", par);
    }
  }

  getStageScale() {
    if (this.referenceSVG && this.svgOverlay.getScreenCTM) {
      const ctm = this.svgOverlay.getScreenCTM();
      if (ctm) return { x: 1 / ctm.a, y: 1 / ctm.d };
    }
    return {
      x: 1 / (this.appState.zoom || 1),
      y: 1 / (this.appState.zoom || 1),
    };
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
    this.displayBox.style.display = "flex";
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

    this._resetLine(this.line);
    this._resetLine(this.widthTop);
    this._resetLine(this.widthBottom);
    this._resetLine(this.lengthLeft);
    this._resetLine(this.lengthRight);
    this._resetLine(this.diagLine);

    this.startHandle.style.display = "none";
    this.endHandle.style.display = "none";
    this.displayBox.innerHTML = "";
  }

  _resetLine(el) {
    el.setAttribute("x1", "0");
    el.setAttribute("y1", "0");
    el.setAttribute("x2", "0");
    el.setAttribute("y2", "0");
    el.style.display = "none";
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

    this.cursorDot.setAttribute("cx", point.x);
    this.cursorDot.setAttribute("cy", point.y);
    this.cursorGroup.style.display = "block";
  }

  applySnapPoint(start, current) {
    if (!this.isSnapEnabled || !start) return current;
    const dx = Math.abs(current.x - start.x);
    const dy = Math.abs(current.y - start.y);
    return dx > dy
      ? { x: current.x, y: start.y }
      : { x: start.x, y: current.y };
  }

  handleCanvasClick(e) {
    if (!this.appState.isMeasuring) return;
    const point = this.getStageCoordinates(e);

    // Always update simulated cursor when enabled (visual crosshair)
    if (this.isSimulateCursorEnabled) {
      this.simulatedCursorPoint = point;
      this.renderSimulatedCursor(point);
      this.updateActiveMeasurementLine();
    }

    // Mouse / trackpad / stylus / pen: commit on canvas click.
    // Touch devices rely on #trigger-action-btn (touch events already call
    // preventDefault, so a synthetic click is suppressed). This restores free
    // placement on desktop while keeping the button as the primary commit
    // method for touch.
    this.commitPoint(point);
  }

  updateActiveMeasurementLine() {
    if (
      this.measureStartPoint &&
      !this.measureEndPoint &&
      this.simulatedCursorPoint
    ) {
      const targetPoint = this.applySnapPoint(
        this.measureStartPoint,
        this.simulatedCursorPoint,
      );
      this.drawGeometry(this.measureStartPoint, targetPoint);
      this.updateReadout(this.measureStartPoint, targetPoint);
    }
  }

  handleTriggerAction() {
    if (!this.appState.isMeasuring || !this.simulatedCursorPoint) return;
    this.commitPoint(this.simulatedCursorPoint);
  }

  commitPoint(point) {
    if (!this.measureStartPoint || this.measureEndPoint) {
      this.measureStartPoint = point;
      this.measureEndPoint = null;
      this.drawGeometry(point, point);

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
      this.drawGeometry(this.measureStartPoint, point);

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
    this.drawGeometry(this.measureStartPoint, currentPoint);

    this.endHandle.setAttribute("cx", currentPoint.x);
    this.endHandle.setAttribute("cy", currentPoint.y);

    this.updateReadout(this.measureStartPoint, currentPoint);
  }

  drawGeometry(p1, p2) {
    if (this.dimensionMode) {
      this.line.style.display = "none";
      this.widthTop.style.display = "block";
      this.widthBottom.style.display = "block";
      this.lengthLeft.style.display = "block";
      this.lengthRight.style.display = "block";
      this.diagLine.style.display = "block";

      const x1 = Math.min(p1.x, p2.x);
      const x2 = Math.max(p1.x, p2.x);
      const y1 = Math.min(p1.y, p2.y);
      const y2 = Math.max(p1.y, p2.y);

      // Horizontal edges (Width) – cyan from config
      this.widthTop.setAttribute("x1", x1);
      this.widthTop.setAttribute("y1", y1);
      this.widthTop.setAttribute("x2", x2);
      this.widthTop.setAttribute("y2", y1);

      this.widthBottom.setAttribute("x1", x1);
      this.widthBottom.setAttribute("y1", y2);
      this.widthBottom.setAttribute("x2", x2);
      this.widthBottom.setAttribute("y2", y2);

      // Vertical edges (Length) – orange from config
      this.lengthLeft.setAttribute("x1", x1);
      this.lengthLeft.setAttribute("y1", y1);
      this.lengthLeft.setAttribute("x2", x1);
      this.lengthLeft.setAttribute("y2", y2);

      this.lengthRight.setAttribute("x1", x2);
      this.lengthRight.setAttribute("y1", y1);
      this.lengthRight.setAttribute("x2", x2);
      this.lengthRight.setAttribute("y2", y2);

      this.diagLine.setAttribute("x1", p1.x);
      this.diagLine.setAttribute("y1", p1.y);
      this.diagLine.setAttribute("x2", p2.x);
      this.diagLine.setAttribute("y2", p2.y);
    } else {
      // Draw Single Straight Line
      this.widthTop.style.display = "none";
      this.widthBottom.style.display = "none";
      this.lengthLeft.style.display = "none";
      this.lengthRight.style.display = "none";
      this.diagLine.style.display = "none";
      this.line.style.display = "block";

      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);
      const getWidthColor = () =>
        DRAW_CONFIG.palette?.widthColor || "var(--color-measure-width)";
      const getLengthColor = () =>
        DRAW_CONFIG.palette?.lengthColor || "var(--color-measure-length)";
      const getDiagColor = () =>
        DRAW_CONFIG.palette?.diagColor || "var(--color-measure-diag)";

      // Dynamically color line based on axis direction in single line mode
      if (dy === 0) {
        this.line.setAttribute("stroke", getWidthColor());
      } else if (dx === 0) {
        this.line.setAttribute("stroke", getLengthColor());
      } else {
        this.line.setAttribute("stroke", getDiagColor());
      }

      this.line.setAttribute("x1", p1.x);
      this.line.setAttribute("y1", p1.y);
      this.line.setAttribute("x2", p2.x);
      this.line.setAttribute("y2", p2.y);
    }
  }

  updateReadout(p1, p2) {
    const scale = DRAW_CONFIG.scale.svgUnitsPerMeter;
    const dx = Math.abs(p2.x - p1.x);
    const dy = Math.abs(p2.y - p1.y);

    const absWidthM = dx / scale;
    const absLengthM = dy / scale;
    const absDiagM = Math.hypot(dx, dy) / scale;

    const formatValues = (valInM) => {
      const m = valInM.toFixed(2);
      const cm = (valInM * 100).toFixed(1);
      const mm = Math.round(valInM * 1000);
      return `${m} m | ${cm} cm | ${mm} mm`;
    };

    if (this.dimensionMode) {
      // #dim-cb = TRUE: Always show 3 stacks (Width, Length, Diagonal)
      // Colors come from CSS variables set by applyPaletteColors() from DRAW_CONFIG
      this.displayBox.innerHTML = `
        <div class="measure-stack width-stack">
          <span class="measure-title">Lebar 📏:</span>
          <span>${formatValues(absWidthM)}</span>
        </div>
        <div class="measure-stack length-stack">
          <span class="measure-title">Panjang 📏:</span>
          <span>${formatValues(absLengthM)}</span>
        </div>
        <div class="measure-stack diag-stack">
          <span class="measure-title">Diagonal 📐:</span>
          <span>${formatValues(absDiagM)}</span>
        </div>
      `;
    } else {
      // #dim-cb = FALSE: Single stack dynamically detected by axis delta
      if (dy === 0) {
        this.displayBox.innerHTML = `
          <div class="measure-stack width-stack">
            <span class="measure-title">Lebar 📏:</span>
            <span>${formatValues(absWidthM)}</span>
          </div>
        `;
      } else if (dx === 0) {
        this.displayBox.innerHTML = `
          <div class="measure-stack length-stack">
            <span class="measure-title">Panjang 📏:</span>
            <span>${formatValues(absLengthM)}</span>
          </div>
        `;
      } else {
        this.displayBox.innerHTML = `
          <div class="measure-stack diag-stack">
            <span class="measure-title">Diagonal 📐:</span>
            <span>${formatValues(absDiagM)}</span>
          </div>
        `;
      }
    }
  }
}
