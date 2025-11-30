-- Migration 003: Clean up old columns (SAFE VERSION)
-- This removes old columns and renames new ones to final names

USE image_gallery;

SET SESSION sql_mode = 'NO_ZERO_DATE';

-- Step 1: Drop old columns from work table
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

-- Step 2: Drop unused columns
ALTER TABLE work
  DROP COLUMN download,
  DROP COLUMN ItemNotes;

-- Step 3: Rename new columns to final names (one at a time for safety)
ALTER TABLE work CHANGE COLUMN is_hidden_new is_hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE work CHANGE COLUMN is_featured_new is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE work CHANGE COLUMN is_available_new is_available BOOLEAN DEFAULT TRUE;
ALTER TABLE work CHANGE COLUMN file_new file VARCHAR(512) NULL;
ALTER TABLE work CHANGE COLUMN thumb_file_new thumb_file VARCHAR(512) NULL;
ALTER TABLE work CHANGE COLUMN file_size_new file_size INT NULL;
ALTER TABLE work CHANGE COLUMN parent_id_new parent_id INT NULL;
ALTER TABLE work CHANGE COLUMN date_added_new date_added DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE work CHANGE COLUMN date_created_new date_created DATETIME NULL;
ALTER TABLE work CHANGE COLUMN work_name name VARCHAR(255) NULL;

-- Step 4: Clean up old indexes
DROP INDEX idx_id ON work;
DROP INDEX idx_group ON work;

-- Step 5: Rename index names to remove '_new' suffix
ALTER TABLE work DROP INDEX idx_date_added_new;
ALTER TABLE work DROP INDEX idx_date_created_new;
ALTER TABLE work DROP INDEX idx_group_name;
ALTER TABLE work DROP INDEX idx_visibility;
ALTER TABLE work DROP INDEX idx_hidden_date;
ALTER TABLE work DROP INDEX idx_parent_new;

CREATE INDEX idx_date_added ON work(date_added);
CREATE INDEX idx_date_created ON work(date_created);
CREATE INDEX idx_group_name ON work(group_name);
CREATE INDEX idx_visibility ON work(is_hidden, is_featured);
CREATE INDEX idx_hidden_date ON work(is_hidden, date_added);
CREATE INDEX idx_parent ON work(parent_id);

-- Step 6: Update foreign key constraint name
ALTER TABLE work DROP FOREIGN KEY fk_work_parent;
ALTER TABLE work ADD CONSTRAINT fk_work_parent FOREIGN KEY (parent_id) REFERENCES work(work_id) ON DELETE SET NULL;

-- Step 7: Rename columns in assets table
ALTER TABLE assets CHANGE COLUMN created created_at DATETIME DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE assets CHANGE COLUMN updated updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Done!
SELECT 'Cleanup migration completed successfully!' as status;

