-- Add 'used' status to invite_status enum
ALTER TYPE invite_status ADD VALUE IF NOT EXISTS 'used';