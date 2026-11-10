const FORMATIONS = {
  "4-3-3": {
    label: "4-3-3 Attacking",
    spots: [
      { pos: "GK", x: 50, y: 90 },

      { pos: "LB", x: 14, y: 72 },
      { pos: "CB", x: 38, y: 76 },
      { pos: "CB", x: 62, y: 76 },
      { pos: "RB", x: 86, y: 72 },

      { pos: "CM", x: 30, y: 54 },
      { pos: "CM", x: 50, y: 58 },
      { pos: "CM", x: 70, y: 54 },

      { pos: "LW", x: 18, y: 26 },
      { pos: "ST", x: 50, y: 18 },
      { pos: "RW", x: 82, y: 26 }
    ]
  },
  "4-4-2": {
    label: "4-4-2 Classic",
    spots: [
      { pos: "GK", x: 50, y: 90 },

      { pos: "LB", x: 14, y: 72 },
      { pos: "CB", x: 38, y: 76 },
      { pos: "CB", x: 62, y: 76 },
      { pos: "RB", x: 86, y: 72 },

      { pos: "LW", x: 14, y: 50 },
      { pos: "CM", x: 38, y: 54 },
      { pos: "CM", x: 62, y: 54 },
      { pos: "RW", x: 86, y: 50 },

      { pos: "ST", x: 38, y: 22 },
      { pos: "ST", x: 62, y: 22 }
    ]
  },
  "3-5-2": {
    label: "3-5-2 Midfield Control",
    spots: [
      { pos: "GK", x: 50, y: 90 },

      { pos: "CB", x: 25, y: 76 },
      { pos: "CB", x: 50, y: 79 },
      { pos: "CB", x: 75, y: 76 },

      { pos: "LB", x: 10, y: 52 },   // acts as left wing-back
      { pos: "CM", x: 30, y: 58 },
      { pos: "CM", x: 50, y: 62 },
      { pos: "CM", x: 70, y: 58 },
      { pos: "RB", x: 90, y: 52 },   // acts as right wing-back

      { pos: "ST", x: 38, y: 22 },
      { pos: "ST", x: 62, y: 22 }
    ]
  },
  "4-2-3-1": {
    label: "4-2-3-1 Defensive",
    spots: [
      { pos: "GK", x: 50, y: 90 },

      { pos: "LB", x: 14, y: 72 },
      { pos: "CB", x: 38, y: 76 },
      { pos: "CB", x: 62, y: 76 },
      { pos: "RB", x: 86, y: 72 },

      { pos: "CM", x: 38, y: 60 },
      { pos: "CM", x: 62, y: 60 },

      { pos: "LW", x: 18, y: 38 },
      { pos: "CM", x: 50, y: 40 },
      { pos: "RW", x: 82, y: 38 },

      { pos: "ST", x: 50, y: 16 }
    ]
  }
};