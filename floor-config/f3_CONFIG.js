/** @format */

export const CONFIG_3RD_FLOOR = {
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

export const STRUCTURE_3RD_FLOOR = {
  id: "floor_3",
  label: "3rd Floor",
  children: [
    { id: "f3_lamp", label: "Lamp", svgPath: "assets/f3/lamp.svg" },
    {
      id: "f3_ku_4pk",
      label: "KU 4pk",
      children: [
        {
          id: "f3_ku_4pk_label",
          label: "Label",
          svgPath: "assets/f3/ku_4pk/label.svg",
        },
        { id: "f3_ku_4pk_ac", label: "AC", svgPath: "assets/f3/ku_4pk/ac.svg" },
        {
          id: "f3_ku_4pk_supply",
          label: "Supply",
          children: [
            {
              id: "f3_ku_4pk_sup_gs",
              label: "Grile",
              svgPath: "assets/f3/ku_4pk/gs.svg",
            },
            {
              id: "f3_ku_4pk_sup_ds",
              label: "Duct",
              svgPath: "assets/f3/ku_4pk/ds.svg",
            },
          ],
        },
        {
          id: "f3_ku_4pk_return",
          label: "Return",
          children: [
            {
              id: "f3_ku_4pk_ret_gr",
              label: "Grile",
              svgPath: "assets/f3/ku_4pk/gr.svg",
            },
            {
              id: "f3_ku_4pk_ret_dr",
              label: "Duct",
              svgPath: "assets/f3/ku_4pk/dr.svg",
            },
          ],
        },
      ],
    },
    {
      id: "f3_wd_br_3pk",
      label: "WD BR 3pk",
      children: [
        {
          id: "f3_wd_br_3pk_label",
          label: "Label",
          svgPath: "assets/f3/wd_br_3pk/label.svg",
        },
        {
          id: "f3_wd_br_3pk_ac",
          label: "AC",
          svgPath: "assets/f3/wd_br_3pk/ac.svg",
        },
        {
          id: "f3_wd_br_3pk_supply",
          label: "Supply",
          children: [
            {
              id: "f3_wd_br_3pk_sup_gs",
              label: "Grile",
              svgPath: "assets/f3/wd_br_3pk/gs.svg",
            },
            {
              id: "f3_wd_br_3pk_sup_ds",
              label: "Duct",
              svgPath: "assets/f3/wd_br_3pk/ds.svg",
            },
          ],
        },
        {
          id: "f3_wd_br_3pk_return",
          label: "Return",
          children: [
            {
              id: "f3_wd_br_3pk_ret_gr",
              label: "Grile",
              svgPath: "assets/f3/wd_br_3pk/gr.svg",
            },
            {
              id: "f3_wd_br_3pk_ret_dr",
              label: "Duct",
              svgPath: "assets/f3/wd_br_3pk/dr.svg",
            },
          ],
        },
      ],
    },
    {
      id: "f3_ku_3pk_right",
      label: "KU 3pk Right",
      children: [
        {
          id: "f3_ku_3pk_right_label",
          label: "Label",
          svgPath: "assets/f3/ku_3pk_right/label.svg",
        },
        {
          id: "f3_ku_3pk_right_ac",
          label: "AC",
          svgPath: "assets/f3/ku_3pk_right/ac.svg",
        },
        {
          id: "f3_ku_3pk_right_supply",
          label: "Supply",
          children: [
            {
              id: "f3_ku_3pk_right_sup_gs",
              label: "Grile",
              svgPath: "assets/f3/ku_3pk_right/gs.svg",
            },
            {
              id: "f3_ku_3pk_right_sup_ds",
              label: "Duct",
              svgPath: "assets/f3/ku_3pk_right/ds.svg",
            },
          ],
        },
        {
          id: "f3_ku_3pk_right_return",
          label: "Return",
          children: [
            {
              id: "f3_ku_3pk_right_ret_gr",
              label: "Grile",
              svgPath: "assets/f3/ku_3pk_right/gr.svg",
            },
            {
              id: "f3_ku_3pk_right_ret_dr",
              label: "Duct",
              svgPath: "assets/f3/ku_3pk_right/dr.svg",
            },
          ],
        },
      ],
    },
    {
      id: "f3_ku_3pk_left",
      label: "KU 3pk Left",
      children: [
        {
          id: "f3_ku_3pk_left_label",
          label: "Label",
          svgPath: "assets/f3/ku_3pk_left/label.svg",
        },
        {
          id: "f3_ku_3pk_left_ac",
          label: "AC",
          svgPath: "assets/f3/ku_3pk_left/ac.svg",
        },
        {
          id: "f3_ku_3pk_left_supply",
          label: "Supply",
          children: [
            {
              id: "f3_ku_3pk_left_sup_gs",
              label: "Grile",
              svgPath: "assets/f3/ku_3pk_left/gs.svg",
            },
            {
              id: "f3_ku_3pk_left_sup_ds",
              label: "Duct",
              svgPath: "assets/f3/ku_3pk_left/ds.svg",
            },
          ],
        },
        {
          id: "f3_ku_3pk_left_return",
          label: "Return",
          children: [
            {
              id: "f3_ku_3pk_left_ret_gr",
              label: "Grile",
              svgPath: "assets/f3/ku_3pk_left/gr.svg",
            },
            {
              id: "f3_ku_3pk_left_ret_dr",
              label: "Duct",
              svgPath: "assets/f3/ku_3pk_left/dr.svg",
            },
          ],
        },
      ],
    },
    {
      id: "f3_k1_3pk_right",
      label: "K1 3pk Right",
      children: [
        {
          id: "f3_k1_3pk_right_label",
          label: "Label",
          svgPath: "assets/f3/k1_3pk_right/label.svg",
        },
        {
          id: "f3_k1_3pk_right_ac",
          label: "AC",
          svgPath: "assets/f3/k1_3pk_right/ac.svg",
        },
        {
          id: "f3_k1_3pk_right_supply",
          label: "Supply",
          children: [
            {
              id: "f3_k1_3pk_right_sup_gs",
              label: "Grile",
              svgPath: "assets/f3/k1_3pk_right/gs.svg",
            },
            {
              id: "f3_k1_3pk_right_sup_ds",
              label: "Duct",
              svgPath: "assets/f3/k1_3pk_right/ds.svg",
            },
          ],
        },
        {
          id: "f3_k1_3pk_right_return",
          label: "Return",
          children: [
            {
              id: "f3_k1_3pk_right_ret_gr",
              label: "Grile",
              svgPath: "assets/f3/k1_3pk_right/gr.svg",
            },
            {
              id: "f3_k1_3pk_right_ret_dr",
              label: "Duct",
              svgPath: "assets/f3/k1_3pk_right/dr.svg",
            },
          ],
        },
      ],
    },
    {
      id: "f3_k2_3pk_left",
      label: "K2 3pk Left",
      children: [
        {
          id: "f3_k2_3pk_left_label",
          label: "Label",
          svgPath: "assets/f3/k2_3pk_left/label.svg",
        },
        {
          id: "f3_k2_3pk_left_ac",
          label: "AC",
          svgPath: "assets/f3/k2_3pk_left/ac.svg",
        },
        {
          id: "f3_k2_3pk_left_supply",
          label: "Supply",
          children: [
            {
              id: "f3_k2_3pk_left_sup_gs",
              label: "Grile",
              svgPath: "assets/f3/k2_3pk_left/gs.svg",
            },
            {
              id: "f3_k2_3pk_left_sup_ds",
              label: "Duct",
              svgPath: "assets/f3/k2_3pk_left/ds.svg",
            },
          ],
        },
        {
          id: "f3_k2_3pk_left_return",
          label: "Return",
          children: [
            {
              id: "f3_k2_3pk_left_ret_gr",
              label: "Grile",
              svgPath: "assets/f3/k2_3pk_left/gr.svg",
            },
            {
              id: "f3_k2_3pk_left_ret_dr",
              label: "Duct",
              svgPath: "assets/f3/k2_3pk_left/dr.svg",
            },
          ],
        },
      ],
    },
    { id: "f3_ceil", label: "ceil", svgPath: "assets/f3/ceil.svg" },
    { id: "f3_door", label: "door", svgPath: "assets/f3/door.svg" },
    { id: "f3_wall", label: "wall", svgPath: "assets/f3/wall.svg" },
  ],
};
