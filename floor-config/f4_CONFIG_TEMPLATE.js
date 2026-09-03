/** @format */

export const CONFIG_2ND_FLOOR = {
  zoom: { min: 0.2, max: 10, sensitivity: 0.0015 },
  zPriorityMap: {
    light: 80,
    label: 70,
    ac: 60,
    grille: 50,
    supply: 40,
    return: 30,
    ceiling: 20,
    wall: 10,
  },
};

export const STRUCTURE_2ND_FLOOR = {
  id: "floor_2",
  label: "2nd Floor",
  children: [
    { id: "f2_light", label: "1. Light", svgPath: "assets/f2/light.svg" },
    {
      id: "f2_bedroom",
      label: "2. Master Bedroom",
      children: [
        {
          id: "f2_br_label",
          label: "1. Label",
          svgPath: "assets/f2/bedroom/label.svg",
        },
        { id: "f2_br_ac", label: "2. AC", svgPath: "assets/f2/bedroom/ac.svg" },
      ],
    },
    { id: "f2_ceiling", label: "3. Ceiling", svgPath: "assets/f2/ceiling.svg" },
    { id: "f2_wall", label: "4. Wall", svgPath: "assets/f2/wall.svg" },
  ],
};
