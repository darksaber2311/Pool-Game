# Pool Game

A browser-based pool/billiards game built with HTML5 Canvas and vanilla JavaScript. Features realistic physics, collision detection, and smooth gameplay.

Project live at : https://darksaber2311.github.io/Pool-Game/

## 🎮 Features

- **Physics-based gameplay**: Realistic ball movement with friction and collision detection
- **Interactive controls**: Mouse and touch support for aiming and shooting
- **Visual feedback**: 
  - Aiming line when dragging
  - Power indicator with color-coded strength (blue/yellow/red)
  - Blinking animation when striker is ready
- **Score tracking**: 
  - Earn 10 points for each ball pocketed
  - Lose 10 points if the striker is pocketed
  - Personal best score tracking
- **4 corner pockets**: Classic pool table layout
- **8 target balls**: Arranged in a triangle formation (orange and blue balls)

## 🚀 Getting Started

### Prerequisites

No dependencies required! Just a modern web browser.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/darksaber2311/Pool-Game.git
cd Pool
```

2. Open `index.html` in your web browser

That's it! No build process or package installation needed.

## 🎯 How to Play

1. **Aim**: Click and drag from the red striker ball to aim your shot
2. **Power**: The distance you drag determines the power of your shot
   - Blue circle = low power
   - Yellow circle = medium power
   - Red circle = high power
3. **Shoot**: Release the mouse/touch to shoot
4. **Goal**: Pocket all the colored balls (orange and blue) to maximize your score
5. **Avoid**: Don't pocket the red striker ball or you'll lose points!

### Controls

- **Desktop**: Click and drag with mouse
- **Mobile/Tablet**: Touch and drag with finger
- **Reset**: Click the "Restart" button to reset the game

## 📁 Project Structure

```
Pool/
├── index.html      # Main HTML file
├── index.js        # Game logic and physics
├── style.css       # Styling
└── README.md       # This file
```

## 🛠️ Technologies Used

- **HTML5**: Structure
- **CSS3**: Styling
- **JavaScript (ES6+)**: Game logic and physics
- **Canvas API**: Rendering and graphics

## 🎨 Game Mechanics

- **Collision Detection**: 2D elastic collision physics with proper momentum conservation
- **Friction**: Gradual deceleration when balls are in motion
- **Wall Bouncing**: Balls bounce off table boundaries
- **Overlap Resolution**: Prevents balls from getting stuck inside each other

## 📝 Notes

- Personal best score is tracked during your session (resets on page refresh)
- All physics calculations are done in real-time
- The game is responsive and works on both desktop and mobile devices

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.



## 🎮 Enjoy!

Have fun playing and try to beat your personal best score!

