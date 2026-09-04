/** @format */

import { GUIDE_CONFIG } from "./config_modal.js";

function parseCSV(text) {
  const lines = text.split("\n");
  if (lines.length < 1) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(",").map((v) => v.trim());
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    data.push(obj);
  }
  return data;
}

function applyRounding(val, mode) {
  if (!val || val === "-") return "-";
  if (mode === "0" || mode === "real") return val;

  if (/^-?\d+(\.\d+)?$/.test(val)) {
    const num = parseFloat(val);
    if (mode === "up") return Math.ceil(num).toString();
    if (mode === "down") return Math.floor(num).toString();
  }
  return val;
}

function generateRow(label, rawValue, roundingMode) {
  const finalValue = applyRounding(rawValue, roundingMode);
  return `
    <div class="guide-row">
      <span class="guide-row-label">${label}</span>
      <span class="guide-row-colon">:</span>
      <span class="guide-row-value">${finalValue}</span>
    </div>
  `;
}

export function initGuideModal() {
  const leftMenu = document.getElementById("left-menu");
  const h2 = leftMenu.querySelector("h2");

  const headerContainer = document.createElement("div");
  headerContainer.id = "menu-header-container";
  headerContainer.style.display = "flex";
  headerContainer.style.alignItems = "center";
  headerContainer.style.justifyContent = "space-between";
  headerContainer.style.marginBottom = "0.75rem";

  const guideBtn = document.createElement("button");
  guideBtn.id = "guide-btn";
  guideBtn.textContent = "? Guide";
  guideBtn.className = "guide-button";

  headerContainer.appendChild(guideBtn);

  if (h2) {
    h2.replaceWith(headerContainer);
  } else {
    leftMenu.prepend(headerContainer);
  }

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "guide-modal-overlay";
  modalOverlay.className = "guide-modal-overlay";

  const modalContent = document.createElement("div");
  modalContent.className = "guide-modal-content";
  modalContent.addEventListener("click", (e) => e.stopPropagation());

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  let currentTab = GUIDE_CONFIG.TABS[0];
  let currentRounding = GUIDE_CONFIG.ROUND;
  let csvData = [];

  modalOverlay.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });

  // 🔄 Helper function to fetch data for the active tab
  async function loadTabData() {
    modalContent.innerHTML =
      "<p style='padding: 2rem; text-align: center;'>Loading data...</p>";

    try {
      const url = GUIDE_CONFIG.CSV_URLS[currentTab]; // ✅ Fetch from CSV_URLS mapping
      const res = await fetch(url);
      const text = await res.text();
      csvData = parseCSV(text);
      renderModalContent();
    } catch (e) {
      modalContent.innerHTML =
        "<p style='padding: 2rem; color: #ff4d4d;'>Error loading guide data.</p>";
    }
  }

  guideBtn.addEventListener("click", async () => {
    modalOverlay.classList.add("active");
    await loadTabData();
  });

  function renderModalContent() {
    modalContent.innerHTML = "";

    const controlsContainer = document.createElement("div");
    controlsContainer.className = "guide-header-controls";
    controlsContainer.innerHTML = `
      <label style="color: #aaa; font-size: 0.85rem; margin-right: 0.5rem;">Rounding:</label>
      <select id="rounding-select" class="guide-rounding-select">
        <option value="up" ${currentRounding === "up" ? "selected" : ""}>Up</option>
        <option value="down" ${currentRounding === "down" ? "selected" : ""}>Down</option>
        <option value="0" ${currentRounding === "0" ? "selected" : ""}>Real</option>
      </select>
    `;
    modalContent.appendChild(controlsContainer);

    controlsContainer
      .querySelector("#rounding-select")
      .addEventListener("change", (e) => {
        currentRounding = e.target.value;
        renderModalContent();
      });

    const tabContainer = document.createElement("div");
    tabContainer.className = "guide-tabs";

    GUIDE_CONFIG.TABS.forEach((tab) => {
      const tabBtn = document.createElement("button");
      tabBtn.className = `guide-tab-btn ${currentTab === tab ? "active" : ""}`;

      const unit = GUIDE_CONFIG.UNITS[tab];
      const unitHtml = unit
        ? `<span class="guide-tab-unit">- ${unit}</span>`
        : "";
      tabBtn.innerHTML = `${tab} ${unitHtml}`;

      tabBtn.addEventListener("click", async () => {
        if (currentTab !== tab) {
          currentTab = tab;
          await loadTabData(); // 🔄 Reload data when switching tabs to use the new CSV URL
        }
      });
      tabContainer.appendChild(tabBtn);
    });

    modalContent.appendChild(tabContainer);

    const dataContainer = document.createElement("div");
    dataContainer.className = "guide-data-container";

    if (currentTab === "Indoor") {
      csvData.forEach((row) => {
        const card = document.createElement("div");
        card.className = "guide-card";

        const indoorName = row["INDOOR"] || "-";
        const pkName = row["PK"] || "-";

        card.innerHTML = `
          <div class="guide-card-header">
            <strong>${indoorName}</strong> - <strong>${pkName}</strong>
          </div>
          <div class="guide-card-grid">
            <div class="guide-col">
              <div class="guide-col-title">Dimensi</div>
              ${generateRow("Lebar", row["L"], currentRounding)}
              ${generateRow("Panjang", row["P"], currentRounding)}
              ${generateRow("Tinggi", row["T"], currentRounding)}
            </div>
            <div class="guide-col">
              <div class="guide-col-title">Jarak Bolt</div>
              ${generateRow("Lebar", row["L.Bolt"], currentRounding)}
              ${generateRow("Panjang", row["P.Bolt"], currentRounding)}
            </div>
            <div class="guide-col">
              <div class="guide-col-title">Outlet - Supply</div>
              ${generateRow("Lebar", row["L.Outlet"], currentRounding)}
              ${generateRow("Tinggi", row["T.Outlet"], currentRounding)}
            </div>
            <div class="guide-col">
              <div class="guide-col-title">Inlet - Return</div>
              ${generateRow("Lebar", row["L.Inlet"], currentRounding)}
              ${generateRow("Tinggi", row["T.Inlet"], currentRounding)}
            </div>
          </div>
        `;
        dataContainer.appendChild(card);
      });
    } else {
      csvData.forEach((row) => {
        const card = document.createElement("div");
        card.className = "guide-card";

        const outdoorName = row["OUTDOOR"] || "-";
        const pkName = row["PK"] || "-";

        card.innerHTML = `
          <div class="guide-card-header">
            <strong>${outdoorName}</strong> - <strong>${pkName}</strong>
          </div>
          <div class="guide-card-grid">
            <div class="guide-col">
              <div class="guide-col-title">Dimensi</div>
              ${generateRow("Lebar", row["L"], currentRounding)}
              ${generateRow("Panjang", row["P"], currentRounding)}
              ${generateRow("Tinggi", row["T"], currentRounding)}
            </div>
            <div class="guide-col">
              <div class="guide-col-title">Jarak Kaki</div>
              ${generateRow("Lebar", row["Shoe"], currentRounding)}
            </div>
          </div>
        `;
        dataContainer.appendChild(card);
      });
    }

    modalContent.appendChild(dataContainer);
  }
}
