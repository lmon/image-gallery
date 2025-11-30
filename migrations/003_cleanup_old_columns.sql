-- Migration 003: Clean up old columns (run AFTER verifying everything works)
-- This removes old columns and renames new ones to final names

USE image_gallery;

-- Drop old columns
ALTER TABLE work
  DROP COLUMN isHidden,
  DROP COLUMN isADefault,
  DROP COLUMN isAvailable,
  DROP COLUMN file,
  DROP COLUMN thumbFile,
  DROP COLUMN filesize,
  DROP COLUMN parent,
  DROP COLUMN `group`,
  DROP COLUMN dateAdded,
  DROP COLUMN dateCreated;

-- Rename new columns to final names
ALTER TABLE work
  CHANGE COLUMN is_hidden_new is_hidden BOOLEAN DEFAULT FALSE,
  CHANGE COLUMN is_featured_new is_featured BOOLEAN DEFAULT FALSE,
  CHANGE COLUMN is_available_new is_available BOOLEAN DEFAULT TRUE,
  CHANGE COLUMN file_new file VARCHAR(512) NULL,
  CHANGE COLUMN thumb_file_new thumb_file VARCHAR(512) NULL,
  CHANGE COLUMN file_size_new file_size INT NULL,
  CHANGE COLUMN parent_id_new parent_id INT NULL,
  CHANGE COLUMN date_added_new date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHANGE COLUMN date_created_new date_created DATETIME NULL;

-- Drop unused columns
ALTER TABLE work
  DROP COLUMN download,
  DROP COLUMN ItemNotes;

-- Rename remaining columns for consistency
ALTER TABLE work
  CHANGE COLUMN work_name name VARCHAR(255) NULL,
  CHANGE COLUMN work_id id INT AUTO_INCREMENT;

-- Clean up old indexes
DROP INDEX IF EXISTS idx_id ON work;
DROP INDEX IF EXISTS idx_group ON work;

-- Rename table columns in assets for consistency
ALTER TABLE assets
  CHANGE COLUMN created created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHANGE COLUMN updated updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

