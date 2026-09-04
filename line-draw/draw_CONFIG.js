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
    lineColor: "#09ff00",
    lineWidth: 0.5,
    lineDashArray: "4 4",

    handleColor: "#ff0055",
    handleRadius: 1.5,

    cursorColor: "#00000000",
    cursorSize: 8,
    cursorStrokeWidth: 1,

    cursorDotColor: "#FF0000",
    cursorDotRadius: 1.5,
  },
  snap: {
    defaultEnabled: true,
  },
  cursor: {
    defaultEnabled: true,
  },
};
