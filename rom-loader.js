const canvas = document.getElementById('nes-canvas');
const ctx = canvas.getContext('2d');

// Initialize JSNES core emulator
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
const KEY_MAP = {
    "ArrowUp":    jsnes.Controller.BUTTON_UP,
    "ArrowDown":  jsnes.Controller.BUTTON_DOWN,
    "ArrowLeft":  jsnes.Controller.BUTTON_LEFT,
    "ArrowRight": jsnes.Controller.BUTTON_RIGHT,
    "z":          jsnes.Controller.BUTTON_A,      // Throw pepper
    "x":          jsnes.Controller.BUTTON_B,
    "Enter":      jsnes.Controller.BUTTON_START,  // Start game
    "Shift":      jsnes.Controller.BUTTON_SELECT  // Game select
};

// Press button down
window.addEventListener("keydown", (event) => {
    const button = KEY_MAP[event.key];
    if (button !== undefined) {
        nes.buttonDown(1, button);
        event.preventDefault(); // Prevents the browser page from scrolling up/down
    }
});

// Release button up
window.addEventListener("keyup", (event) => {
    const button = KEY_MAP[event.key];
    if (button !== undefined) {
        nes.buttonUp(1, button);
        event.preventDefault();
    }
});

// --- LOAD THE SPECIFIC BURGER TIME ROM ---
fetch('Burger_time.nes') 
    .then(response => {
        if (!response.ok) {
            throw new Error(`Could not find the file Burger_time.nes (Status: ${response.status})`);
        }
        return response.arrayBuffer();
    })
    .then(buffer => {
        const romData = new Uint8Array(buffer);
        let binaryString = "";
        for (let i = 0; i < romData.length; i++) {
            binaryString += String.fromCharCode(romData[i]);
        }
        nes.loadROM(binaryString);
        
        // Run the emulator loop at 60 Frames Per Second
        setInterval(nes.frame, 1000 / 60);
        console.log("Burger_time.nes loaded successfully!");
    })
    .catch(err => {
        console.error("Error loading the game:", err.message);
        alert("Failed to load Burger_time.nes. Please check your browser console for details.");
    });
