/** @format */

import { CONFIG, STRUCTURE_DATA } from "./CONFIG.js";

// Global Viewport State
const state = {
  zoom: 1,
  panX: 0,
  panY: 0,
  isDragging: false,
  startX: 0,
  startY: 0,
  activeSearchResults: [],
  savedCheckedStates: JSON.parse(
    localStorage.getItem("blueprint_layers") || "{}",
  ),
};

const stage = document.getElementById("svg-stage");
const viewport = document.getElementById("viewport-container");
const treeRoot = document.getElementById("tree-root");
const leftMenu = document.getElementById("left-menu");
const sidebarToggle = document.getElementById("sidebar-toggle");
const searchInput = document.getElementById("search-input");
const searchResultsContainer = document.getElementById(
  "search-results-container",
);
const toggleAllCb = document.getElementById("toggle-all-cb");
const toggleResultsCb = document.getElementById("toggle-results-cb");

// Toggle Sidebar Drawer
sidebarToggle.addEventListener("click", () => {
  leftMenu.classList.toggle("open");
  localStorage.setItem("sidebar_open", leftMenu.classList.contains("open"));
});

// Restore Sidebar State on Reload
if (localStorage.getItem("sidebar_open") === "false") {
  leftMenu.classList.remove("open");
}

function getFunctionalZIndex(node) {
  const identifier = `${node.id}_${node.svgPath || ""}`.toLowerCase();
  const map = CONFIG.zPriorityMap;

  if (identifier.includes("light")) return map.light;
  if (identifier.includes("label")) return map.label;
  if (identifier.includes("ac")) return map.ac;
  if (identifier.includes("grile") || identifier.includes("grille"))
    return map.grille;
  if (identifier.includes("sup") || identifier.includes("supply"))
    return map.supply;
  if (identifier.includes("ret") || identifier.includes("return"))
    return map.return;
  if (identifier.includes("ceiling")) return map.ceiling;
  if (identifier.includes("wall")) return map.wall;

  return 1;
}

/**
 * High-Performance Inline SVG Fetching (Eliminates Pixelation Blur)
 */
async function loadInlineSVG(url, container) {
  try {
    const res = await fetch(url);
    const svgText = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const svgEl = doc.querySelector("svg");

    if (svgEl) {
      svgEl.setAttribute("width", "100%");
      svgEl.setAttribute("height", "100%");
      svgEl.style.shapeRendering = "geometricPrecision";
      container.appendChild(svgEl);
    }
  } catch (err) {
    console.error(`Failed to load SVG: ${url}`, err);
  }
}

/**
 * Initializes Canvas Stage with Crisp Vector Elements
 */
function initSVGStage(nodes) {
  nodes.forEach((node) => {
    if (node.svgPath) {
      const computedZ = getFunctionalZIndex(node);

      const layer = document.createElement("div");
      layer.className = "svg-layer";
      layer.id = `layer-${node.id}`;
      layer.style.zIndex = computedZ;

      // Inline fetch SVG for infinite sharpness on zoom
      loadInlineSVG(node.svgPath, layer);
      stage.appendChild(layer);
    }

    if (node.children) {
      initSVGStage(node.children);
    }
  });
}

/**
 * Render Accordion Tree UI with Persistent Memory
 */
