-- Create social networking tables for posts, comments, and interactions
-- This migration adds the missing tables for social media functionality

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[],
  media_types TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create post_interactions table for likes, shares, etc.
CREATE TABLE IF NOT EXISTS post_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'share', 'bookmark')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, interaction_type)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_post_interactions_post_id ON post_interactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_interactions_user_id ON post_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_post_interactions_type ON post_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_comment_id);

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for posts
CREATE POLICY "Users can view all posts" ON posts
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts" ON posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for post_interactions
CREATE POLICY "Users can view all post interactions" ON post_interactions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own post interactions" ON post_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own post interactions" ON post_interactions
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for comments
CREATE POLICY "Users can view all comments" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own comments" ON comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
    FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON posts TO authenticated;
GRANT ALL ON post_interactions TO authenticated;
GRANT ALL ON comments TO authenticated;
