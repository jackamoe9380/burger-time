// --- LOAD THE SPECIFIC GAME ROM ---
fetch('Burger_time.nes')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Could not find the file Burger_time.nes (Status Code: ${response.status})`);
        }
        return response.arrayBuffer();
    })
    .then(buffer => {
        const romBytes = new Uint8Array(buffer);
        
        // Convert binary structural arrays into data strings required by the engine
        let romBinaryString = "";
        for (let i = 0; i < romBytes.length; i++) {
            romBinaryString += String.fromCharCode(romBytes[i]);
        }

        // --- NEW UPDATED ENGINE INITIALIZATION ---
        // This upgraded system handles canvas rendering, timing, and keyboard layouts out-of-the-box!
        var nesBrowserPlayer = new jsnes.Browser({
            container: document.getElementById("nes-container"),
            romData: romBinaryString
        });

        console.log("Burger_time.nes successfully loaded into the engine!");
    })
    .catch(error => {
        console.error("Emulator Boot Failure:", error.message);
        alert("Failed to boot game: " + error.message);
    });
