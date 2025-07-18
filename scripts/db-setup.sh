#!/bin/bash

# aptoTip Database Setup Script

echo "🚀 aptoTip Database Setup"

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Function to start database
start_db() {
    echo "📦 Starting PostgreSQL database..."
    docker compose up -d postgres
    echo "✅ Database started successfully!"
    echo "📍 Database URL: postgresql://aptotip_user:aptotip_password@localhost:5432/aptotip"
}

# Function to stop database
stop_db() {
    echo "🛑 Stopping PostgreSQL database..."
    docker compose down
    echo "✅ Database stopped successfully!"
}

# Function to reset database
reset_db() {
    echo "🔄 Resetting database..."
    docker compose down -v
    docker compose up -d postgres
    echo "✅ Database reset successfully!"
}

# Function to show database status
status_db() {
    echo "📊 Database Status:"
    docker compose ps
}

# Function to run database migrations
migrate_db() {
    echo "🔄 Running database migrations..."
    npm run db:push
    echo "✅ Migrations completed!"
}

# Function to seed database
seed_db() {
    echo "🌱 Seeding database..."
    npm run db:seed
    echo "✅ Database seeded successfully!"
}

# Main script logic
case "$1" in
    "start")
        check_docker
        start_db
        ;;
    "stop")
        stop_db
        ;;
    "reset")
        check_docker
        reset_db
        ;;
    "status")
        status_db
        ;;
    "migrate")
        migrate_db
        ;;
    "seed")
        seed_db
        ;;
    "setup")
        check_docker
        start_db
        sleep 5
        migrate_db
        seed_db
        echo "🎉 Complete database setup finished!"
        ;;
    *)
        echo "Usage: $0 {start|stop|reset|status|migrate|seed|setup}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the PostgreSQL database"
        echo "  stop    - Stop the PostgreSQL database"
        echo "  reset   - Reset the database (removes all data)"
        echo "  status  - Show database status"
        echo "  migrate - Run database migrations"
        echo "  seed    - Seed the database with sample data"
        echo "  setup   - Complete setup (start + migrate + seed)"
        exit 1
        ;;
esac 