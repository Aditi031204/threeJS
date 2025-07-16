# 🌍 Solar System 3D Simulation (JavaScript + Three.js)

An interactive 3D simulation of our solar system using **pure JavaScript** and **Three.js**. This project visualizes all 8 planets orbiting the sun with realistic textures, lighting, and speed controls — all styled and animated **without using any CSS animations**, strictly adhering to the assignment guidelines.

## ✨ Features

### 🔭 Core Functionalities
- Sun at the center with glowing texture
- 8 planets (Mercury to Neptune) orbiting in real-time
- Realistic planet sizes, textures, and distances
- Smooth orbital motion via `THREE.Clock` + `requestAnimationFrame`

### 🎛️ Speed Control System
- Sliders to control each planet’s orbital speed (0.001 to 0.1)
- Immediate response to slider adjustments
- Controlled purely using JavaScript DOM manipulation

### 🌌 Background & Scene
- Starfield backdrop using particle system
- Ambient and point lighting to simulate sunlight
- Responsive canvas (adapts to window size)

## 🛠 Technology Used

- **Three.js**: For 3D rendering and scene management
- **JavaScript**: For UI, DOM, and animation logic
- **No CSS Animations**: All transitions are handled programmatically

## 📂 File Structure
├── audio
  └── space-ambience.mp3
├── index.html 
├── script.js
└── README.md 


## 🧪 Assignment Compliance

- ✅ No CSS animations used
- ✅ All animations handled by JavaScript
- ✅ Pure Three.js for rendering and motion
- ✅ Clean and modular code

## 🔊 Background Music (✨ Add-on Feature by Me)
As an additional enhancement implemented by me, this simulation includes immersive space-themed background music to elevate the user experience.

🎧 How It Works
A THREE.AudioListener is added to the camera.
Ambient music (space-ambience.mp3) is loaded and attached to a global audio source using THREE.AudioLoader.

The audio:
- Loops continuously
- Starts at a moderate volume (0.5)

🚨 Important: Browser Autoplay Policy
Due to autoplay restrictions in modern browsers (especially Chrome, Edge, Safari)

## 👩‍💻 Author
Created by Aditi Singh Thakur