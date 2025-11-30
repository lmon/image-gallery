-- Migration 001: Add new columns with proper types
-- This adds new columns alongside existing ones for safe migration

USE image_gallery;

-- Set SQL mode to allow zero dates temporarily
SET SESSION sql_mode = 'NO_ZERO_DATE';

-- Add properly typed boolean columns
ALTER TABLE work 
  ADD COLUMN is_hidden_new BOOLEAN DEFAULT FALSE AFTER isHidden,
  ADD COLUMN is_featured_new BOOLEAN DEFAULT FALSE AFTER isADefault,
  ADD COLUMN is_available_new BOOLEAN DEFAULT TRUE AFTER isAvailable;

-- Add larger file path columns
ALTER TABLE work 
  ADD COLUMN file_new VARCHAR(512) NULL AFTER file,
  ADD COLUMN thumb_file_new VARCHAR(512) NULL AFTER thumbFile;

-- Add properly typed filesize column
ALTER TABLE work 
  ADD COLUMN file_size_new INT NULL AFTER filesize;

-- Add parent_id column with proper naming (will add FK constraint later)
ALTER TABLE work 
  ADD COLUMN parent_id_new INT NULL AFTER parent;

-- Rename group to group_name for clarity
ALTER TABLE work 
  ADD COLUMN group_name VARCHAR(128) NULL AFTER `group`;

-- Add proper date columns
ALTER TABLE work 
  ADD COLUMN date_added_new DATETIME DEFAULT CURRENT_TIMESTAMP AFTER dateAdded,
  ADD COLUMN date_created_new DATETIME NULL AFTER dateCreated;

-- Migrate existing data to new columns
UPDATE work SET is_hidden_new = (isHidden = 1);
UPDATE work SET is_featured_new = (isADefault = 1);
UPDATE work SET is_available_new = isAvailable;
UPDATE work SET file_new = file;
UPDATE work SET thumb_file_new = thumbFile;
UPDATE work SET parent_id_new = CASE WHEN parent = 0 THEN NULL ELSE parent END;
UPDATE work SET group_name = `group`;

-- Migrate dates (fixing 0000-00-00 dates)
-- Use string comparison to avoid datetime errors
UPDATE work SET date_added_new = CASE 
  WHEN CAST(dateAdded AS CHAR) = '0000-00-00 00:00:00' THEN NOW()
  WHEN YEAR(dateAdded) < 1900 THEN NOW()
  ELSE dateAdded 
END;

UPDATE work SET date_created_new = CASE 
  WHEN CAST(dateCreated AS CHAR) = '0000-00-00 00:00:00' THEN NULL
  WHEN YEAR(dateCreated) < 1900 THEN NULL
  ELSE dateCreated 
END;

-- Try to parse filesize if it's a number
UPDATE work SET file_size_new = CAST(filesize AS UNSIGNED) 
WHERE filesize REGEXP '^[0-9]+$';

