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

/**
 * 1. Hide / Show Sidebar Drawer Functionality
 */
sidebarToggle.addEventListener("click", () => {
  leftMenu.classList.toggle("open");
});

/**
 * 2. Initialize Canvas Layers
 */
function initSVGStage(nodes, currentZIndex) {
  nodes.forEach((node) => {
    const layerZ = node.zGroup ? CONFIG.zIndices[node.zGroup] : currentZIndex;

    if (node.svgPath) {
      const layer = document.createElement("div");
      layer.className = "svg-layer";
      layer.id = `layer-${node.id}`;
      layer.style.zIndex = layerZ;

      const img = document.createElement("img");
      img.src = node.svgPath;
      img.draggable = false;
      layer.appendChild(img);

      stage.appendChild(layer);
    }

    if (node.children) {
      initSVGStage(node.children, layerZ);
    }
  });
}

/**
 * 3. Render Accordion Tree UI
 */
function renderAccordion(nodes, container, level = 0) {
  nodes.forEach((node) => {
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "tree-node";

    if (node.children) {
      nodeDiv.classList.add("accordion-node");

      const header = document.createElement("div");
      header.className = "accordion-header";

      const titleGroup = document.createElement("div");
      titleGroup.className = "accordion-title-group";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = `cb-${node.id}`;
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
      checkbox.addEventListener("change", (e) =>
        toggleCascade(node, e.target.checked),
      );

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(node.label));
      nodeDiv.appendChild(label);
    }

    container.appendChild(nodeDiv);
  });
}

/**
 * 4. Toggle Cascade Engine
 */
function toggleCascade(node, isChecked) {
  const cb = document.getElementById(`cb-${node.id}`);
  if (cb) cb.checked = isChecked;

  const svgLayer = document.getElementById(`layer-${node.id}`);
  if (svgLayer) {
    svgLayer.style.display = isChecked ? "block" : "none";
  }

  if (node.children) {
    node.children.forEach((child) => toggleCascade(child, isChecked));
  }
}

/**
 * 5. Search Engine with Hierarchical Context
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

// Global Checkbox Event Handlers
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
 * 6. Pan & Zoom Engine
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

// App Initialization
function init() {
  initSVGStage(STRUCTURE_DATA, 0);
  renderAccordion(STRUCTURE_DATA, treeRoot);
  updateTransform();
}

init();
