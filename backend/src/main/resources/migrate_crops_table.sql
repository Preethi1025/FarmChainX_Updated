-- Fix crops table schema to match Crop model
-- This script updates the crops table structure

-- Step 1: Drop the existing crops table (if it exists and has wrong schema)
-- WARNING: This will delete all existing crop data!
-- Uncomment the line below only if you want to start fresh:
-- DROP TABLE IF EXISTS crops;

-- Step 2: If you only want to update the schema, use these ALTER commands:

-- Check if column exists before altering
-- MySQL syntax to drop column if exists:
ALTER TABLE crops DROP COLUMN IF EXISTS user_id;

-- Add missing columns if they don't exist
ALTER TABLE crops ADD COLUMN IF NOT EXISTS batch_id VARCHAR(255) NOT NULL UNIQUE;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS farmer_id VARCHAR(255) NOT NULL;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS crop_name VARCHAR(255) NOT NULL;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS price VARCHAR(255);
ALTER TABLE crops ADD COLUMN IF NOT EXISTS quantity VARCHAR(255);
ALTER TABLE crops ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE crops ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 3: Verify the table structure
-- DESCRIBE crops;
