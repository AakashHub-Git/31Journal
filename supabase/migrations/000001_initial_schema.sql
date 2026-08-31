-- ====================================================================================
-- JOURNAL APPLICATION INITIAL SCHEMA
-- ====================================================================================

-- 1. PROFILES
-- Extended user data linked to auth.users
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    birthday DATE,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies (User can only read/write their own profile)
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);


-- 2. MEMORIES
-- The core entity for moments, journals, and scrapbook items.
CREATE TABLE memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT,
    description TEXT,
    memory_date DATE NOT NULL DEFAULT CURRENT_DATE, -- The actual date of the memory (can be historical)
    location TEXT,
    mood TEXT,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_memories_user_id ON memories(user_id);
CREATE INDEX idx_memories_date ON memories(memory_date);

-- Memories Policies
CREATE POLICY "Users can manage own memories" ON memories
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 3. MEDIA (Photos & Videos attached to memories)
CREATE TABLE memory_media (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    memory_id UUID REFERENCES memories(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    url TEXT NOT NULL,          -- The Supabase Storage public or signed URL path
    storage_path TEXT NOT NULL, -- The exact path in the storage bucket for deletion
    position INTEGER DEFAULT 0, -- For ordering multiple photos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE memory_media ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_memory_media_memory_id ON memory_media(memory_id);

-- Media Policies
CREATE POLICY "Users can manage own media" ON memory_media
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 4. TAGS & RELATIONSHIPS
CREATE TABLE tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, name)
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tags" ON tags
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE memory_tags (
    memory_id UUID REFERENCES memories(id) ON DELETE CASCADE NOT NULL,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    PRIMARY KEY (memory_id, tag_id)
);

ALTER TABLE memory_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own memory_tags" ON memory_tags
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ====================================================================================
-- TRIGGERS FOR UPDATED_AT
-- ====================================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memories_updated_at
    BEFORE UPDATE ON memories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ====================================================================================
-- STORAGE BUCKETS AND POLICIES (Note: Requires executing via Supabase Dashboard/CLI)
-- ====================================================================================

-- Insert standard bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('journal_media', 'journal_media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies (User can only upload/read their own files based on path matching their UID)
CREATE POLICY "Users can upload to their own folder" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'journal_media' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view their own media" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'journal_media' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete their own media" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'journal_media' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );
