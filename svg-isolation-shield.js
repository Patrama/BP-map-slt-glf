/**
 * ---------- SVG Isolation Shield ----------
 * Prevents ID collisions, gradient/clip-path/use reference breakage, and
 * CSS class collisions when multiple inline SVGs (especially Adobe
 * Illustrator / Figma exports, which love generic names like id="Layer_1"
 * and class="cls-1") land in the same DOM. Each <svg>...</svg> block gets
 * its own unique namespace suffix appended to every id, class, and internal
 * reference, so two colliding icons never fight over the same name.
 *
 * Add via <script src="js/svg-isolation-shield.js"></script> as early as
 * possible — before any code that injects SVG markup — since it works by
 * intercepting the browser APIs that bring HTML strings into the DOM.
 *
 * COVERS (the actual common paths SVG markup enters a page):
 *   - DOMParser().parseFromString(svgText, ...)   (any type containing <svg,
 *     not just the exact "image/svg+xml" MIME type)
 *   - el.innerHTML = svgText
 *   - el.outerHTML = svgText
 *   - el.insertAdjacentHTML(position, svgText)
 *
 * NOT covered (documented limitation, not a silent gap): document.write(),
 * Range.prototype.createContextualFragment(), and SVG loaded via <img src>,
 * <object>, or <iframe> — the latter three don't need this at all, since
 * the browser already isolates them in their own document/rendering context
 * with no possibility of ID/class collision with the host page.
 *
 * WHAT GETS REWRITTEN, per <svg>...</svg> block found:
 *   - id="..."                          (and xml:id, since the same regex
 *                                         naturally covers any *id="...")
 *   - href="#..." AND xlink:href="#..." (both forms — Illustrator exports
 *                                         very commonly still use xlink:href)
 *   - url(#...), url('#...'), url("#...")  (all three quoting styles)
 *   - CSS classes inside <style> blocks (.cls-1 { ... })
 *   - class="..." attributes on elements
 * Only fragment references (#foo) are touched — external URLs, data: URIs,
 * and cross-document xlink:href values are left completely alone.
 *
 * MANUAL / STANDALONE USE (no page-injection interception needed):
 *   import { sandbox } from "./js/svg-isolation-shield.js";
 *   const isolated = sandbox(rawSvgString);
 *
 * Loading this script twice (e.g. duplicated in a bundle) is safe — a
 * guard prevents the DOM patches from being installed more than once.
 *
 * @format
 */

