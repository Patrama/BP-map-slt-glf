/** @format */

export const CONFIG = {
  zoom: {
    min: 0.2,
    max: 10,
    sensitivity: 0.0015,
  },
  // Base Functional Priority Levels mapped to CSS z-index values
  zPriorityMap: {
    light: 80, // Priority 1
    label: 70, // Priority 2
    ac: 60, // Priority 3
    grille: 50, // Priority 4
    supply: 40, // Priority 5
    return: 30, // Priority 6
    ceiling: 20, // Priority 7
    wall: 10, // Priority 8
  },
};

export const STRUCTURE_DATA = [
  { id: "light", label: "1. Light", svgPath: "assets/light.svg" },
  {
    id: "dinningRoom",
    label: "2. Dinning Room",
    children: [
      {
        id: "dinning_2_5pk",
        label: "A. 2.5 PK - Parent Room",
        children: [
          {
            id: "d_2_5_label",
            label: "1. Label",
            svgPath: "assets/dinning/2_5_label.svg",
          },
          {
            id: "d_2_5_ac",
            label: "2. AC",
            svgPath: "assets/dinning/2_5_ac.svg",
          },
          {
            id: "d_2_5_return",
            label: "3. Return",
            children: [
              {
                id: "d_2_5_ret_grile",
                label: "A. Grile",
                svgPath: "assets/dinning/2_5_ret_grile.svg",
              },
              {
                id: "d_2_5_ret_duct",
                label: "B. Duct",
                svgPath: "assets/dinning/2_5_ret_duct.svg",
              },
            ],
          },
          {
            id: "d_2_5_supply",
            label: "4. Supply",
            children: [
              {
                id: "d_2_5_sup_grile",
                label: "A. Grile",
                svgPath: "assets/dinning/2_5_sup_grile.svg",
              },
              {
                id: "d_2_5_sup_duct",
                label: "B. Duct",
                svgPath: "assets/dinning/2_5_sup_duct.svg",
              },
            ],
          },
        ],
      },
      {
        id: "dinning_3pk_top",
        label: "B. 3 PK - Dinning TOP",
        children: [
          {
            id: "d_3top_label",
            label: "1. Label",
            svgPath: "assets/dinning/3top_label.svg",
          },
          {
            id: "d_3top_ac",
            label: "2. AC",
            svgPath: "assets/dinning/3top_ac.svg",
          },
          {
            id: "d_3top_return",
            label: "3. Return",
            children: [
              {
                id: "d_3top_ret_grile",
                label: "A. Grile",
                svgPath: "assets/dinning/3top_ret_grile.svg",
              },
              {
                id: "d_3top_ret_duct",
                label: "B. Duct",
                svgPath: "assets/dinning/3top_ret_duct.svg",
              },
            ],
          },
          {
            id: "d_3top_supply",
            label: "4. Supply",
            children: [
              {
                id: "d_3top_sup_grile",
                label: "A. Grile",
                svgPath: "assets/dinning/3top_sup_grile.svg",
              },
              {
                id: "d_3top_sup_duct",
                label: "B. Duct",
                svgPath: "assets/dinning/3top_sup_duct.svg",
              },
            ],
          },
        ],
      },
      {
        id: "dinning_3pk_bot",
        label: "C. 3 PK - Dinning BOT",
        children: [
          {
            id: "d_3bot_label",
            label: "1. Label",
            svgPath: "assets/dinning/3bot_label.svg",
          },
          {
            id: "d_3bot_ac",
            label: "2. AC",
            svgPath: "assets/dinning/3bot_ac.svg",
          },
          {
            id: "d_3bot_return",
            label: "3. Return",
            children: [
              {
                id: "d_3bot_ret_grile",
                label: "A. Grile",
                svgPath: "assets/dinning/3bot_ret_grile.svg",
              },
              {
                id: "d_3bot_ret_duct",
                label: "B. Duct",
                svgPath: "assets/dinning/3bot_ret_duct.svg",
              },
            ],
          },
          {
            id: "d_3bot_supply",
            label: "4. Supply",
            children: [
              {
                id: "d_3bot_sup_grile",
                label: "A. Grile",
                svgPath: "assets/dinning/3bot_sup_grile.svg",
              },
              {
                id: "d_3bot_sup_duct",
                label: "B. Duct",
                svgPath: "assets/dinning/3bot_sup_duct.svg",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "storageBathKitchen",
    label: "3. Storage Bathroom Kitchen",
    children: [
      { id: "sbk_label", label: "1. Label", svgPath: "assets/sbk/label.svg" },
      { id: "sbk_ac", label: "2. AC", svgPath: "assets/sbk/ac.svg" },
      {
        id: "sbk_return",
        label: "3. Return",
        children: [
          {
            id: "sbk_ret_grile",
            label: "A. Grile",
            svgPath: "assets/sbk/ret_grile.svg",
          },
          {
            id: "sbk_ret_duct",
            label: "B. Duct",
            svgPath: "assets/sbk/ret_duct.svg",
          },
        ],
      },
      {
        id: "sbk_supply",
        label: "4. Supply",
        children: [
          {
            id: "sbk_sup_grile",
            label: "A. Grile",
            svgPath: "assets/sbk/sup_grile.svg",
          },
          {
            id: "sbk_sup_duct",
            label: "B. Duct",
            svgPath: "assets/sbk/sup_duct.svg",
          },
        ],
      },
    ],
  },
  {
    id: "garage",
    label: "4. Garage",
    children: [
      {
        id: "garage_2pk",
        label: "A. 2 PK - Voyer",
        children: [
          {
            id: "g_2_label",
            label: "1. Label",
            svgPath: "assets/garage/2_label.svg",
          },
          { id: "g_2_ac", label: "2. AC", svgPath: "assets/garage/2_ac.svg" },
          {
            id: "g_2_return",
            label: "3. Return",
            children: [
              {
                id: "g_2_ret_grile",
                label: "A. Grile",
                svgPath: "assets/garage/2_ret_grile.svg",
              },
              {
                id: "g_2_ret_duct",
                label: "B. Duct",
                svgPath: "assets/garage/2_ret_duct.svg",
              },
            ],
          },
          {
            id: "g_2_supply",
            label: "4. Supply",
            children: [
              {
                id: "g_2_sup_grile",
                label: "A. Grile",
                svgPath: "assets/garage/2_sup_grile.svg",
              },
              {
                id: "g_2_sup_duct",
                label: "B. Duct",
                svgPath: "assets/garage/2_sup_duct.svg",
              },
            ],
          },
        ],
      },
      {
        id: "garage_4pk",
        label: "B. 4 PK - Garage",
        children: [
          {
            id: "g_4_label",
            label: "1. Label",
            svgPath: "assets/garage/4_label.svg",
          },
          { id: "g_4_ac", label: "2. AC", svgPath: "assets/garage/4_ac.svg" },
          {
            id: "g_4_return",
            label: "3. Return",
            children: [
              {
                id: "g_4_ret_grile",
                label: "A. Grile",
                svgPath: "assets/garage/4_ret_grile.svg",
              },
              {
                id: "g_4_ret_duct",
                label: "B. Duct",
                svgPath: "assets/garage/4_ret_duct.svg",
              },
            ],
          },
          {
            id: "g_4_supply",
            label: "4. Supply",
            children: [
              {
                id: "g_4_sup_grile",
                label: "A. Grile",
                svgPath: "assets/garage/4_sup_grile.svg",
              },
              {
                id: "g_4_sup_duct",
                label: "B. Duct",
                svgPath: "assets/garage/4_sup_duct.svg",
              },
            ],
          },
        ],
      },
    ],
  },
  { id: "ceiling", label: "5. Ceiling", svgPath: "assets/ceiling.svg" },
  { id: "wall", label: "6. Wall", svgPath: "assets/wall.svg" },
];
