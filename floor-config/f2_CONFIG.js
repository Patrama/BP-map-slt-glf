/** @format */

export const CONFIG_2ND_FLOOR = {
  zoom: {
    min: 0.2,
    max: 10,
    sensitivity: 0.0015,
  },
  zPriorityMap: {
    light: 80,
    label: 70,
    ac: 60,
    grille: 50,
    supply: 40,
    return: 30,
    ceiling: 20,
    door: 15,
    wall: 10,
  },
};

export const STRUCTURE_2ND_FLOOR = {
  id: "floor_2",
  label: "2nd Floor",
  children: [
    { id: "f2_light", label: "Light", svgPath: "assets/f2/light.svg" },
    {
      id: "f2_2_pk_guest_room",
      label: "2 PK - Guest Room",
      children: [
        {
          id: "f2_g_2_label",
          label: "Label",
          svgPath: "assets/f2/2_pk_guest_room/label.svg",
        },
        {
          id: "f2_g_2_ac",
          label: "AC",
          svgPath: "assets/f2/2_pk_guest_room/ac.svg",
        },
        {
          id: "f2_g_2_supply",
          label: "Supply",
          children: [
            {
              id: "f2_g_2_sup_gs",
              label: "Grile",
              svgPath: "assets/f2/2_pk_guest_room/gs.svg",
            },
            {
              id: "f2_g_2_sup_ds",
              label: "Duct",
              svgPath: "assets/f2/2_pk_guest_room/ds.svg",
            },
          ],
        },
        {
          id: "f2_g_2_return",
          label: "Return",
          children: [
            {
              id: "f2_g_2_ret_gr",
              label: "Grile",
              svgPath: "assets/f2/2_pk_guest_room/gr.svg",
            },
            {
              id: "f2_g_2_ret_dr",
              label: "Duct",
              svgPath: "assets/f2/2_pk_guest_room/dr.svg",
            },
          ],
        },
      ],
    },
    {
      id: "f2_2_5_pk_study_room",
      label: "2.5 PK - Study Room",
      children: [
        {
          id: "f2_s_2_5_label",
          label: "Label",
          svgPath: "assets/f2/2_5_pk_study_room/label.svg",
        },
        {
          id: "f2_s_2_5_ac",
          label: "AC",
          svgPath: "assets/f2/2_5_pk_study_room/ac.svg",
        },
        {
          id: "f2_s_2_5_supply",
          label: "Supply",
          children: [
            {
              id: "f2_s_2_5_sup_gs",
              label: "Grile",
              svgPath: "assets/f2/2_5_pk_study_room/gs.svg",
            },
            {
              id: "f2_s_2_5_sup_ds",
              label: "Duct",
              svgPath: "assets/f2/2_5_pk_study_room/ds.svg",
            },
          ],
        },
        {
          id: "f2_s_2_5_return",
          label: "Return",
          children: [
            {
              id: "f2_s_2_5_ret_gr",
              label: "Grile",
              svgPath: "assets/f2/2_5_pk_study_room/gr.svg",
            },
            {
              id: "f2_s_2_5_ret_dr",
              label: "Duct",
              svgPath: "assets/f2/2_5_pk_study_room/dr.svg",
            },
          ],
        },
      ],
    },
    { id: "f2_door", label: "3. Door", svgPath: "assets/f2/door.svg" },
    { id: "f2_ceiling", label: "4. Ceiling", svgPath: "assets/f2/ceil.svg" },
    { id: "f2_wall", label: "5. Wall", svgPath: "assets/f2/wall.svg" },
  ],
};
