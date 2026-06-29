-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: perfumes (The Global Catalog)
CREATE TABLE perfumes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT,
    gender TEXT,
    rating REAL,
    year TEXT,
    top_notes TEXT,
    middle_notes TEXT,
    base_notes TEXT,
    accords TEXT,
    description TEXT,
    url TEXT UNIQUE,
    image_url TEXT
);

-- Table: wardrobe (User's Collection)
CREATE TABLE wardrobe (
    id SERIAL PRIMARY KEY,
    perfume_id INTEGER REFERENCES perfumes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT,
    notes TEXT,
    occasions TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Table: lists (User's Control Lists)
CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    perfume_id INTEGER REFERENCES perfumes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    brand TEXT,
    list_type TEXT NOT NULL, -- 'wishlist', 'like', 'dislike', 'alternative'
    comparison_to INTEGER REFERENCES perfumes(id) ON DELETE SET NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX idx_perfumes_name ON perfumes(name);
CREATE INDEX idx_perfumes_brand ON perfumes(brand);
CREATE INDEX idx_wardrobe_perfume_id ON wardrobe(perfume_id);
CREATE INDEX idx_lists_list_type ON lists(list_type);