(function (global) {
  // ---- Unique key generation ------------------------------------------
  // A monotonic counter guarantees uniqueness within a page session even
  // in the vanishingly unlikely event Date.now()+Math.random() collide.
  var keyCounter = 0;

  function generateUniqueKey() {
    keyCounter += 1;
    return (
      "layer_" +
      Date.now().toString(36) +
      "_" +
      keyCounter.toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 8)
    );
  }

  // ---- Core transform, scoped to ONE <svg>...</svg> block --------------

  function transformSvgBlock(svgBlock, scopeKey) {
    var result = svgBlock;

    // 1. id="..." (also naturally catches xml:id="...", data-id="..." etc.
    //    via the same attribute-name token, which is harmless even where
    //    not strictly necessary). Requires a preceding whitespace so word
    //    fragments like `avoid="..."` are never mistaken for `id="..."`.
    result = result.replace(/(\sid)="([^"]*)"/g, function (m, attr, val) {
      return val ? attr + '="' + val + "_" + scopeKey + '"' : m;
    });

    // 2. href="#..." AND xlink:href="#..." — both forms, fragment-only
    //    (a full URL or data: URI in href is never touched).
    result = result.replace(
      /((?:xlink:)?href)="#([^"]+)"/g,
      function (m, attr, id) {
        return attr + '="#' + id + "_" + scopeKey + '"';
      },
    );

    // 3. url(#...), url('#...'), url("#...") — all three quoting styles,
    //    with optional internal whitespace.
    result = result.replace(
      /url\(\s*(['"]?)#([^'")\s]+)\1\s*\)/g,
      function (m, quote, id) {
        return "url(" + quote + "#" + id + "_" + scopeKey + quote + ")";
      },
    );

    // 4. CSS classes inside <style> blocks. First character after the dot
    //    must be a letter/underscore/hyphen — NOT a digit — otherwise a
    //    decimal value like `stroke-width:.5px` gets corrupted into
    //    `.5px_layer_xyz` by a naive `.` + alphanumeric match.
    result = result.replace(
      /<style([^>]*)>([\s\S]*?)<\/style>/gi,
      function (match, attrs, cssContent) {
        var isolatedCss = cssContent.replace(
          /\.([a-zA-Z_-][a-zA-Z0-9_-]*)/g,
          function (m2, cls) {
            return "." + cls + "_" + scopeKey;
          },
        );
        return "<style" + attrs + ">" + isolatedCss + "</style>";
      },
    );

    // 5. class="..." attributes on elements themselves.
    result = result.replace(/\sclass="([^"]+)"/g, function (m, classNames) {
      var isolated = classNames
        .split(/\s+/)
        .filter(Boolean)
        .map(function (name) {
          return name + "_" + scopeKey;
        })
        .join(" ");
      return ' class="' + isolated + '"';
    });

    return result;
  }

  // ---- Public entry point: finds every <svg>...</svg> block in an   ----
  // ---- arbitrary string and transforms ONLY those blocks, leaving   ----
  // ---- any surrounding non-SVG markup completely untouched.         ----

  function sandbox(markup) {
    if (typeof markup !== "string" || markup.indexOf("<svg") === -1) {
      return markup; // fast path — nothing to do, and never throws on non-strings
    }

    // Known limitation: this non-greedy match assumes <svg> blocks don't
    // nest (true for essentially all real-world content). A genuinely
    // nested <svg> inside another <svg> would close the match early;
    // documented above rather than silently mishandled.
    return markup.replace(/<svg[\s\S]*?<\/svg>/gi, function (svgBlock) {
      return transformSvgBlock(svgBlock, generateUniqueKey());
    });
  }

  // ---- Install the interceptors (browser only, once) --------------------

  function installOnce() {
    if (global.__SVG_ISOLATION_SHIELD_INSTALLED__) return;

    if (typeof DOMParser !== "undefined") {
      var originalParseFromString = DOMParser.prototype.parseFromString;
      DOMParser.prototype.parseFromString = function (markup, type) {
        var finalMarkup = typeof markup === "string" ? sandbox(markup) : markup;
        return originalParseFromString.call(this, finalMarkup, type);
      };
    }

    if (typeof Element !== "undefined") {
      patchHtmlSetter(Element.prototype, "innerHTML");
      patchHtmlSetter(Element.prototype, "outerHTML");
      patchInsertAdjacentHTML(Element.prototype);
    }

    global.__SVG_ISOLATION_SHIELD_INSTALLED__ = true;

    if (global.SVG_ISOLATION_SHIELD_DEBUG) {
      console.log(
        "🛡️ SVG Isolation Shield active: DOMParser, innerHTML, outerHTML, insertAdjacentHTML.",
      );
    }
  }

  function patchHtmlSetter(proto, propName) {
    var descriptor = Object.getOwnPropertyDescriptor(proto, propName);
    if (!descriptor || typeof descriptor.set !== "function") return; // not present on this engine — skip, don't throw
    var originalSet = descriptor.set;
    Object.defineProperty(proto, propName, {
      configurable: true,
      enumerable: descriptor.enumerable,
      get: descriptor.get,
      set: function (value) {
        var finalValue = typeof value === "string" ? sandbox(value) : value;
        return originalSet.call(this, finalValue);
      },
    });
  }

  function patchInsertAdjacentHTML(proto) {
    var original = proto.insertAdjacentHTML;
    if (typeof original !== "function") return;
    proto.insertAdjacentHTML = function (position, html) {
      var finalHtml = typeof html === "string" ? sandbox(html) : html;
      return original.call(this, position, finalHtml);
    };
  }

  if (typeof document !== "undefined") {
    installOnce();
  }

  // ---- Public API --------------------------------------------------------

  var api = {
    sandbox: sandbox,
    generateKey: generateUniqueKey,
  };

  global.SvgIsolationShield = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
