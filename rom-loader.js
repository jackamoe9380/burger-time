const canvas = document.getElementById('nes-canvas');
const ctx = canvas.getContext('2d');

// Initialize JSNES emulator core
const nes = new jsnes.NES({
    onFrame: (buffer) => {
        const imageData = ctx.getImageData(0, 0, 256, 240);
        const data = imageData.data;
        for (let i = 0; i < buffer.length; i++) {
            data[i] = buffer[i];
        }
        ctx.putImageData(imageData, 0, 0);
    }
});

// --- KEYBOARD CONTROLLER MAPPING ---
// Map your PC keyboard keys to JSNES Controller 1 inputs
const KEY_MAP = {
    "ArrowUp":    jsnes.Controller.BUTTON_UP,
    "ArrowDown":  jsnes.Controller.BUTTON_DOWN,
    "ArrowLeft":  jsnes.Controller.BUTTON_LEFT,
    "ArrowRight": jsnes.Controller.BUTTON_RIGHT,
    "z":          jsnes.Controller.BUTTON_A,      // Throw pepper in BurgerTime
    "x":          jsnes.Controller.BUTTON_B,
    "Enter":      jsnes.Controller.BUTTON_START,  // Start game
    "Shift":      jsnes.Controller.BUTTON_SELECT  // Select game mode
};

// Listen for keys being pressed down
window.addEventListener("keydown", (event) => {
    const button = KEY_MAP[event.key];
    if (button !== undefined) {
        nes.buttonDown(1, button); // 1 = Controller 1
        event.preventDefault();    // Stops the webpage from scrolling
    }
});

// Listen for keys being released
window.addEventListener("keyup", (event) => {
    const button = KEY_MAP[event.key];
    if (button !== undefined) {
        nes.buttonUp(1, button);
        event.preventDefault();
    }
});

// --- LOAD BURGERTIME ROM ---
fetch('Burger_time.nes') // Ensure your ROM file matches this exact filename
    .then(response => response.arrayBuffer())
    .then(buffer => {
        const romData = new Uint8Array(buffer);
        let binaryString = "";
        for (let i = 0; i < romData.length; i++) {
            binaryString += String.fromCharCode(romData[i]);
        }
        nes.loadROM(binaryString);
        
        // Emulation loop running at 60 frames per second
        setInterval(nes.frame, 1000 / 60);
    })
    .catch(err => console.error("Error loading BurgerTime:", err));
