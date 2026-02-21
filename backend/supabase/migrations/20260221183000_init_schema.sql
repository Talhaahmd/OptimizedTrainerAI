-- 1. PROFILES
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('M', 'F')),
  goal TEXT CHECK (goal IN ('muscle', 'fatloss')),
  height_cm INTEGER,
  weight_kg NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 2. TARGET_SETTINGS
CREATE TABLE target_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  effective_from DATE DEFAULT CURRENT_DATE,
  steps_target INTEGER,
  sleep_target_hours NUMERIC,
  calories_target INTEGER,
  protein_g_target INTEGER,
  carbs_g_target INTEGER,
  fat_g_target INTEGER,
  method TEXT,
  inputs_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE target_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own targets" ON target_settings
  FOR SELECT USING (auth.uid() = user_id);

-- 3. DAILY_STATS
CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date_key DATE DEFAULT CURRENT_DATE,
  steps INTEGER DEFAULT 0,
  sleep_hours NUMERIC DEFAULT 0,
  weight_kg NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date_key)
);

ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select/update their own stats" ON daily_stats
  FOR ALL USING (auth.uid() = user_id);

-- 4. MEALS
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date_key DATE DEFAULT CURRENT_DATE,
  photo_path TEXT,
  source TEXT CHECK (source IN ('camera', 'chat')),
  status TEXT CHECK (status IN ('draft', 'confirmed', 'rejected')) DEFAULT 'draft',
  user_confirmation_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own meals" ON meals
  FOR ALL USING (auth.uid() = user_id);

-- 5. MEAL_ITEMS
CREATE TABLE meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID REFERENCES meals(id) ON DELETE CASCADE,
  name TEXT,
  portion TEXT,
  confidence NUMERIC,
  calories INTEGER,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  micros_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meal_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meal items" ON meal_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM meals WHERE meals.id = meal_items.meal_id AND meals.user_id = auth.uid()
    )
  );

-- 6. CONVERSATIONS
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

-- 7. CONVERSATION_MESSAGES
CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'tool')),
  content TEXT,
  structured_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON conversation_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages" ON conversation_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 8. AI_AUDIT_LOG
CREATE TABLE ai_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT,
  request_json JSONB,
  response_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ai_audit_log ENABLE ROW LEVEL SECURITY;

-- By default, backend only. RLS can be tighter depending on requirements.
CREATE POLICY "Users can view their own audit logs" ON ai_audit_log
  FOR SELECT USING (auth.uid() = user_id);

-- 9. NUTRITION DAILY AGGREGATES VIEW
CREATE OR REPLACE VIEW nutrition_daily_aggregates AS
SELECT 
  m.user_id,
  m.date_key,
  SUM(mi.calories) as total_calories,
  SUM(mi.protein_g) as protein_g,
  SUM(mi.carbs_g) as carbs_g,
  SUM(mi.fat_g) as fat_g
FROM meals m
JOIN meal_items mi ON m.id = mi.meal_id
WHERE m.status = 'confirmed'
GROUP BY m.user_id, m.date_key;

-- INDEXES
CREATE INDEX idx_daily_stats_date ON daily_stats(user_id, date_key);
CREATE INDEX idx_meals_date ON meals(user_id, date_key);
CREATE INDEX idx_conversation_messages_id ON conversation_messages(conversation_id);
