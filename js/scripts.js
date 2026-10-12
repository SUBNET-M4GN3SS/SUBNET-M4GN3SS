// ========================================
// SUBNET M4GN3SS // SYSTEM BOOT SEQUENCE
// ========================================

import { Node } from "./node";

const commandForm = document.getElementById("command-form");
const terminalOutput = document.getElementById("terminal-output");
const commandInput = document.getElementById("command-input");
const nodeStatus = document.getElementById("node-status");
const accessStatus = document.getElementById("access-status");
const clock = document.getElementById("clock");
const dividerLine = "-".repeat(20);

const  commandAndDescriptionDict = {
    "Nodes": "Identify connected nodes",
    "Navigate": "Navigate to a connected node",
    "Read": "Read a text file",
    "Scan": "Scan the current node for files",
    "Downlaod": "Download a file"
};

const network = {
    N1: ["N2", "N3"],
    N2: ["N1", "N4"],
    N3: ["N1"],
    N4: ["N2"]
};

const node1 = new Node("N1", "nodes/index.html", "active", ["N2", "N3"], []);
const node2= new Node("N2", "nodes/node2.html", "active", ["N1", "N4"], []);
const node3 = new Node("N3", "nodes/node3.html", "active", ["N1"], []);
const node4 = new Node("N4", "nodes/node4.html", "active", ["N2"], []);

let currentNode = "N1";

commandForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const input = commandInput.value;
    commandInput.value = "";

    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const argument = parts[1];

    if(!command) return;

    switch (command) {
        case "help":
            terminalOutput.replaceChildren();

            await printBootMessage("AVAILABLE COMMANDS", "accent");
            await printBootMessage(dividerLine,"dim");

            for(const [key, value] of Object.entries(commandAndDescriptionDict)){
                var commandsAndDescriptionText = `${key}: ${value}`;

                await printBootMessage(commandsAndDescriptionText);
            };

            await printBootMessage(dividerLine, "dim");

            break;

        case "nodes":
            //Find all available node connections
            const connections = network[currentNode];

            if(connections){
                terminalOutput.replaceChildren();
                await printBootMessage("Connected Nodes", "accent");
                await printBootMessage(dividerLine, "dim");

                for(const node of connections)
                    await printBootMessage(`> ${node}`, "warning");

                await printBootMessage(dividerLine, "dim");
                await printBootMessage("TYPE 'navigate' AND A NODE NUMBER TO CONNECT TO  A  NODE", "dim");

            } else {
                await printBootMessage("No node connections found", "warning");
            }

            break;

        case "navigate":
            //Navigate to a specified, connected node
            break;

        case "scan":
            //Scan the current node for files
            break;

        case "open":
            //Open a specified file
            break;

        default:
            //Handle invalid commands
            await printBootMessage("ERROR: UNKNOWN COMMAND", "error");
            break;
    };

});

// Delay between boot messages
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Print a message to the terminal
async function printBootMessage(message, type = "") {
    const line = document.createElement("p");

    if (type) {
        line.classList.add(type);
    }

    line.textContent = message;
    terminalOutput.appendChild(line);

    // Keep the latest output visible
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    await wait(450);
}

// Update the system clock
function updateClock() {
    if (!clock) return;

    clock.textContent = new Date().toLocaleTimeString("en-GB", {
        hour12: false
    });
}

// Initialize the terminal
async function bootTerminal() {
    // Prevent commands during startup
    commandInput.disabled = true;

    // Clear the placeholder HTML messages
    terminalOutput.replaceChildren();

    // Initial system state
    nodeStatus.textContent = "INITIALIZING";
    accessStatus.textContent = "BOOT SEQUENCE";

    await printBootMessage(
        "SUBNET M4GN3SS // NODE 001",
        "accent"
    );

    await printBootMessage(dividerLine, "dim");

    await printBootMessage(
        "POWERING SYSTEM................. OK",
        "success"
    );

    await printBootMessage(
        "INITIALIZING SUBSYSTEMS......... OK",
        "success"
    );

    await printBootMessage(
        "LOADING ARCHIVE INDEX........... OK",
        "success"
    );

    await printBootMessage(
        "CHECKING NETWORK INTEGRITY...... WARN",
        "warning"
    );

    await printBootMessage(
        "REMOTE CONNECTION............... ESTABLISHED",
        "success"
    );

    await printBootMessage(dividerLine, "dim");

    await printBootMessage(
        "INDEPENDENT ARCHIVE TERMINAL",
        "accent"
    );

    await printBootMessage(dividerLine, "dim");

    await printBootMessage(
        "TYPE 'nodes' TO IDENTIFY CONNECTED NODES OR 'help' FOR A LIST OF COMMANDS",
        "dim"
    );

    // System is ready
    nodeStatus.textContent = "NODE ONLINE";
    accessStatus.textContent = "ACCESS: OPEN";

    commandInput.disabled = false;
    commandInput.focus();
}

// Start the clock and boot sequence
updateClock();
setInterval(updateClock, 1000);

bootTerminal();
