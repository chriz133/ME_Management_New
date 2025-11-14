#!/bin/bash

# Wait for SQL Server to start
echo "Waiting for SQL Server to start..."
sleep 30s

echo "Running initialization scripts..."

# Run all SQL scripts in order
for script in /docker-entrypoint-initdb.d/*.sql; do
    if [ -f "$script" ]; then
        echo "Executing $script..."
        /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -i "$script"
        if [ $? -eq 0 ]; then
            echo "Successfully executed $script"
        else
            echo "Error executing $script"
        fi
    fi
done

echo "Database initialization complete!"
