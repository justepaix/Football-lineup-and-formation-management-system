```
 _____  _    ____ _____ ___ ____    _    _     
|_   _|/ \  / ___|_   _|_ _/ ___|  / \  | |    
  | | / _ \| |     | |  | | |     / _ \ | |    
  | |/ ___ \ |___  | |  | | |___ / ___ \| |___ 
  |_/_/   \_\____| |_| |___\____/_/   \_\_____|

 ____   ___    _    ____  ____  
| __ ) / _ \  / \  |  _ \|  _ \ 
|  _ \| | | |/ _ \ | |_) | | | |
| |_) | |_| / ___ \|  _ <| |_| |
|____/ \___/_/   \_\_| \_\____/ 
```

# Football Tactical Lineup Board

An interactive 2D pitch board where coaches can pick a formation, drag player tokens into position, manage substitutes, and save named tactical lineups. Built with plain HTML, CSS and JavaScript. No backend, no libraries.

## Features

- Football pitch drawn with SVG (goals, penalty boxes, six-yard boxes, center circle)
- Four formation presets: 4-3-3 Attacking, 4-4-2 Classic, 3-5-2 Midfield Control, 4-2-3-1 Defensive
- Draggable player tokens (mouse and touch)
- Click a token to set a player's name, jersey number and position
- 15 positions: GK, CB, LB, LWB, RB, RWB, CDM, CM, CAM, LM, RM, LW, RW, CF, ST
- Jersey number validation (1-99, no duplicates)
- Substitutes bench (up to 9): add, edit, remove, and swap with a starter
- Save lineups with custom names, then load, rename or delete them
- Responsive layout for desktop and phone

## How to run

1. Clone this repository
2. Open `index.html` in any modern browser

No installation or server needed.

## How to use

1. Choose a formation from the dropdown
2. Drag tokens to adjust positions
3. Click a token to edit the player (name, number, position)
4. Add substitutes in the sidebar. Press the swap button on a sub, then click a player on the pitch
5. Type a name and press **Save** to store the lineup. Use **Load** to bring it back later
6. **Reset board** clears the board and bench (saved lineups are kept)

## Project structure

```
tactical-board/
├── index.html
├── style.css      (layout, pitch, tokens, dialog, bench, saved list)
├── js/
│   ├── formations.js  (formation data and position list)
│   ├── storage.js     (reads and writes localStorage)
│   ├── board.js       (pitch, dragging, player dialog, bench)
│   └── lineups.js     (save, load, rename, delete, reset)
└── README.md
```

## How it works

- The app keeps two arrays, `players` (the 11 on the pitch) and `bench`. Functions like `drawTokens()` and `drawBench()` paint them on screen whenever the data changes.
- **Formations are data.** Each formation is a list of 11 spots with a position label and x/y percentages, so adding a formation only means adding data.
- **Percent coordinates.** Tokens are placed with percentages, so the board scales to any screen size.
- **Pointer events** handle dragging, so the same code works with a mouse and a finger.
- **localStorage** stores saved lineups as JSON text in the browser.

## Limitations

- Saved lineups live in one browser on one device (that's how localStorage works)
- The live board is not auto-saved, so refreshing the page resets it (saved lineups stay)

## Possible future improvements

- Export and import lineups as a file
- Team color picker
- Auto-save of the live board