/** @format */

export function initClearDataButton() {
  // 🔄 Updated target to append alongside the Guide Button
  const headerContainer = document.querySelector("#menu-header-container");
  if (!headerContainer) return;

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.id = "clear-cache-btn";
  clearBtn.textContent = "Clear Data 🧹";
  clearBtn.title = "Clear site cache, IndexedDB, and storage";

  // ... keeping the previous styling from clear_data.js
  clearBtn.style.background = "#333333";
  clearBtn.style.color = "#ff4d4d";
  clearBtn.style.border = "1px solid #555";
  clearBtn.style.padding = "0.2rem 0.5rem";
  clearBtn.style.borderRadius = "4px";
  clearBtn.style.fontSize = "0.75rem";
  clearBtn.style.cursor = "pointer";
  clearBtn.style.fontFamily = "inherit";

  clearBtn.addEventListener("mouseover", () => {
    clearBtn.style.background = "#444444";
  });
  clearBtn.addEventListener("mouseout", () => {
    clearBtn.style.background = "#333333";
  });

  clearBtn.addEventListener("click", async () => {
    if (
      !confirm(
        "Are you sure you want to clear all cached blueprint data and local storage for this site? ⚠️",
      )
    ) {
      return;
    }

    try {
      if (window.indexedDB) {
        await new Promise((resolve) => {
          const req = indexedDB.deleteDatabase("CADViewerCache");
          req.onsuccess = () => resolve(true);
          req.onerror = () => resolve(false);
          req.onblocked = () => resolve(false);
        });
      }

      localStorage.removeItem("blueprint_layers");
      localStorage.removeItem("sidebar_open");

      if (navigator.serviceWorker) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      alert("Site data successfully cleared! Refreshing page... ✅");
      window.location.reload();
    } catch (err) {
      console.error("Failed to clear site data:", err);
      alert("An error occurred while clearing data. ❌");
    }
  });

  headerContainer.appendChild(clearBtn);
}
