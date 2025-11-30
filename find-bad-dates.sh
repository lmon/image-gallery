#!/bin/bash
echo "Finding dates with zero month or day..."

mysql -u root -ppassword image_gallery << 'EOSQL'
SET SESSION sql_mode = '';

-- Find bad dates in date_created
SELECT 
  id, 
  name, 
  CAST(date_created AS CHAR) as date_str
FROM work 
WHERE date_created IS NOT NULL 
  AND (
    CAST(date_created AS CHAR) LIKE '%-00-%' 
    OR CAST(date_created AS CHAR) LIKE '%-00 %'
    OR CAST(date_created AS CHAR) LIKE '%00:%'
  )
LIMIT 10;

-- Count them
SELECT COUNT(*) as 'Invalid date_created count' 
FROM work 
WHERE date_created IS NOT NULL 
  AND (
    CAST(date_created AS CHAR) LIKE '%-00-%' 
    OR CAST(date_created AS CHAR) LIKE '%-00 %'
  );

-- Now fix ALL of them more aggressively
UPDATE work 
SET date_created = NULL
WHERE date_created IS NOT NULL 
  AND (
    CAST(date_created AS CHAR) LIKE '%-00-%' 
    OR CAST(date_created AS CHAR) LIKE '%-00 %'
  );

SELECT 'Cleared invalid dates - they are now NULL' as status;

-- Count remaining valid dates
SELECT COUNT(*) as 'Valid dates remaining'
FROM work 
WHERE date_created IS NOT NULL;
EOSQL

echo ""
echo "✅ Invalid dates have been set to NULL"
echo "Restart your dev server now."

