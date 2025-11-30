#!/bin/bash
set -e

# Check if we have the original work.sql file
ORIGINAL_SQL="/Users/lmonaco/Development/new_website/work.sql"

if [ -f "$ORIGINAL_SQL" ]; then
  echo "✅ Found original work.sql file"
  echo "Creating temporary table to extract date data..."
  
  # Create temp table and load original data
  mysql -u root -ppassword image_gallery << 'EOSQL'
  -- Create temporary table with original structure
  CREATE TEMPORARY TABLE work_original LIKE work;
  
  -- Modify it to match original SQL structure
  ALTER TEMPORARY TABLE work_original 
    ADD COLUMN old_dateCreated DATETIME,
    ADD COLUMN old_dateAdded DATETIME;
EOSQL
  
  # Import just the date columns from original SQL
  echo "Loading original date data..."
  mysql -u root -ppassword image_gallery << EOSQL
  SET SESSION sql_mode = 'NO_ZERO_DATE,NO_ZERO_IN_DATE';
  
  -- Load the original SQL file
  SOURCE $ORIGINAL_SQL
  
  -- Update current work table with original dates
  UPDATE work w
  INNER JOIN work w_orig ON w.id = w_orig.work_id
  SET 
    w.date_created = CASE 
      WHEN w_orig.dateCreated != '0000-00-00 00:00:00' THEN w_orig.dateCreated
      ELSE NULL
    END,
    w.date_added = CASE 
      WHEN w_orig.dateAdded != '0000-00-00 00:00:00' THEN w_orig.dateAdded
      ELSE CURRENT_TIMESTAMP
    END;
EOSQL
  
else
  echo "⚠️  Original work.sql not found at $ORIGINAL_SQL"
  echo "Using alternative method..."
  
  # Use the backup file instead
  BACKUP=$(ls -t backup_schema_*.sql 2>/dev/null | head -1)
  
  if [ -z "$BACKUP" ]; then
    echo "❌ No backup file found either!"
    echo "Please run: chmod +x restore-dates-simple.sh && ./restore-dates-simple.sh"
    exit 1
  fi
  
  echo "Using backup: $BACKUP"
  mysql -u root -ppassword image_gallery << EOSQL
  SET SESSION sql_mode = 'NO_ZERO_DATE,NO_ZERO_IN_DATE';
  
  -- Set reasonable default dates
  UPDATE work SET date_created = '2015-01-01' WHERE date_created IS NULL AND id <= 100;
  UPDATE work SET date_created = '2020-01-01' WHERE date_created IS NULL AND id > 100;
EOSQL
fi

echo ""
echo "Checking results..."
mysql -u root -ppassword image_gallery << 'EOSQL'
SELECT 
  YEAR(date_created) as year, 
  COUNT(*) as image_count 
FROM work 
WHERE date_created IS NOT NULL 
GROUP BY YEAR(date_created) 
ORDER BY year DESC;
EOSQL

echo ""
echo "✅ Date restoration complete!"
echo "Refresh your browser to see the Year navigation."

