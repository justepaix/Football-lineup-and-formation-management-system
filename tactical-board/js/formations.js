// Each formation is a list of 11 spots.
// x and y are percentages of the pitch (0 to 100).
// x: 0 = left edge, 100 = right edge
// y: 0 = top (opponent goal), 100 = bottom (our goal)

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

      { pos: "LM", x: 14, y: 50 },
      { pos: "CM", x: 38, y: 54 },
      { pos: "CM", x: 62, y: 54 },
      { pos: "RM", x: 86, y: 50 },

      { pos: "ST", x: 38, y: 22 },
      { pos: "CF", x: 62, y: 26 }
    ]
  },

  "3-5-2": {
    label: "3-5-2 Midfield Control",
    spots: [
      { pos: "GK", x: 50, y: 90 },

      { pos: "CB", x: 25, y: 76 },
      { pos: "CB", x: 50, y: 79 },
      { pos: "CB", x: 75, y: 76 },

      { pos: "LWB", x: 10, y: 52 },
      { pos: "CM",  x: 30, y: 58 },
      { pos: "CDM", x: 50, y: 64 },
      { pos: "CM",  x: 70, y: 58 },
      { pos: "RWB", x: 90, y: 52 },

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

      { pos: "CDM", x: 38, y: 62 },
      { pos: "CDM", x: 62, y: 62 },

      { pos: "LM",  x: 18, y: 38 },
      { pos: "CAM", x: 50, y: 40 },
      { pos: "RM",  x: 82, y: 38 },

      { pos: "ST", x: 50, y: 16 }
    ]
  }

};

// The positions a coach can choose from (ordered roughly back to front)
const POSITIONS = [
  "GK",
  "CB", "LB", "LWB", "RB", "RWB",
  "CDM", "CM", "CAM", "LM", "RM",
  "LW", "RW", "CF", "ST"
];