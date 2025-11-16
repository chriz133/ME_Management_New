#!/bin/bash

# Test Deployment Script
# This script helps you test the deployment setup locally using Docker
# before deploying to your actual server

set -e

echo "=========================================="
echo "ME Management - Local Deployment Test"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo ""

# Create test directories
echo "Creating test directories..."
mkdir -p deployment/test-data/api
mkdir -p deployment/test-data/app
mkdir -p deployment/test-logs

echo -e "${GREEN}✓ Test directories created${NC}"
echo ""

# Build and start the test environment
echo "Building Docker test environment..."
echo "(This may take a few minutes on first run)"
cd deployment
docker-compose -f docker-compose.test.yml up -d --build

echo ""
echo -e "${GREEN}✓ Test environment started${NC}"
echo ""

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose -f docker-compose.test.yml ps | grep -q "Up"; then
    echo -e "${GREEN}✓ Services are running${NC}"
else
    echo -e "${RED}✗ Services failed to start${NC}"
    echo "Check logs with: cd deployment && docker-compose -f docker-compose.test.yml logs"
    exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Test Environment Ready!${NC}"
echo "=========================================="
echo ""
echo "Test Server:  http://localhost:8080"
echo "MySQL:        localhost:3307"
echo ""
echo "Useful commands:"
echo "  View logs:     cd deployment && docker-compose -f docker-compose.test.yml logs -f"
echo "  Stop:          cd deployment && docker-compose -f docker-compose.test.yml down"
echo "  Restart:       cd deployment && docker-compose -f docker-compose.test.yml restart"
echo "  Shell access:  docker exec -it memanagement-test-server bash"
echo ""
echo "To test manual deployment:"
echo "  1. Build your .NET API: dotnet publish server/Server.Api/Server.Api.csproj -c Release -o deployment/test-data/api"
echo "  2. Build Angular app:   cd client && npm run build && cp -r dist/client/browser/* ../deployment/test-data/app/"
echo "  3. Access:              http://localhost:8080"
echo ""
echo -e "${YELLOW}Note: This is for testing only. For production, use the actual server setup.${NC}"
echo ""
