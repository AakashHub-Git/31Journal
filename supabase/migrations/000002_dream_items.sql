-- ====================================================================================
-- DREAM BOARD & BUCKET LIST SCHEMA
-- ====================================================================================

CREATE TABLE IF NOT EXISTS dream_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'adventures', -- 'travel', 'food', 'adventures', 'goals'
    description TEXT,
    is_completed BOOLEAN DEFAULT false,
    completed_at DATE,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE dream_items ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_dream_items_user_id ON dream_items(user_id);
CREATE INDEX IF NOT EXISTS idx_dream_items_category ON dream_items(category);

-- Dream items Policies
CREATE POLICY "Users can manage own dream items" ON dream_items
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
