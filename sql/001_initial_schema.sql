-- 001_initial_schema.sql
-- Note: This project uses Convex (NoSQL/JSON-like), but this SQL represents the logical structure.

CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    user_id TEXT UNIQUE,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    height NUMERIC,
    activity_level TEXT,
    goal TEXT,
    target_weight NUMERIC,
    initial_weight NUMERIC,
    is_wizard_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE weights (
    id UUID PRIMARY KEY,
    user_id TEXT,
    weight NUMERIC NOT NULL,
    date DATE NOT NULL,
    bmi NUMERIC,
    calories NUMERIC,
    difference NUMERIC,
    status TEXT, -- 'gained', 'lost', 'maintained'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);
