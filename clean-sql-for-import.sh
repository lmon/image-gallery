#!/bin/bash
set -e

echo "Cleaning SQL backup for import to shared hosting..."

# Find the most recent backup or use production_backup.sql
if [ -f "production_backup.sql" ]; then
  INPUT_FILE="production_backup.sql"
else
  INPUT_FILE=$(ls -t backup_schema_*.sql 2>/dev/null | head -1)
fi

if [ -z "$INPUT_FILE" ]; then
  echo "❌ No backup file found!"
  exit 1
fi

OUTPUT_FILE="production_backup_clean.sql"

echo "Processing: $INPUT_FILE"
echo "Output: $OUTPUT_FILE"

# Remove problematic statements that require SUPER privileges
grep -v "@@SESSION.SQL_LOG_BIN" "$INPUT_FILE" | \
grep -v "@@GLOBAL.GTID_PURGED" | \
grep -v "@@SESSION.SQL_MODE" | \
grep -v "SET @MYSQLDUMP_TEMP_LOG_BIN" | \
grep -v "DEFINER=" > "$OUTPUT_FILE"

echo ""
echo "✅ Clean SQL file created: $OUTPUT_FILE"
echo ""
echo "You can now import this file to your MySQL host:"
echo "   mysql -u your_user -p -h your_host.com your_database < $OUTPUT_FILE"
echo ""
echo "Or upload via phpMyAdmin/web interface."

