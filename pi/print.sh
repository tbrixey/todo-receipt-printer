#!/bin/bash

# --- CONFIGURATION ---
NODE_VERSION="22"
PROJECT_DIR="/home/pi/Documents/todo-receipt-printer/pi/dist"
# Use the full, absolute path to your home directory
USER_HOME="/home/trevor"
# --- END CONFIGURATION ---

echo "--- Running Printer Script at $(date) ---"

# Load NVM using the absolute path. This is the key fix. 🗺️
export NVM_DIR="$USER_HOME/.config/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  \. "$NVM_DIR/nvm.sh"
  echo "NVM script sourced from $NVM_DIR"
else
  echo "ERROR: NVM script not found at $NVM_DIR"
  exit 1
fi

# Check if the nvm command is now available
if command -v nvm &> /dev/null; then
    echo "NVM command is available."
    nvm use ${NODE_VERSION}
    echo "Now using Node version: $(node -v)"

    cd "$PROJECT_DIR"
    echo "Running script in directory: $(pwd)"
    node index.js
else
    echo "FATAL ERROR: NVM command not found even after sourcing."
    exit 1
fi