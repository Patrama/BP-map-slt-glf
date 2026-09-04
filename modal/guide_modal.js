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

export function initGuideModal() {
  const leftMenu = document.getElementById("left-menu");
  const h2 = leftMenu.querySelector("h2");

  // Create new header container to hold both buttons
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

  // Replace the old H2 with our new container
  if (h2) {
    h2.replaceWith(headerContainer);
  } else {
    leftMenu.prepend(headerContainer);
  }

  // Generate the Modal DOM
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "guide-modal-overlay";
  modalOverlay.className = "guide-modal-overlay";

  const modalContent = document.createElement("div");
  modalContent.className = "guide-modal-content";

  // Prevent clicks inside the card from closing the modal
  modalContent.addEventListener("click", (e) => e.stopPropagation());

  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  let currentTab = GUIDE_CONFIG.TABS[0];
  let csvData = [];

  // Close modal when tapping outside the card box
  modalOverlay.addEventListener("click", () => {
    modalOverlay.classList.remove("active");
  });

  guideBtn.addEventListener("click", async () => {
    modalOverlay.classList.add("active");
    modalContent.innerHTML =
      "<p style='padding: 2rem; text-align: center;'>Loading data...</p>";

    try {
      const res = await fetch(GUIDE_CONFIG.CSV_URL);
      const text = await res.text();
      csvData = parseCSV(text);
      renderModalContent();
    } catch (e) {
      modalContent.innerHTML =
        "<p style='padding: 2rem; color: #ff4d4d;'>Error loading guide data.</p>";
    }
  });

  function renderModalContent() {
    modalContent.innerHTML = "";

    const tabContainer = document.createElement("div");
    tabContainer.className = "guide-tabs";

    GUIDE_CONFIG.TABS.forEach((tab) => {
      const tabBtn = document.createElement("button");
      tabBtn.textContent = tab;
      tabBtn.className = `guide-tab-btn ${currentTab === tab ? "active" : ""}`;
      tabBtn.addEventListener("click", () => {
        currentTab = tab;
        renderModalContent();
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

        // Structured Layout precisely matching Indoor.jpg
        card.innerHTML = `
          <div class="guide-card-header">
            <strong>${indoorName}</strong> - <strong>${pkName}</strong>
          </div>
          <div class="guide-card-grid">
            <div class="guide-col">
              <div class="guide-col-title">Dimensi</div>
              <div class="guide-row"><span>Lebar</span><span>: ${row["L"] || "-"}</span></div>
              <div class="guide-row"><span>Panjang</span><span>: ${row["P"] || "-"}</span></div>
              <div class="guide-row"><span>Tinggi</span><span>: ${row["T"] || "-"}</span></div>
            </div>
            <div class="guide-col">
              <div class="guide-col-title">Jarak Bolt</div>
              <div class="guide-row"><span>Lebar</span><span>: ${row["L.Bolt"] || "-"}</span></div>
              <div class="guide-row"><span>Panjang</span><span>: ${row["P.Bolt"] || "-"}</span></div>
            </div>
            <div class="guide-col">
              <div class="guide-col-title">Outlet - Supply</div>
              <div class="guide-row"><span>Lebar</span><span>: ${row["L.Outlet"] || "-"}</span></div>
              <div class="guide-row"><span>Tinggi</span><span>: ${row["T.Outlet"] || "-"}</span></div>
            </div>
            <div class="guide-col">
              <div class="guide-col-title">Inlet - Return</div>
              <div class="guide-row"><span>Lebar</span><span>: ${row["L.Inlet"] || "-"}</span></div>
              <div class="guide-row"><span>Tinggi</span><span>: ${row["T.Inlet"] || "-"}</span></div>
            </div>
          </div>
        `;
        dataContainer.appendChild(card);
      });
    } else {
      dataContainer.innerHTML =
        "<p style='color: #888; text-align: center;'>Data for Outdoor will be available in future improvements.</p>";
    }

    modalContent.appendChild(dataContainer);
  }
}
