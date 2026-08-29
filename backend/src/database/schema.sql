CREATE TABLE IF NOT EXISTS languages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  icon_emoji VARCHAR(10),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  current_level VARCHAR(50) DEFAULT 'beginner',
  goals TEXT,
  daily_minutes INTEGER DEFAULT 30,
  motivation_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  language_id INTEGER NOT NULL REFERENCES languages(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),
  "order" INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  "order" INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercises (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id),
  type VARCHAR(50) NOT NULL CHECK (type IN ('coding', 'multiple_choice')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  starter_code TEXT,
  test_cases JSONB DEFAULT '[]'::jsonb,
  hints JSONB,
  "order" INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  exercise_id INTEGER NOT NULL REFERENCES exercises(id),
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  submitted_code TEXT,
  attempted_at TIMESTAMP,
  UNIQUE(user_id, exercise_id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS test_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  exercise_id INTEGER NOT NULL REFERENCES exercises(id),
  attempt_number INTEGER NOT NULL,
  passed_tests INTEGER DEFAULT 0,
  failed_tests INTEGER DEFAULT 0,
  total_tests INTEGER DEFAULT 0,
  results JSONB,
  error TEXT,
  execution_time_ms INTEGER,
  submitted_code TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id, exercise_id) REFERENCES user_progress(user_id, exercise_id)
);

CREATE INDEX idx_exercises_lesson_id ON exercises(lesson_id);
CREATE INDEX idx_courses_language_id ON courses(language_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_test_results_user_exercise ON test_results(user_id, exercise_id);
