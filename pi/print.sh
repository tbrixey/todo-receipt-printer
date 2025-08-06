#!/bin/bash
# Source NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Optional: Go to the project directory
cd /home/trevor/Documents/todo-receipt-printer/pi

nvm use default
node dist/index.js