function renderAccordion(nodes, container, level = 0) {
  nodes.forEach((node) => {
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "tree-node";

    const isInitiallyChecked = state.savedCheckedStates[node.id] ?? false;

    if (node.children) {
      nodeDiv.classList.add("accordion-node");

      const header = document.createElement("div");
      header.className = "accordion-header";

      const titleGroup = document.createElement("div");
      titleGroup.className = "accordion-title-group";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `cb-${node.id}`;
      checkbox.checked = isInitiallyChecked;
      checkbox.addEventListener("click", (e) => e.stopPropagation());
      checkbox.addEventListener("change", (e) =>
        toggleCascade(node, e.target.checked),
      );

      titleGroup.appendChild(checkbox);
      titleGroup.appendChild(document.createTextNode(node.label));

      const chevron = document.createElement("span");
      chevron.className = "chevron";
      chevron.textContent = "▶";

      header.appendChild(titleGroup);
      header.appendChild(chevron);
      nodeDiv.appendChild(header);

      const content = document.createElement("div");
      content.className = "accordion-content";
      renderAccordion(node.children, content, level + 1);
      nodeDiv.appendChild(content);

      header.addEventListener("click", () => {
        const isOpen = nodeDiv.classList.contains("open");
        if (level === 0 && !isOpen) {
          container
            .querySelectorAll(".accordion-node.open")
            .forEach((openNode) => {
              openNode.classList.remove("open");
            });
        }
        nodeDiv.classList.toggle("open", !isOpen);
      });
    } else {
      const label = document.createElement("label");
      label.className = "tree-label";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `cb-${node.id}`;
      checkbox.checked = isInitiallyChecked;
      checkbox.addEventListener("change", (e) =>
        toggleCascade(node, e.target.checked),
      );

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(node.label));
      nodeDiv.appendChild(label);
    }

    container.appendChild(nodeDiv);

    // Apply restored state immediately
    if (isInitiallyChecked) {
      const svgLayer = document.getElementById(`layer-${node.id}`);
      if (svgLayer) svgLayer.style.display = "block";
    }
  });
}

/**
 * Toggle Cascade Engine + Local Storage Save
 */
function toggleCascade(node, isChecked) {
  const cb = document.getElementById(`cb-${node.id}`);
  if (cb) cb.checked = isChecked;

  const svgLayer = document.getElementById(`layer-${node.id}`);
  if (svgLayer) {
    svgLayer.style.display = isChecked ? "block" : "none";
  }

  // Update persistent state object
  state.savedCheckedStates[node.id] = isChecked;
  localStorage.setItem(
    "blueprint_layers",
    JSON.stringify(state.savedCheckedStates),
  );

  if (node.children) {
    node.children.forEach((child) => toggleCascade(child, isChecked));
  }
}

/**
 * Search Engine
 */
function searchTree(nodes, query, path = []) {
  let results = [];
  nodes.forEach((node) => {
    const currentPath = [...path, node.label];
    if (node.label.toLowerCase().includes(query.toLowerCase())) {
      results.push({
        node: node,
        pathString: currentPath.slice(0, -1).join(" > "),
      });
    }
    if (node.children) {
      results = results.concat(searchTree(node.children, query, currentPath));
    }
  });
  return results;
}

function handleSearch(query) {
  if (!query.trim()) {
    searchResultsContainer.style.display = "none";
    searchResultsContainer.innerHTML = "";
    treeRoot.style.display = "block";
    state.activeSearchResults = [];
    toggleResultsCb.checked = false;
    return;
  }

  treeRoot.style.display = "none";
  searchResultsContainer.style.display = "flex";
  searchResultsContainer.innerHTML = "";

  const results = searchTree(STRUCTURE_DATA, query);
  state.activeSearchResults = results.map((r) => r.node);

  if (results.length === 0) {
    searchResultsContainer.innerHTML =
      '<div style="font-size:0.8rem; color:#888; padding:0.5rem;">No components found.</div>';
    return;
  }

  results.forEach(({ node, pathString }) => {
    const item = document.createElement("div");
    item.className = "search-item";

    if (pathString) {
      const pathDiv = document.createElement("div");
      pathDiv.className = "search-path";
      pathDiv.textContent = pathString;
      item.appendChild(pathDiv);
    }

    const targetDiv = document.createElement("div");
    targetDiv.className = "search-target";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!document.getElementById(`cb-${node.id}`)?.checked;
    checkbox.addEventListener("change", (e) =>
      toggleCascade(node, e.target.checked),
    );

    targetDiv.appendChild(checkbox);
    targetDiv.appendChild(document.createTextNode(node.label));
    item.appendChild(targetDiv);

    searchResultsContainer.appendChild(item);
  });
}

