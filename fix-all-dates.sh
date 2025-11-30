#!/bin/bash
echo "Fixing all invalid dates in both date_created and date_added..."

mysql -u root -ppassword image_gallery << 'EOSQL'
SET SESSION sql_mode = '';

-- Clear invalid date_added (dates with zero month or day)
UPDATE work 
SET date_added = CURRENT_TIMESTAMP
WHERE date_added IS NOT NULL 
  AND (
    CAST(date_added AS CHAR) LIKE '%-00-%' 
    OR CAST(date_added AS CHAR) LIKE '%-00 %'
  );

-- Clear any remaining invalid date_created
UPDATE work 
SET date_created = NULL
WHERE date_created IS NOT NULL 
  AND (
    CAST(date_created AS CHAR) LIKE '%-00-%' 
    OR CAST(date_created AS CHAR) LIKE '%-00 %'
  );

-- Show summary
SELECT 
  'Date summary:' as status,
  COUNT(*) as total_images,
  COUNT(date_created) as with_created,
  COUNT(date_added) as with_added
FROM work;

-- Show year breakdown
SELECT 
  YEAR(date_created) as year, 
  COUNT(*) as image_count 
FROM work 
WHERE date_created IS NOT NULL 
GROUP BY YEAR(date_created) 
ORDER BY year DESC;
EOSQL

echo ""
echo "✅ All invalid dates fixed!"
echo "   - Invalid date_added values set to CURRENT_TIMESTAMP"
echo "   - Invalid date_created values set to NULL"
echo ""
echo "Restart your dev server now."

