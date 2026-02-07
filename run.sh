#!/bin/bash
echo "Starting Shirin Portfolio Builder..."
echo "Launching Backend..."
# Launch backend in background
(cd backend && npm run start) &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

echo "Launching Frontend..."
npm run dev

# Cleanup function to kill backend when script exits
trap "kill $BACKEND_PID" EXIT