toggleAllCb.addEventListener("change", (e) => {
  const isChecked = e.target.checked;
  STRUCTURE_DATA.forEach((node) => toggleCascade(node, isChecked));
  if (searchInput.value) handleSearch(searchInput.value);
});

toggleResultsCb.addEventListener("change", (e) => {
  const isChecked = e.target.checked;
  state.activeSearchResults.forEach((node) => toggleCascade(node, isChecked));
  if (searchInput.value) handleSearch(searchInput.value);
});

searchInput.addEventListener("input", (e) => handleSearch(e.target.value));

/**
 * Mobile Touch & Pinch Zoom
 */
let initialPinchDistance = null;
let initialTouchZoom = 1;

function getTouchDistance(touches) {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

viewport.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches.length === 1) {
      state.isDragging = true;
      state.startX = e.touches[0].clientX - state.panX;
      state.startY = e.touches[0].clientY - state.panY;
    } else if (e.touches.length === 2) {
      state.isDragging = false;
      initialPinchDistance = getTouchDistance(e.touches);
      initialTouchZoom = state.zoom;
    }
  },
  { passive: false },
);

viewport.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && state.isDragging) {
      state.panX = e.touches[0].clientX - state.startX;
      state.panY = e.touches[0].clientY - state.startY;
      updateTransform();
    } else if (e.touches.length === 2 && initialPinchDistance) {
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / initialPinchDistance;
      const newZoom = Math.min(
        Math.max(CONFIG.zoom.min, initialTouchZoom * scale),
        CONFIG.zoom.max,
      );

      const rect = viewport.getBoundingClientRect();
      const touchCenterX =
        (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
      const touchCenterY =
        (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

      state.panX =
        touchCenterX - (touchCenterX - state.panX) * (newZoom / state.zoom);
      state.panY =
        touchCenterY - (touchCenterY - state.panY) * (newZoom / state.zoom);
      state.zoom = newZoom;

      updateTransform();
    }
  },
  { passive: false },
);

viewport.addEventListener("touchend", (e) => {
  if (e.touches.length < 2) initialPinchDistance = null;
  if (e.touches.length === 0) state.isDragging = false;
});

/**
 * Desktop Wheel & Pan Engine
 */
function updateTransform() {
  stage.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
}

viewport.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const zoomFactor = 1 - e.deltaY * CONFIG.zoom.sensitivity;
    const newZoom = Math.min(
      Math.max(CONFIG.zoom.min, state.zoom * zoomFactor),
      CONFIG.zoom.max,
    );

    const rect = viewport.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    state.panX = mouseX - (mouseX - state.panX) * (newZoom / state.zoom);
    state.panY = mouseY - (mouseY - state.panY) * (newZoom / state.zoom);
    state.zoom = newZoom;

    updateTransform();
  },
  { passive: false },
);

viewport.addEventListener("mousedown", (e) => {
  state.isDragging = true;
  state.startX = e.clientX - state.panX;
  state.startY = e.clientY - state.panY;
});

window.addEventListener("mousemove", (e) => {
  if (!state.isDragging) return;
  state.panX = e.clientX - state.startX;
  state.panY = e.clientY - state.startY;
  updateTransform();
});

window.addEventListener("mouseup", () => {
  state.isDragging = false;
});

// Center and Fit Screen Viewport
function resetViewportCenter() {
  const rect = viewport.getBoundingClientRect();
  state.panX = rect.width / 4;
  state.panY = rect.height / 4;
  state.zoom = 1;
  updateTransform();
}

// App Initialization
function init() {
  initSVGStage(STRUCTURE_DATA);
  renderAccordion(STRUCTURE_DATA, treeRoot);
  resetViewportCenter();
}

init();
