-- Migration 002: Add optimized indexes for common queries (safe version)

USE image_gallery;

-- Set SQL mode
SET SESSION sql_mode = 'NO_ZERO_DATE';

-- Drop indexes if they exist, then create them
-- This approach works in all MySQL versions

-- Date indexes
DROP INDEX IF EXISTS idx_date_added_new ON work;
CREATE INDEX idx_date_added_new ON work(date_added_new);

DROP INDEX IF EXISTS idx_date_created_new ON work;
CREATE INDEX idx_date_created_new ON work(date_created_new);

-- Group index
DROP INDEX IF EXISTS idx_group_name ON work;
CREATE INDEX idx_group_name ON work(group_name);

-- Visibility compound index
DROP INDEX IF EXISTS idx_visibility ON work;
CREATE INDEX idx_visibility ON work(is_hidden_new, is_featured_new);

-- Hidden+date compound index
DROP INDEX IF EXISTS idx_hidden_date ON work;
CREATE INDEX idx_hidden_date ON work(is_hidden_new, date_added_new);

-- Parent index
DROP INDEX IF EXISTS idx_parent_new ON work;
CREATE INDEX idx_parent_new ON work(parent_id_new);

-- Validate and add foreign key constraint
-- First, ensure all parent_id_new values reference valid work_id
UPDATE work w1
LEFT JOIN work w2 ON w1.parent_id_new = w2.work_id
SET w1.parent_id_new = NULL
WHERE w1.parent_id_new IS NOT NULL AND w2.work_id IS NULL;

-- Add the foreign key if it doesn't exist
-- Note: MySQL will error if constraint already exists, we'll handle that
SET @constraint_exists = (
  SELECT COUNT(*) 
  FROM information_schema.TABLE_CONSTRAINTS 
  WHERE CONSTRAINT_SCHEMA = 'image_gallery' 
    AND TABLE_NAME = 'work' 
    AND CONSTRAINT_NAME = 'fk_work_parent'
);

-- Drop if exists, then add
ALTER TABLE work DROP FOREIGN KEY IF EXISTS fk_work_parent;

ALTER TABLE work 
  ADD CONSTRAINT fk_work_parent 
  FOREIGN KEY (parent_id_new) 
  REFERENCES work(work_id) 
  ON DELETE SET NULL;

