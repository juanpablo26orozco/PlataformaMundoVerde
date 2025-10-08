-- DATABASE OPTIMIZATION FOR SUSTAINABILITY ASSESSMENTS
-- Adds columns for optimized storage approach
-- Run this before implementing the optimized function

-- Add new columns to store JSON and PDF efficiently
ALTER TABLE calculos_autogestion 
ADD COLUMN IF NOT EXISTS pdf_report BYTEA,
ADD COLUMN IF NOT EXISTS executive_summary JSONB;

-- Add index for JSON queries (performance optimization)
CREATE INDEX IF NOT EXISTS idx_autogestion_executive_summary 
ON calculos_autogestion USING gin(executive_summary);

-- Add comments for documentation
COMMENT ON COLUMN calculos_autogestion.pdf_report IS 'Stores PDF with all 210 detailed responses';
COMMENT ON COLUMN calculos_autogestion.executive_summary IS 'JSON with section summaries and metadata';

-- Optimize the table for better performance
VACUUM ANALYZE calculos_autogestion;

SELECT 'Database optimization completed successfully' as status;