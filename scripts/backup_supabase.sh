#!/bin/bash
set -e

# Configuration from User
DB_HOST="db.yvftzwxiiyhheaoykxgc.supabase.co"
DB_USER="postgres"
DB_PORT="5432"
DB_NAME="postgres"

echo "----------------------------------------------------------------"
echo "Supabase Backup (Local Mode)"
echo "Target DB: $DB_HOST"
echo "----------------------------------------------------------------"
echo "Please enter your Database Password:"
read -s DB_PASSWORD
echo "" # Newline after silent input

# Construct connection string
# URL encoding might be needed for special chars in password, but simple concatenation often works for standard shells.
# For robustness, we can export PGPASSWORD environment variable instead of putting it in the URL.
export PGPASSWORD="$DB_PASSWORD"

# Get current date for backup folder
BACKUP_DIR="supabase_backup_$(date +%Y%m%d_%H%M%S)"
echo "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

echo "Starting Backup..."

# 1. Backup Database Schema
echo "[1/3] Backing up database schema..."
# --no-password prevents prompt since we set PGPASSWORD
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --schema-only --file "$BACKUP_DIR/schema.sql" --no-password

# 2. Backup Database Data
echo "[2/3] Backing up database data..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" --data-only --file "$BACKUP_DIR/data.sql" --no-password

# Unset password for security
unset PGPASSWORD

# 3. Backup Storage
echo "[3/3] Backing up storage buckets..."
mkdir -p "$BACKUP_DIR/storage"

# List of buckets to backup
BUCKETS=("narrations" "story-assets")

for BUCKET in "${BUCKETS[@]}"; do
    echo "  > Downloading bucket: $BUCKET..."
    mkdir -p "$BACKUP_DIR/storage/$BUCKET"
    # Note: 'supabase storage cp' does NOT require Docker, it uses the Storage API directly.
    supabase storage cp -r "ss:///$BUCKET" "$BACKUP_DIR/storage/$BUCKET" --experimental || echo "    Warning: Failed to download bucket $BUCKET or bucket is empty."
done

echo "----------------------------------------"
echo "Backup completed successfully!"
echo "Location: $BACKUP_DIR"
echo "Contents:"
ls -F "$BACKUP_DIR"
echo "----------------------------------------"
