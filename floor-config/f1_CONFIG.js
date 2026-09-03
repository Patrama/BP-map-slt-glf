/** @format */

export const CONFIG_1ST_FLOOR = {
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

export const STRUCTURE_1ST_FLOOR = {
  id: "floor_1",
  label: "1st Floor",
  children: [
    { id: "f1_light", label: "1. Light", svgPath: "assets/f1/light.svg" },
    {
      id: "f1_dinningRoom",
      label: "2. Dinning Room",
      children: [
        {
          id: "f1_dinning_2_5pk",
          label: "A. 3 PK - Parent Room",
          children: [
            {
              id: "f1_d_2_5_label",
              label: "1. Label",
              svgPath: "assets/f1/dinning/2_5_label.svg",
            },
            {
              id: "f1_d_2_5_ac",
              label: "2. AC",
              svgPath: "assets/f1/dinning/2_5_ac.svg",
            },
            {
              id: "f1_d_2_5_return",
              label: "3. Return",
              children: [
                {
                  id: "f1_d_2_5_ret_grile",
                  label: "A. Grile",
                  svgPath: "assets/f1/dinning/2_5_ret_grile.svg",
                },
                {
                  id: "f1_d_2_5_ret_duct",
                  label: "B. Duct",
                  svgPath: "assets/f1/dinning/2_5_ret_duct.svg",
                },
              ],
            },
            {
              id: "f1_d_2_5_supply",
              label: "4. Supply",
              children: [
                {
                  id: "f1_d_2_5_sup_grile",
                  label: "A. Grile",
                  svgPath: "assets/f1/dinning/2_5_sup_grile.svg",
                },
                {
                  id: "f1_d_2_5_sup_duct",
                  label: "B. Duct",
                  svgPath: "assets/f1/dinning/2_5_sup_duct.svg",
                },
              ],
            },
          ],
        },
        {
          id: "f1_dinning_3pk_top",
          label: "B. 3 PK - Dinning TOP",
          children: [
            {
              id: "f1_d_3top_label",
              label: "1. Label",
              svgPath: "assets/f1/dinning/3top_label.svg",
            },
            {
              id: "f1_d_3top_ac",
              label: "2. AC",
              svgPath: "assets/f1/dinning/3top_ac.svg",
            },
            {
              id: "f1_d_3top_return",
              label: "3. Return",
              children: [
                {
                  id: "f1_d_3top_ret_grile",
                  label: "A. Grile",
                  svgPath: "assets/f1/dinning/3top_ret_grile.svg",
                },
                {
                  id: "f1_d_3top_ret_duct",
                  label: "B. Duct",
                  svgPath: "assets/f1/dinning/3top_ret_duct.svg",
                },
              ],
            },
            {
              id: "f1_d_3top_supply",
              label: "4. Supply",
              children: [
                {
                  id: "f1_d_3top_sup_grile",
                  label: "A. Grile",
                  svgPath: "assets/f1/dinning/3top_sup_grile.svg",
                },
                {
                  id: "f1_d_3top_sup_duct",
                  label: "B. Duct",
                  svgPath: "assets/f1/dinning/3top_sup_duct.svg",
                },
              ],
            },
          ],
        },
        {
          id: "f1_dinning_3pk_bot",
          label: "C. 3 PK - Dinning BOT",
          children: [
            {
              id: "f1_d_3bot_label",
              label: "1. Label",
              svgPath: "assets/f1/dinning/3bot_label.svg",
            },
            {
              id: "f1_d_3bot_ac",
              label: "2. AC",
              svgPath: "assets/f1/dinning/3bot_ac.svg",
            },
            {
              id: "f1_d_3bot_return",
              label: "3. Return",
              children: [
                {
                  id: "f1_d_3bot_ret_grile",
                  label: "A. Grile",
                  svgPath: "assets/f1/dinning/3bot_ret_grile.svg",
                },
                {
                  id: "f1_d_3bot_ret_duct",
                  label: "B. Duct",
                  svgPath: "assets/f1/dinning/3bot_ret_duct.svg",
                },
              ],
            },
            {
              id: "f1_d_3bot_supply",
              label: "4. Supply",
              children: [
                {
                  id: "f1_d_3bot_sup_grile",
                  label: "A. Grile",
                  svgPath: "assets/f1/dinning/3bot_sup_grile.svg",
                },
                {
                  id: "f1_d_3bot_sup_duct",
                  label: "B. Duct",
                  svgPath: "assets/f1/dinning/3bot_sup_duct.svg",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "f1_storageBathKitchen",
      label: "3. Storage Bathroom Kitchen",
      children: [
        {
          id: "f1_sbk_label",
          label: "Label",
          svgPath: "assets/f1/sbk/label.svg",
        },
        { id: "f1_sbk_ac", label: "AC", svgPath: "assets/f1/sbk/ac.svg" },
        {
          id: "f1_sbk_return",
          label: "Return",
          children: [
            {
              id: "f1_sbk_ret_grile",
              label: "Grile",
              svgPath: "assets/f1/sbk/ret_grile.svg",
            },
            {
              id: "f1_sbk_ret_duct",
              label: "Duct",
              svgPath: "assets/f1/sbk/ret_duct.svg",
            },
          ],
        },
        {
          id: "f1_sbk_supply",
          label: "Supply",
          children: [
            {
              id: "f1_sbk_sup_grile",
              label: "Grile",
              svgPath: "assets/f1/sbk/sup_grile.svg",
            },
            {
              id: "f1_sbk_sup_duct",
              label: "Duct",
              svgPath: "assets/f1/sbk/sup_duct.svg",
            },
          ],
        },
      ],
    },
    {
      id: "f1_garage",
      label: "4. Garage",
      children: [
        {
          id: "f1_garage_2pk",
          label: "A. 2 PK - Voyer",
          children: [
            {
              id: "f1_g_2_label",
              label: "1. Label",
              svgPath: "assets/f1/garage/2_label.svg",
            },
            {
              id: "f1_g_2_ac",
              label: "2. AC",
              svgPath: "assets/f1/garage/2_ac.svg",
            },
            {
              id: "f1_g_2_return",
              label: "3. Return",
              children: [
                {
                  id: "f1_g_2_ret_grile",
                  label: "A. Grile",
                  svgPath: "assets/f1/garage/2_ret_grile.svg",
                },
                {
                  id: "f1_g_2_ret_duct",
                  label: "B. Duct",
                  svgPath: "assets/f1/garage/2_ret_duct.svg",
                },
              ],
            },
            {
              id: "f1_g_2_supply",
              label: "4. Supply",
              children: [
                {
                  id: "f1_g_2_sup_grile",
                  label: "A. Grile",
                  svgPath: "assets/f1/garage/2_sup_grile.svg",
                },
                {
                  id: "f1_g_2_sup_duct",
                  label: "B. Duct",
                  svgPath: "assets/f1/garage/2_sup_duct.svg",
                },
              ],
            },
          ],
        },
        {
          id: "f1_garage_4pk",
          label: "B. 4 PK - Garage",
          children: [
            {
              id: "f1_g_4_label",
              label: "1. Label",
              svgPath: "assets/f1/garage/4_label.svg",
            },
            {
              id: "f1_g_4_ac",
              label: "2. AC",
              svgPath: "assets/f1/garage/4_ac.svg",
            },
            {
              id: "f1_g_4_return",
              label: "3. Return",
              children: [
                {
                  id: "f1_g_4_ret_grile",
                  label: "A. Grile",
                  svgPath: "assets/f1/garage/4_ret_grile.svg",
                },
                {
                  id: "f1_g_4_ret_duct",
                  label: "B. Duct",
                  svgPath: "assets/f1/garage/4_ret_duct.svg",
                },
              ],
            },
            {
              id: "f1_g_4_supply",
              label: "4. Supply",
              children: [
                {
                  id: "f1_g_4_sup_grile",
                  label: "A. Grile",
                  svgPath: "assets/f1/garage/4_sup_grile.svg",
                },
                {
                  id: "f1_g_4_sup_duct",
                  label: "B. Duct",
                  svgPath: "assets/f1/garage/4_sup_duct.svg",
                },
              ],
            },
          ],
        },
      ],
    },
    { id: "f1_ceiling", label: "5. Ceiling", svgPath: "assets/f1/ceiling.svg" },
    { id: "f1_wall", label: "6. Wall", svgPath: "assets/f1/wall.svg" },
  ],
};
