-- Migration 002: Add optimized indexes for common queries

USE image_gallery;

-- Set SQL mode to allow zero dates temporarily
SET SESSION sql_mode = 'NO_ZERO_DATE';

-- Add indexes on new date columns
CREATE INDEX idx_date_added_new ON work(date_added_new);
CREATE INDEX idx_date_created_new ON work(date_created_new);

-- Add index on group_name
CREATE INDEX idx_group_name ON work(group_name);

-- Add compound index for visibility queries
CREATE INDEX idx_visibility ON work(is_hidden_new, is_featured_new);

-- Add compound index for common query: non-hidden images ordered by date
CREATE INDEX idx_hidden_date ON work(is_hidden_new, date_added_new);

-- Add index on parent_id_new for hierarchy queries
CREATE INDEX idx_parent_new ON work(parent_id_new);

-- Add foreign key constraint for parent-child relationship
-- First, ensure all parent_id_new values reference valid work_id
UPDATE work SET parent_id_new = NULL 
WHERE parent_id_new IS NOT NULL 
  AND parent_id_new NOT IN (SELECT work_id FROM (SELECT work_id FROM work) AS temp);

-- Add the foreign key
ALTER TABLE work 
  ADD CONSTRAINT fk_work_parent 
  FOREIGN KEY (parent_id_new) 
  REFERENCES work(work_id) 
  ON DELETE SET NULL;

