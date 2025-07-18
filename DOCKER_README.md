# 🐳 aptoTip Docker Database Setup

This document explains how to use Docker to run the PostgreSQL database for aptoTip.

## 🚀 Quick Start

### 1. Start the Database
```bash
npm run db:start
```

### 2. Set up Schema and Seed Data
```bash
npm run db:setup
```

This will:
- Start PostgreSQL database
- Create all tables
- Seed with sample data

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:start` | Start PostgreSQL database |
| `npm run db:stop` | Stop PostgreSQL database |
| `npm run db:reset-docker` | Reset database (removes all data) |
| `npm run db:status` | Show database status |
| `npm run db:setup` | Complete setup (start + migrate + seed) |

## 🔧 Manual Commands

### Start Database Only
```bash
docker compose up -d postgres
```

### Stop Database
```bash
docker compose down
```

### Reset Database (Remove All Data)
```bash
docker compose down -v
docker compose up -d postgres
```

### View Database Logs
```bash
docker logs aptotip-postgres
```

## 📊 Database Details

- **Database Name**: `aptotip`
- **Username**: `aptotip_user`
- **Password**: `aptotip_password`
- **Port**: `5432`
- **Connection URL**: `postgresql://aptotip_user:aptotip_password@localhost:5432/aptotip`

## 🗄️ Database Schema

The database includes the following tables:
- `profiles` - Base profile information
- `restaurants` - Restaurant-specific data
- `creators` - Creator-specific data
- `tips` - Tip transactions
- `recent_tips` - Recent tips for creators

## 🌱 Sample Data

The seeding script creates:
- 3 restaurant profiles (Mario's Pizza, Sakura Sushi, Green Leaf Café)
- 2 creator profiles (Alice Sterling, Bob Chen)
- 10 sample tips with various amounts

## 🔍 Troubleshooting

### Database Connection Issues
1. Make sure Docker is running
2. Check if the container is running: `docker ps`
3. Reset the database: `npm run db:reset-docker`

### Port Conflicts
If port 5432 is already in use, you can modify the port in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use port 5433 instead
```

### Permission Issues
Make sure the database script is executable:
```bash
chmod +x scripts/db-setup.sh
```

## 🧹 Cleanup

To completely remove all Docker resources:
```bash
docker compose down -v --remove-orphans
docker volume prune
``` 