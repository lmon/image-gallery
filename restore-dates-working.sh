#!/bin/bash
set -e

ORIGINAL_SQL="/Users/lmonaco/Development/new_website/work.sql"

if [ ! -f "$ORIGINAL_SQL" ]; then
  echo "❌ Original work.sql not found at $ORIGINAL_SQL"
  exit 1
fi

echo "✅ Found original work.sql file"
echo ""
echo "Step 1: Creating temporary database..."
mysql -u root -ppassword -e "DROP DATABASE IF EXISTS temp_work_restore; CREATE DATABASE temp_work_restore;"

echo "Step 2: Loading original data into temporary database..."
mysql -u root -ppassword --init-command="SET SESSION sql_mode='NO_ZERO_DATE,NO_ZERO_IN_DATE';" temp_work_restore < "$ORIGINAL_SQL"

echo "Step 3: Copying dates to current database..."
mysql -u root -ppassword image_gallery << 'EOSQL'
SET SESSION sql_mode = '';

UPDATE work w
INNER JOIN temp_work_restore.work w_orig ON w.id = w_orig.work_id
SET 
  w.date_created = CASE 
    WHEN CAST(w_orig.dateCreated AS CHAR) != '0000-00-00 00:00:00' AND w_orig.dateCreated IS NOT NULL 
    THEN w_orig.dateCreated
    ELSE NULL
  END,
  w.date_added = CASE 
    WHEN CAST(w_orig.dateAdded AS CHAR) != '0000-00-00 00:00:00' AND w_orig.dateAdded IS NOT NULL 
    THEN w_orig.dateAdded
    ELSE CURRENT_TIMESTAMP
  END;
EOSQL

echo "Step 4: Cleaning up temporary database..."
mysql -u root -ppassword -e "DROP DATABASE temp_work_restore;"

echo ""
echo "Step 5: Verifying results..."
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
echo ""
echo "Images with dates restored:"
mysql -u root -ppassword image_gallery -e "SELECT COUNT(*) as total FROM work WHERE date_created IS NOT NULL;"
echo ""
echo "🎉 Refresh your browser to see the Year navigation!"

