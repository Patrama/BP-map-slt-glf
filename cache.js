/** @format */

// Simple IndexedDB wrapper for large SVG caching.
// This is an ES module — it's meant to be `import`ed by app.js, not loaded
// via a bare <script> tag (that previously caused a SyntaxError on the
// `export` keyword, silently disabling caching entirely).

const DB_NAME = "CADViewerCache";
const STORE_NAME = "svg_layers";

// Bump this when SVG assets change in a way that should invalidate
// everything already cached (e.g. re-exported assets, changed viewBox/
// coordinate scheme). Old-version entries are ignored and overwritten
// on next fetch — no manual cache-clearing needed.
const CACHE_VERSION = 1;

// Reuse a single DB connection instead of opening a fresh one on every
// get/set — indexedDB.open() involves a version-check round trip that's
// wasteful to repeat for every one of the dozens of SVG layers a floor
// plan can have.
let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      dbPromise = null; // allow a retry on next call instead of caching the failure forever
      reject(request.error);
    };
  });
  return dbPromise;
}

function versionedKey(layerKey) {
  return `v${CACHE_VERSION}:${layerKey}`;
}

export async function getCachedSVG(layerKey) {
  try {
    const db = await openDB();
    return await new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const request = tx.objectStore(STORE_NAME).get(versionedKey(layerKey));
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
}

export async function setCachedSVG(layerKey, svgText) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(svgText, versionedKey(layerKey));
  } catch (e) {
    console.warn("Failed to cache SVG layer locally", e);
  }
}
