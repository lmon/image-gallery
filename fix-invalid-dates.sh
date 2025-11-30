#!/bin/bash
set -e

echo "Fixing invalid dates (dates with zero month or day)..."

mysql -u root -ppassword image_gallery << 'EOSQL'
SET SESSION sql_mode = '';

-- Use string manipulation to fix dates
UPDATE work 
SET date_created = CONCAT(
  SUBSTRING(date_created, 1, 4), '-',
  IF(SUBSTRING(date_created, 6, 2) = '00', '01', SUBSTRING(date_created, 6, 2)), '-',
  IF(SUBSTRING(date_created, 9, 2) = '00', '01', SUBSTRING(date_created, 9, 2)),
  ' ', SUBSTRING(date_created, 12)
)
WHERE date_created IS NOT NULL 
  AND (CAST(date_created AS CHAR) LIKE '%00 %' OR CAST(date_created AS CHAR) LIKE '%-00-%');

-- Do the same for date_added
UPDATE work 
SET date_added = CONCAT(
  SUBSTRING(date_added, 1, 4), '-',
  IF(SUBSTRING(date_added, 6, 2) = '00', '01', SUBSTRING(date_added, 6, 2)), '-',
  IF(SUBSTRING(date_added, 9, 2) = '00', '01', SUBSTRING(date_added, 9, 2)),
  ' ', SUBSTRING(date_added, 12)
)
WHERE date_added IS NOT NULL 
  AND (CAST(date_added AS CHAR) LIKE '%00 %' OR CAST(date_added AS CHAR) LIKE '%-00-%');

-- Show the fixed dates
SELECT 
  'Fixed dates summary:' as status,
  COUNT(*) as total_images_with_dates,
  COUNT(DISTINCT YEAR(date_created)) as unique_years
FROM work 
WHERE date_created IS NOT NULL;

-- Show year breakdown
SELECT 
  YEAR(date_created) as year, 
  COUNT(*) as image_count 
FROM work 
WHERE date_created IS NOT NULL 
  AND parent_id IS NULL 
  AND is_hidden = 0
GROUP BY YEAR(date_created) 
ORDER BY year DESC;
EOSQL

echo ""
echo "✅ Invalid dates fixed!"
echo "All dates with zero month or day have been set to the 1st."
echo ""
echo "Restart your dev server and refresh your browser to see the Year navigation."

