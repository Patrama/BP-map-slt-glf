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
    lineWidth: 2,
    lineDashArray: "4 4",
    handleRadius: 2,
    handleColor: "#00e5ff",
    cursorColor: "#ff0055", // 🎯 Color for the + pointer cursor
    cursorSize: 12, // 🎯 Arm length of the crosshair
  },
  snap: {
    defaultEnabled: true, // Snap enabled by default 🧲
  },
};
