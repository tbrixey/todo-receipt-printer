#!/bin/bash

# --- CONFIGURATION ---
# Set the Node.js major version that your project needs (e.g., 16, 18, 20)
NODE_VERSION="22"
# Set the absolute path to your project
PROJECT_DIR="/home/trevor/Documents/todo-receipt-printer/pi"
# --- END CONFIGURATION ---

# Load NVM
export NVM_DIR="$HOME/.config/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  

# Add a message to our log file to show the script has started
echo "--- Running Printer Script at $(date) ---"

# Explicitly use the correct node version
echo "Attempting to switch to Node.js v${NODE_VERSION}"
nvm use ${NODE_VERSION}

# Log the version of node that is actually being used now
echo "Now using Node version: $(node -v)"

# Change to the project directory
cd "$PROJECT_DIR"
echo "Running script in directory: $(pwd)"

# Run the script
node index.js