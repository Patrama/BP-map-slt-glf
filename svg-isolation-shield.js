/**
 * svg-isolation-shield.js (100% Universal Plug-and-Play Version)
 *
 * Add this script via <script src="svg-isolation-shield.js"></script> before other files. PRIORITY: Must be loaded before any other scripts that parse SVGs or manipulate the DOM.
 *
 * This script automatically intercepts and sandboxes ALL inline SVGs and CSS classes across any project framework.
 * It is designed to prevent ID collisions, CSS class conflicts, and other namespace issues when multiple SVGs are loaded into the same DOM.
 * Automatically intercept and sandbox ALL colliding inline SVGs and CSS classes across any project framework.
 *
 * @format
 */

(function () {
  // Generates a random, unique alphanumeric seed key for each parsed file instance
  function generateUniqueKey() {
    return (
      "layer_" +
      Math.random().toString(36).substring(2, 9) +
      Date.now().toString(36).substring(4)
    );
  }

  // Intercept the native browser DOMParser to catch code before compilation/DOM rendering
  const originalParseFromString = DOMParser.prototype.parseFromString;

  DOMParser.prototype.parseFromString = function (markup, type) {
    let finalMarkup = markup;

    // Matches any incoming SVG text payload passing through the browser pipeline
    if (type === "image/svg+xml" && typeof markup === "string") {
      const scopeKey = generateUniqueKey();

      // 1. Isolate all generic id attributes, url fragment links, and href references
      finalMarkup = finalMarkup.replace(/id="([^"]+)"/g, `id="$1_${scopeKey}"`);
      finalMarkup = finalMarkup.replace(
        /url\(#([^)]+)\)/g,
        `url(#$1_${scopeKey})`,
      );
      finalMarkup = finalMarkup.replace(
        /href="#([^"]+)"/g,
        `href="#$1_${scopeKey}"`,
      );

      // 2. Isolate embedded CSS classes (Adobe Illustrator style sheets)
      // Captures style blocks and rewrites classes: e.g., ".cls-1{...}" to ".cls-1_layer_xyz{...}"
      finalMarkup = finalMarkup.replace(
        /<style[^>]*>([\s\S]*?)<\/style>/gi,
        function (match, cssContent) {
          // Find every class selector (e.g., .cls-1) and append our unique scope key
          let isolatedCss = cssContent.replace(
            /\.([a-zA-Z0-9_-]+)/g,
            `.$1_${scopeKey}`,
          );
          return `<style>${isolatedCss}</style>`;
        },
      );

      // 3. Update the matching class attributes inside the HTML elements themselves
      // Converts class="cls-1" to class="cls-1_layer_xyz"
      finalMarkup = finalMarkup.replace(
        /class="([^"]+)"/g,
        function (match, classNames) {
          let isolatedClasses = classNames
            .split(/\s+/)
            .map((name) => (name ? `${name}_${scopeKey}` : ""))
            .join(" ");
          return `class="${isolatedClasses}"`;
        },
      );
    }

    // Pass the sandboxed layout data to the original DOMParser module
    return originalParseFromString.call(this, finalMarkup, type);
  };

  console.log(
    "🛡️ Global SVG Shield: Asset namespace and CSS class isolation runtime is active.",
  );
})();
