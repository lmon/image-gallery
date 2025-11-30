#!/bin/bash
set -e

ORIGINAL_SQL="/Users/lmonaco/Development/new_website/work.sql"

if [ ! -f "$ORIGINAL_SQL" ]; then
  echo "❌ Original work.sql not found at $ORIGINAL_SQL"
  exit 1
fi

echo "✅ Found original work.sql file"
echo "Restoring dates from original data..."

# Create a temporary database, load original data, then copy dates
mysql -u root -ppassword << EOSQL
-- Create temp database
DROP DATABASE IF EXISTS temp_work_restore;
CREATE DATABASE temp_work_restore;
USE temp_work_restore;

-- Load original SQL
SET SESSION sql_mode = '';
SOURCE $ORIGINAL_SQL

-- Now copy dates to the main database
USE image_gallery;
UPDATE work w
INNER JOIN temp_work_restore.work w_orig ON w.id = w_orig.work_id
SET 
  w.date_created = CASE 
    WHEN w_orig.dateCreated != '0000-00-00 00:00:00' THEN w_orig.dateCreated
    ELSE NULL
  END,
  w.date_added = CASE 
    WHEN w_orig.dateAdded != '0000-00-00 00:00:00' THEN w_orig.dateAdded
    ELSE CURRENT_TIMESTAMP
  END;

-- Clean up
DROP DATABASE temp_work_restore;

-- Show results
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

