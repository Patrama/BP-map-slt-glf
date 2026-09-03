/** @format */

export const DRAW_CONFIG = {
  scale: {
    // Defines how many SVG coordinate units represent 1 meter.
    // Adjust this value so 6m matches your blueprint's 6m room length.
    svgUnitsPerMeter: 75.590551 / 4, // 1 meter = 18.897637 SVG units
  },
  style: {
    lineColor: "#09ff00",
    lineWidth: 2,
    lineDashArray: "4 4",
    handleRadius: 2,
    handleColor: "#00e5ff",
  },
  snap: {
    defaultEnabled: true, // Snap enabled by default 🧲
  },
};
