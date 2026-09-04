/** @format */

export const DRAW_CONFIG = {
  scale: {
    svgUnitsPerMeter: 75.590551,
  },
  palette: {
    // Leave null/undefined to default to CSS root variables (--color-measure-*)
    widthColor: "#00e5ff", // 🎨 Horizontal line & text color
    lengthColor: "#ff9100", // 🎨 Vertical line & text color
    diagColor: "#09ff00", // 🎨 Diagonal line & text color
  },
  style: {
    // lineColor: "#09ff00",
    lineWidth: 0.5,
    linecap: "round", // ⚡ Line cap ROUND, SQUARE, BUTT
    // linejoin: "round", // ⚡ Line join ROUND, BEVEL, MITER
    // lineMiterLimit: 4, // ⚡ Line miter limit (for MITER line join)
    lineDashArray: "0 0 0 0", // ⚡ Line dash array (for dashed lines)

    handleColor: "#ff0055",
    handleRadius: 2,

    cursorColor: "#000000a1",
    cursorSize: 8,
    cursorStrokeWidth: 2,

    cursorDotColor: "#FF0000",
    cursorDotRadius: 2,
  },
  snap: {
    defaultEnabled: true,
  },
  cursor: {
    defaultEnabled: true,
  },

  magnifier: {
    defaultEnabled: true,
    zoomLevel: 2, // 🔍 Magnifier zoom scale
    size: 110, // 🔍 Viewport size in pixels
    style: "smooth-square", // 🔍 Shape: "circle" or "smooth-square"
  },
};
