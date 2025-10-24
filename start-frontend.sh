#!/bin/bash

echo "====================================="
echo "ME Management - Starting Frontend"
echo "====================================="
echo ""

cd "$(dirname "$0")/client"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

echo "Starting Angular development server..."
echo ""
echo "Application will be available at:"
echo "  http://localhost:4200"
echo ""
echo "Default credentials:"
echo "  Username: admin"
echo "  Password: admin"
echo ""
echo "Make sure the backend is running on http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop the server"
echo "====================================="
echo ""

npm start
