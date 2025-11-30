#!/bin/bash
set -e

echo "Finding most recent backup..."
BACKUP=$(ls -t backup_schema_*.sql 2>/dev/null | head -1)

if [ -z "$BACKUP" ]; then
  echo "❌ No backup file found!"
  echo "Please check if you have a backup file in the current directory."
  exit 1
fi

echo "Found backup: $BACKUP"
echo ""
echo "Creating temporary table from backup to extract date data..."

# Create a temporary database to load the backup
mysql -u root -ppassword << 'EOSQL'
SET SESSION sql_log_bin = 0;
DROP DATABASE IF EXISTS temp_restore;
CREATE DATABASE temp_restore;
EOSQL

# Load the backup into temp database (skip GTID statements and disable binary logging)
grep -v "@@GLOBAL.GTID_PURGED" "$BACKUP" | mysql -u root -ppassword --binary-mode=0 temp_restore 2>&1 | grep -v "Warning"

echo "Restoring date_created data..."

# Copy dates from backup to current database
mysql -u root -ppassword image_gallery << 'EOSQL'
-- Update date_created from the backup
UPDATE work w
JOIN temp_restore.work tw ON w.id = tw.work_id
SET w.date_created = CASE 
  WHEN tw.date_created_new IS NOT NULL THEN tw.date_created_new
  WHEN tw.dateCreated != '0000-00-00 00:00:00' THEN tw.dateCreated
  ELSE NULL
END;

-- Also restore date_added if needed
UPDATE work w
JOIN temp_restore.work tw ON w.id = tw.work_id
SET w.date_added = CASE 
  WHEN tw.date_added_new IS NOT NULL THEN tw.date_added_new
  WHEN tw.dateAdded != '0000-00-00 00:00:00' THEN tw.dateAdded
  ELSE CURRENT_TIMESTAMP
END;
EOSQL

echo "Cleaning up temporary database..."
mysql -u root -ppassword -e "DROP DATABASE temp_restore;"

echo ""
echo "✅ Date restoration complete!"
echo ""
echo "Checking results..."
mysql -u root -ppassword image_gallery -e "SELECT COUNT(*) as 'Images with dates' FROM work WHERE date_created IS NOT NULL;"

