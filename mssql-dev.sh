#!/bin/bash

# MSSQL Dev Server Quick Start Script
# This script helps you manage the local MSSQL development server

set -e

COMPOSE_FILE="docker-compose.dev.yml"
CONTAINER_NAME="memanagement-mssql-dev"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_help() {
    echo "MSSQL Development Server Management Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  start       - Start the MSSQL server"
    echo "  stop        - Stop the MSSQL server"
    echo "  restart     - Restart the MSSQL server"
    echo "  status      - Check server status"
    echo "  logs        - View server logs"
    echo "  reset       - Remove and recreate the server (deletes all data!)"
    echo "  connect     - Connect to the database using sqlcmd"
    echo "  help        - Show this help message"
    echo ""
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: Docker is not installed or not in PATH${NC}"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        echo -e "${RED}Error: Docker is not running${NC}"
        exit 1
    fi
}

start_server() {
    echo -e "${GREEN}Starting MSSQL development server...${NC}"
    docker-compose -f "$COMPOSE_FILE" up -d
    echo ""
    echo -e "${GREEN}Server is starting. This may take a minute...${NC}"
    echo "Connection details:"
    echo "  Server: localhost,1433"
    echo "  Database: firmaDB"
    echo "  Username: sa"
    echo "  Password: YourStrong!Passw0rd"
    echo ""
    echo "Run '$0 logs' to view initialization progress"
    echo "Run '$0 status' to check if the server is ready"
}

stop_server() {
    echo -e "${YELLOW}Stopping MSSQL development server...${NC}"
    docker-compose -f "$COMPOSE_FILE" stop
    echo -e "${GREEN}Server stopped${NC}"
}

restart_server() {
    echo -e "${YELLOW}Restarting MSSQL development server...${NC}"
    docker-compose -f "$COMPOSE_FILE" restart
    echo -e "${GREEN}Server restarted${NC}"
}

show_status() {
    echo "MSSQL Development Server Status:"
    echo "================================"
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
    
    if docker ps --filter "name=$CONTAINER_NAME" --filter "status=running" | grep -q "$CONTAINER_NAME"; then
        echo -e "${GREEN}✓ Server is running${NC}"
        
        # Check if healthy
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "unknown")
        if [ "$HEALTH" = "healthy" ]; then
            echo -e "${GREEN}✓ Server is healthy and ready${NC}"
        elif [ "$HEALTH" = "starting" ]; then
            echo -e "${YELLOW}⏳ Server is still starting up...${NC}"
        else
            echo -e "${YELLOW}⚠ Server health status: $HEALTH${NC}"
        fi
    else
        echo -e "${RED}✗ Server is not running${NC}"
    fi
}

show_logs() {
    echo "Showing MSSQL server logs (press Ctrl+C to exit)..."
    echo "=================================================="
    docker-compose -f "$COMPOSE_FILE" logs -f mssql
}

reset_server() {
    echo -e "${RED}WARNING: This will delete all database data!${NC}"
    read -p "Are you sure you want to reset the server? (yes/no): " -r
    echo
    if [[ $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${YELLOW}Removing MSSQL server and data...${NC}"
        docker-compose -f "$COMPOSE_FILE" down -v
        echo -e "${GREEN}Server removed${NC}"
        echo ""
        echo -e "${GREEN}Starting fresh server...${NC}"
        start_server
    else
        echo "Reset cancelled"
    fi
}

connect_db() {
    echo "Connecting to database..."
    if ! docker ps --filter "name=$CONTAINER_NAME" --filter "status=running" | grep -q "$CONTAINER_NAME"; then
        echo -e "${RED}Error: Server is not running. Start it with: $0 start${NC}"
        exit 1
    fi
    
    echo "Connecting to firmaDB as sa..."
    echo "(Type 'exit' or press Ctrl+D to quit)"
    docker exec -it "$CONTAINER_NAME" /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -d firmaDB
}

# Main script logic
check_docker

case "${1:-help}" in
    start)
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    reset)
        reset_server
        ;;
    connect)
        connect_db
        ;;
    help|--help|-h)
        print_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        echo ""
        print_help
        exit 1
        ;;
esac
