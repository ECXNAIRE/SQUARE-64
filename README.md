A fully playable chess game buil from scratch using **HTML, CSS, and Vanilla JavaScript**.

![DEMO](video-link-here)

---

# MOTIVATION
I wanted to challenge myself by building one of the most logic-heavy game without using any external chess libraries or engine.
Instead of relying on prebuilt solutions, every chess rule was implemented manually to improve my problem solving skills and understanding the game logic.

THIS PROJECT WAS BUILT AS MY SUBMISSION FOR **#beest**.

--- 

# FEATURES
- ✅ Complete chess rules
- ✅ Legal move validation 
- ✅ Check detection
- ✅ Checkmate detection
- ✅ Stalemate detection
- ✅ Kingside and Queenside Castling
- ✅ En Passant
- ✅ Pawn Promotion
- ✅ Chess Timer
- ✅ Timeout Victoy
- ✅ Captured pieces tracker
- ✅ Real Algebric Chess Notaion
- ✅ Move History Panel
- ✅ Automatic Board Flip
- ✅ Light / Dark theme in main chess area
- ✅ Game Result Cards

---

# TECH STACK\

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Canvas API](https://img.shields.io/badge/Canvas_API-000000?style=for-the-badge&logo=html5&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

No frameworks or external chess libraries were used

---

# HOW TO RUN 
1. Clone the repo
```bash
git clone https://github.com/ECXNAIRE/square64.git
```

2. Open the project folder

3. Run a local server

4. Open the game in your browser

---

# HOW TO PLAY
- Click a piece to view all legal moves.
- Click a highlighted square to move.
- The board automatically rotates after every move.
- Special moves such as Castling, En Passant and Promotion are fully supported.
- The move history record every move using standard chess notation.
- Win by:
    - Checkmate
    - Opponent's timer running out
    - Stalemate

---

# HOW IT WORKS
The game uses a custom chess engine written entirely in Javasctipt.

### Board Representation
The chess board is stored as an 8X8 array.

```js
board = ["bR", "bN", "bB", "bQ", "bK", "bB", "bN", "bR"],
        ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
        ["wR", "wN", "wB", "wQ", "wK", "wB", "wN", "wR"]
```
Each piece is represented using two characters:
- `wK` => White King
- `bQ` => Black Queen
- `wP` => White Pawn

### Move Validation
Every piece has its own movement rules.

Before a move is accepted, the engine verifies:

- Piece movement
- Path obstruction
- Friendly piece collison
- Special move condition
- King safety

Only completluy legal moves are allowed.

### Game Rules
The engine also handles:

- Check
- Checkmate
- Stalemate
- Castling
- En Passant
- Pawn Promotion

These are calculated manually 

### Rendering
The board and pieces are rendered usin the HTML canvas API.
After every move, the canvas redraws:
- Chessboard
- Pieces
- Selected square
- Legal Moves
- Check indicators

### Move History
Moves are converted into standaed Algebric Chess Notation before being displayed in the move history panel

---

#  Project Structure
```
/
├── static/
│   ├── js/
│   ├── assets/
│   ├── img/
│   └── css/
│
├── templates/
│
└── README.md
```

---

# FUTURE IMPROVEMENTS
- Undo / Redo
- Threefold Repetition
- Fifty-Move Rule
- PGN Export
- Multiplayer
- Opening Explorer