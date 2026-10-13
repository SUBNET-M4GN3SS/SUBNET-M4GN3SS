// ========================================
// SUBNET M4GN3SS // SYSTEM BOOT SEQUENCE
// ========================================

import { Node } from "./node.js";

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
    "Download": "Download a file"
};

const terminalMessages = {
    noNodesMsg: "No node connections found",
    invalidDestinationMsg: "Invalid destination"
};

const noNodesMsg = terminalMessages.noNodesMsg;
const invalidDestinationMsg = terminalMessages.invalidDestinationMsg;

const node1 = new Node("N1", "index.html", "active", ["N2", "N3"], []);
const node2= new Node("N2", "nodes/node2.html", "active", ["N1", "N4"], []);
const node3 = new Node("N3", "nodes/node3.html", "active", ["N1"], []);
const node4 = new Node("N4", "nodes/node4.html", "active", ["N2"], []);

const nodes = {
    "N1": node1,
    "N2": node2,
    "N3": node3,
    "N4": node4
};

const currentPage = window.location.pathname;

const currentNode = Object.keys(nodes).find(
    node => nodes[node].page.endsWith(currentPage.split("/").pop())
);

commandForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    const input = commandInput.value;
    commandInput.value = "";

    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const argument = parts[1]?.toUpperCase();

    if(!command) return;

    const connections = nodes[currentNode].connectedNodes;

    switch (command) {
        case "help":
            terminalOutput.replaceChildren();

            await printBootMessage(
                "AVAILABLE COMMANDS", 
                "accent"
            );

            await printBootMessage(
                dividerLine,
                "dim"
            );

            for(const [key, value] of Object.entries(commandAndDescriptionDict)){
                var commandsAndDescriptionText = `${key}: ${value}`;

                await printBootMessage(commandsAndDescriptionText);
            };

            await printBootMessage(
                dividerLine, 
                "dim"
            );

            break;

        case "nodes":;
            if(connections.length > 0){
                terminalOutput.replaceChildren();

                await printBootMessage(
                    "Connected Nodes", 
                    "accent"
                );

                await printBootMessage(
                    dividerLine, 
                    "dim"
                );

                for(const node of connections)
                    await printBootMessage(
                        `> ${node}`, 
                        "warning"
                    );

                await printBootMessage(
                    dividerLine, 
                    "dim"
                );
                await printBootMessage(
                    "TYPE 'navigate' AND A NODE NUMBER TO CONNECT TO  A  NODE", 
                    "dim"
                );

            } else {
                await printBootMessage(
                    noNodesMsg, 
                    "warning"
                );
            }

            break;

        case "navigate":
            //Check connectivity
            if(!connections.includes(argument)){
                await printBootMessage(
                    invalidDestinationMsg, 
                    "warning"
                );
                return;
            }

            const target_node = nodes[argument];

            if(!target_node){
                await printBootMessage(
                    invalidDestinationMsg, 
                    "warning"
                );
                return;
            }

            if(target_node.status === "active"){
                navigateToNode(target_node);
            } else {
                await printBootMessage(
                    noNodesMsg, 
                    "warning"
                );
                return;
            }
            break;

        case "scan":
            //Scan the current node for files
            break;

        case "open":
            //Open a specified file
            break;

        default:
            //Handle invalid commands
            await printBootMessage(
                "ERROR: UNKNOWN COMMAND", 
                "error"
            );
            break;
    };

});

function navigateToNode(targetNode){
    if (currentNode === "N1") {
        window.location.href = targetNode.page;
    } else {
        window.location.href = targetNode.name === "N1"
            ? "../index.html"
            : targetNode.page.split("/").pop();
    }
}

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

    await wait(600);
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

    if(currentNode === "N1"){

        await printBootMessage(
            "REMOTE CONNECTION............... ESTABLISHED",
            "success"
        );

        await printBootMessage(
            "INITIALIZING SUBSYSTEMS......... OK",
            "success"
        );

        await printBootMessage(
            "CHECKING NETWORK INTEGRITY...... WARN",
            "warning"
        );

        await printBootMessage(
            "LOADING ARCHIVE INDEX........... OK",
            "success"
        );

        await wait(1500);

    }

    terminalOutput.replaceChildren();

    await printBootMessage(
        "INDEPENDENT ARCHIVE TERMINAL",
        "accent"
    );

    await printBootMessage(
        dividerLine, 
        "dim"
    );

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
