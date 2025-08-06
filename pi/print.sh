#!/bin/bash

# --- CONFIGURATION ---
NODE_VERSION="22"
PROJECT_DIR="/home/trevor/Documents/todo-receipt-printer/pi"
USER_HOME="/home/trevor"
# --- END CONFIGURATION ---

echo "--- Running Printer Script at $(date) ---"

# Load NVM
export NVM_DIR="$USER_HOME/.config/nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  \. "$NVM_DIR/nvm.sh"
  echo "NVM script sourced from $NVM_DIR"
else
  echo "ERROR: NVM script not found at $NVM_DIR"
  exit 1
fi

if command -v nvm &> /dev/null; then
    echo "NVM command is available."
    nvm use ${NODE_VERSION}
    
    # Change to the project directory
    cd "$PROJECT_DIR"
    echo "Running script in directory: $(pwd)"

    # --- Load Environment Variables ---
    if [ -f .env ]; then
      # The allexport option exports all variables defined in the sourced file
      set -o allexport
      source .env
      set +o allexport
      echo ".env file loaded."
    else
      echo "WARNING: .env file not found."
    fi
    # --------------------------------

    # Run the Node script
    node dist/index.js
else
    echo "FATAL ERROR: NVM command not found even after sourcing."
    exit 1
fi