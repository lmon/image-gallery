#!/bin/bash
echo "Checking if dates were restored..."
mysql -u root -ppassword image_gallery << 'EOSQL'
SELECT COUNT(*) as 'Total images' FROM work;
SELECT COUNT(*) as 'Images with date_created' FROM work WHERE date_created IS NOT NULL;
SELECT COUNT(*) as 'Images without parent' FROM work WHERE parent_id IS NULL;
SELECT COUNT(*) as 'Images visible with dates and no parent' 
FROM work 
WHERE date_created IS NOT NULL 
  AND parent_id IS NULL 
  AND is_hidden = 0;

SELECT 
  YEAR(date_created) as year, 
  COUNT(*) as count 
FROM work 
WHERE date_created IS NOT NULL 
  AND parent_id IS NULL 
  AND is_hidden = 0
GROUP BY YEAR(date_created) 
ORDER BY year DESC;
EOSQL

