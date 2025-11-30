-- Migration 004: Final cleanup - rename remaining columns for consistency

USE image_gallery;

-- Rename remaining columns for better naming consistency
ALTER TABLE work CHANGE COLUMN inTheHandsOf owner VARCHAR(256) NOT NULL DEFAULT '';
ALTER TABLE work CHANGE COLUMN comments description TEXT NULL;

-- Check if indexes need to be renamed
SELECT 'Final cleanup completed!' as status;

