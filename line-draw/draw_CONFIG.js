/** @format */

export const DRAW_CONFIG = {
  scale: {
    // Number of SVG *user* units (viewBox units) that equal 1 real meter.
    // Measurements now use the blueprint SVG coordinate system, so this value
    // is independent of screen size, device, zoom and aspect ratio.
    // After the coordinate-system fix you may need to re-calibrate:
    // measure a known length (e.g. a 2 m or 6 m wall) and adjust until the
    // readout matches reality. Once correct it will stay correct on every device.
    svgUnitsPerMeter: 75.590551, // ≈ 18.897637 SVG units per meter
  },
  style: {
    lineColor: "#09ff00",
    lineWidth: 0.5, // 🎯 Reduced from 1 to 0.5 for finer lines
    lineDashArray: "4 4",

    handleColor: "#ff0055",
    handleRadius: 1.5, // 🎯 Reduced from 3 to 1.5 for finer control

    cursorColor: "#ff0055",
    cursorSize: 8, // 🎯 Reduced from 12 to 8 for sharper precision
    cursorStrokeWidth: 1, // 🎯 Fine 1px stroke weight

    cursorDotColor: "#ffff00", // 🎨 Separate bright color for the center dot
    cursorDotRadius: 1.5, // 🎯 Adjustable center dot radius
  },
  snap: {
    defaultEnabled: true, // Snap enabled by default 🧲
  },
  cursor: {
    defaultEnabled: true, // 🎯 Enable simulated cursor by default
  },
};
