-- BelesPrivacy Database Schema
-- This file contains the SQL schema for the course platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    duration INTEGER NOT NULL, -- in minutes
    total_units INTEGER NOT NULL,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Units table
CREATE TABLE IF NOT EXISTS public.units (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    video_url TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    content TEXT, -- additional text content
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, "order")
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    passing_score INTEGER DEFAULT 70, -- percentage
    time_limit INTEGER, -- in minutes, NULL means no limit
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    options TEXT[] NOT NULL,
    correct_answer INTEGER NOT NULL, -- index of correct option
    explanation TEXT,
    points INTEGER DEFAULT 1,
    "order" INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    progress INTEGER DEFAULT 0, -- percentage completed
    current_unit INTEGER DEFAULT 1,
    completed_units UUID[] DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL, -- percentage
    answers JSONB NOT NULL, -- {question_id: selected_answer_index}
    passed BOOLEAN NOT NULL,
    time_taken INTEGER, -- in seconds
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course categories table
CREATE TABLE IF NOT EXISTS public.course_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course-category relationships
CREATE TABLE IF NOT EXISTS public.course_categories_relation (
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.course_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, category_id)
);

-- User progress tracking
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE NOT NULL,
    video_watched BOOLEAN DEFAULT false,
    video_watched_at TIMESTAMP WITH TIME ZONE,
    quiz_passed BOOLEAN DEFAULT false,
    quiz_passed_at TIMESTAMP WITH TIME ZONE,
    time_spent INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, unit_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);
CREATE INDEX IF NOT EXISTS idx_units_course_order ON public.units(course_id, "order");
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_unit ON public.user_progress(unit_id);

-- Create RLS (Row Level Security) policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_categories_relation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses policies
CREATE POLICY "Anyone can view published courses" ON public.courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can view all courses" ON public.courses
    FOR SELECT USING (auth.role() = 'authenticated');

-- Units policies
CREATE POLICY "Anyone can view units of published courses" ON public.units
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE courses.id = units.course_id 
            AND courses.is_published = true
        )
    );

-- Quizzes policies
CREATE POLICY "Anyone can view quizzes of published courses" ON public.quizzes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.units 
            JOIN public.courses ON courses.id = units.course_id
            WHERE units.id = quizzes.unit_id 
            AND courses.is_published = true
        )
    );

-- Quiz questions policies
CREATE POLICY "Anyone can view quiz questions of published courses" ON public.quiz_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.quizzes 
            JOIN public.units ON units.id = quizzes.unit_id
            JOIN public.courses ON courses.id = units.course_id
            WHERE quizzes.id = quiz_questions.quiz_id 
            AND courses.is_published = true
        )
    );

-- Enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own enrollments" ON public.enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" ON public.enrollments
    FOR UPDATE USING (auth.uid() = user_id);

-- Quiz attempts policies
CREATE POLICY "Users can view their own quiz attempts" ON public.quiz_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts" ON public.quiz_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User progress policies
CREATE POLICY "Users can view their own progress" ON public.user_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" ON public.user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Course categories policies
CREATE POLICY "Anyone can view course categories" ON public.course_categories
    FOR SELECT USING (true);

-- Course categories relation policies
CREATE POLICY "Anyone can view course category relations" ON public.course_categories_relation
    FOR SELECT USING (true);

-- Create functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON public.units
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON public.quizzes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON public.enrollments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate course progress
CREATE OR REPLACE FUNCTION calculate_course_progress(user_uuid UUID, course_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_units INTEGER;
    completed_units INTEGER;
BEGIN
    -- Get total units in course
    SELECT COUNT(*) INTO total_units
    FROM public.units
    WHERE course_id = course_uuid;
    
    -- Get completed units
    SELECT COUNT(*) INTO completed_units
    FROM public.user_progress
    WHERE user_id = user_uuid 
    AND unit_id IN (SELECT id FROM public.units WHERE course_id = course_uuid)
    AND video_watched = true AND quiz_passed = true;
    
    -- Return percentage
    IF total_units = 0 THEN
        RETURN 0;
    ELSE
        RETURN (completed_units * 100) / total_units;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data

-- Sample course categories
INSERT INTO public.course_categories (name, description, color) VALUES
('Fundamentos', 'Conceptos básicos y principios fundamentales', '#3B82F6'),
('Regulaciones', 'Leyes y normativas de protección de datos', '#10B981'),
('Implementación', 'Aplicación práctica y casos de uso', '#F59E0B'),
('Seguridad', 'Medidas de seguridad y protección', '#EF4444'),
('Compliance', 'Cumplimiento normativo y auditoría', '#8B5CF6')
ON CONFLICT (name) DO NOTHING;

-- Sample courses with specific UUIDs
INSERT INTO public.courses (id, title, description, duration, total_units, is_published) VALUES
('b8c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Fundamentos de Protección de Datos', 'Aprende los conceptos básicos de la protección de datos personales, incluyendo principios fundamentales, derechos de los usuarios y obligaciones de las organizaciones.', 120, 8, true),
('c9d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'GDPR y Regulaciones Europeas', 'Domina el Reglamento General de Protección de Datos (GDPR) y otras regulaciones europeas relacionadas con la privacidad y protección de datos.', 180, 12, true),
('d0e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a', 'Implementación de Políticas de Privacidad', 'Aprende a crear e implementar políticas de privacidad efectivas, procedimientos de cumplimiento y sistemas de gestión de datos personales.', 150, 10, true)
ON CONFLICT (id) DO NOTHING;

-- Sample units for the first course with direct video URLs for testing
INSERT INTO public.units (course_id, title, description, "order", video_url, duration) VALUES
('b8c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Introducción a la Protección de Datos', 'Conceptos básicos y fundamentos de la privacidad y protección de datos personales.', 1, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 15),
('b8c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Principios de la Protección de Datos', 'Los siete principios fundamentales que rigen el tratamiento de datos personales.', 2, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 20),
('b8c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'Derechos de los Usuarios', 'Conoce los derechos que tienen las personas sobre sus datos personales.', 3, 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 18)
ON CONFLICT DO NOTHING;

-- Sample quiz for the first unit
INSERT INTO public.quizzes (unit_id, title, description, passing_score) VALUES
((SELECT id FROM public.units WHERE title = 'Introducción a la Protección de Datos' LIMIT 1), 'Test: Introducción a la Protección de Datos', 'Responde las siguientes preguntas para evaluar tu comprensión de la unidad.', 70)
ON CONFLICT DO NOTHING;

-- Sample quiz questions
INSERT INTO public.quiz_questions (quiz_id, question, options, correct_answer, explanation, "order") VALUES
((SELECT id FROM public.quizzes WHERE title = 'Test: Introducción a la Protección de Datos' LIMIT 1), '¿Qué es la protección de datos personales?', ARRAY['Un proceso para almacenar información de manera segura', 'Un conjunto de medidas para proteger la privacidad y los derechos de las personas sobre su información personal', 'Una técnica de encriptación de datos', 'Un protocolo de seguridad informática'], 1, 'La protección de datos personales se refiere al conjunto de medidas, garantías y derechos que protegen la privacidad y los derechos de las personas sobre su información personal.', 1),
((SELECT id FROM public.quizzes WHERE title = 'Test: Introducción a la Protección de Datos' LIMIT 1), '¿Cuál de los siguientes NO es un principio de la protección de datos?', ARRAY['Licitud, lealtad y transparencia', 'Limitación de la finalidad', 'Minimización de datos', 'Maximización del almacenamiento'], 3, 'La maximización del almacenamiento NO es un principio de la protección de datos. Los principios incluyen la minimización de datos, no su maximización.', 2)
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- ===================================================================
-- ADVANCED VIDEO ANALYTICS TABLES
-- ===================================================================

-- Table for detailed video analytics
CREATE TABLE IF NOT EXISTS public.video_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
    session_id UUID DEFAULT gen_random_uuid(), -- Para agrupar sesiones de visualización
    
    -- Basic metrics
    total_watch_time DECIMAL(10,2) DEFAULT 0, -- En segundos
    pause_count INTEGER DEFAULT 0,
    seek_count INTEGER DEFAULT 0,
    rewind_count INTEGER DEFAULT 0,
    max_progress_reached DECIMAL(5,2) DEFAULT 0, -- Porcentaje máximo alcanzado
    completion_threshold DECIMAL(5,2) DEFAULT 95, -- Umbral requerido para completar
    
    -- Session info
    start_time TIMESTAMP DEFAULT NOW(),
    end_time TIMESTAMP,
    completed_at TIMESTAMP,
    is_completed BOOLEAN DEFAULT FALSE,
    
    -- Advanced analytics
    watch_segments JSONB DEFAULT '[]', -- Segmentos de tiempo visto: [{"start": 0, "end": 30}, ...]
    playback_rates JSONB DEFAULT '[]', -- Velocidades usadas: [{"rate": 1.5, "duration": 120}, ...]
    browser_info JSONB DEFAULT '{}', -- Info del navegador/dispositivo
    
    -- Engagement metrics
    full_screen_time DECIMAL(10,2) DEFAULT 0, -- Tiempo en pantalla completa
    volume_changes INTEGER DEFAULT 0,
    quality_changes INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, unit_id, session_id)
);

-- Table for video quality metrics (buffering, loading times, etc.)
CREATE TABLE IF NOT EXISTS public.video_quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analytics_id UUID REFERENCES public.video_analytics(id) ON DELETE CASCADE,
    
    -- Performance metrics
    initial_load_time DECIMAL(10,3), -- Tiempo de carga inicial en segundos
    buffer_events INTEGER DEFAULT 0, -- Número de eventos de buffering
    total_buffer_time DECIMAL(10,2) DEFAULT 0, -- Tiempo total de buffering
    
    -- Quality metrics
    video_resolution TEXT, -- e.g., "1920x1080"
    video_bitrate INTEGER, -- En kbps
    dropped_frames INTEGER DEFAULT 0,
    
    -- Network info
    connection_type TEXT, -- e.g., "wifi", "cellular"
    estimated_bandwidth INTEGER, -- En kbps
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies for video analytics
ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_quality_metrics ENABLE ROW LEVEL SECURITY;

-- Users can only see their own analytics
CREATE POLICY "Users can view own video analytics" ON public.video_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own video analytics" ON public.video_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own video analytics" ON public.video_analytics
    FOR UPDATE USING (auth.uid() = user_id);

-- Quality metrics policies
CREATE POLICY "Users can view related quality metrics" ON public.video_quality_metrics
    FOR SELECT USING (
        analytics_id IN (
            SELECT id FROM public.video_analytics WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert quality metrics" ON public.video_quality_metrics
    FOR INSERT WITH CHECK (
        analytics_id IN (
            SELECT id FROM public.video_analytics WHERE user_id = auth.uid()
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_analytics_user_unit ON public.video_analytics(user_id, unit_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_session ON public.video_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_completed ON public.video_analytics(is_completed, completed_at);
CREATE INDEX IF NOT EXISTS idx_video_quality_analytics ON public.video_quality_metrics(analytics_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_video_analytics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_analytics_updated_at
    BEFORE UPDATE ON public.video_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_video_analytics_updated_at();

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION calculate_engagement_score(
    watch_time DECIMAL,
    total_duration DECIMAL,
    pause_count INTEGER,
    seek_count INTEGER,
    rewind_count INTEGER
) RETURNS DECIMAL AS $$
BEGIN
    -- Simple engagement score algorithm
    -- Base score from watch time percentage
    DECLARE
        base_score DECIMAL := (watch_time / total_duration) * 100;
        penalty DECIMAL := 0;
        engagement_score DECIMAL;
    BEGIN
        -- Penalize excessive pausing/seeking (indicates confusion or disengagement)
        penalty := (pause_count * 2) + (seek_count * 1) + (rewind_count * 3);
        
        engagement_score := GREATEST(0, base_score - penalty);
        
        -- Cap at 100
        RETURN LEAST(100, engagement_score);
    END;
END;
$$ LANGUAGE plpgsql;


-- ===================================================================
-- ANTI-CHEAT SYSTEM TABLES
-- ===================================================================

-- Table for anti-cheat validation
CREATE TABLE IF NOT EXISTS public.video_validation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analytics_id UUID REFERENCES public.video_analytics(id) ON DELETE CASCADE,
    
    -- Time validation
    total_video_duration DECIMAL(10,2), -- Total duration in seconds
    minimum_watch_time DECIMAL(10,2), -- 90% of total duration
    actual_watch_time DECIMAL(10,2) DEFAULT 0, -- Time actually watched
    valid_watch_time DECIMAL(10,2) DEFAULT 0, -- Time watched without cheating
    
    -- Anti-cheat metrics
    large_skips_detected INTEGER DEFAULT 0, -- Jumps > 10 seconds
    suspicious_segments INTEGER DEFAULT 0, -- Segments with very fast progress
    cheat_score DECIMAL(5,2) DEFAULT 100, -- 100 = no cheating, 0 = heavily cheated
    
    -- Validation status
    time_requirement_met BOOLEAN DEFAULT FALSE, -- 90% time requirement met
    progress_unlocked BOOLEAN DEFAULT FALSE, -- 95% progress tracking unlocked
    can_complete BOOLEAN DEFAULT FALSE, -- All requirements met
    
    -- Detailed tracking
    watch_segments JSONB DEFAULT '[]', -- Valid watch segments with timestamps
    invalid_segments JSONB DEFAULT '[]', -- Skipped/invalid segments
    last_valid_position DECIMAL(10,2) DEFAULT 0, -- Last valid position reached
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies for video validation
ALTER TABLE public.video_validation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own video validation" ON public.video_validation
    FOR SELECT USING (
        analytics_id IN (
            SELECT id FROM public.video_analytics WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own video validation" ON public.video_validation
    FOR INSERT WITH CHECK (
        analytics_id IN (
            SELECT id FROM public.video_analytics WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own video validation" ON public.video_validation
    FOR UPDATE USING (
        analytics_id IN (
            SELECT id FROM public.video_analytics WHERE user_id = auth.uid()
        )
    );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_video_validation_analytics ON public.video_validation(analytics_id);
CREATE INDEX IF NOT EXISTS idx_video_validation_status ON public.video_validation(can_complete, time_requirement_met);

-- Triggers
CREATE OR REPLACE FUNCTION update_video_validation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_validation_updated_at
    BEFORE UPDATE ON public.video_validation
    FOR EACH ROW
    EXECUTE FUNCTION update_video_validation_updated_at();

-- Function to calculate cheat score
CREATE OR REPLACE FUNCTION calculate_cheat_score(
    total_duration DECIMAL,
    actual_watch_time DECIMAL,
    valid_watch_time DECIMAL,
    large_skips INTEGER,
    suspicious_segments INTEGER
) RETURNS DECIMAL AS $$
DECLARE
    base_score DECIMAL := 100;
    time_penalty DECIMAL;
    skip_penalty DECIMAL;
    segment_penalty DECIMAL;
    final_score DECIMAL;
BEGIN
    -- Time penalty: if actual watch time is much less than valid time
    IF valid_watch_time > 0 THEN
        time_penalty := ((valid_watch_time - actual_watch_time) / valid_watch_time) * 30;
    ELSE
        time_penalty := 0;
    END IF;
    
    -- Skip penalty: each large skip reduces score
    skip_penalty := large_skips * 15;
    
    -- Suspicious segment penalty
    segment_penalty := suspicious_segments * 10;
    
    final_score := base_score - time_penalty - skip_penalty - segment_penalty;
    
    -- Ensure score doesn't go below 0
    RETURN GREATEST(0, final_score);
END;
$$ LANGUAGE plpgsql;

-- Function to validate if user can complete video
CREATE OR REPLACE FUNCTION can_complete_video(
    p_analytics_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_validation RECORD;
    v_analytics RECORD;
BEGIN
    -- Get validation data
    SELECT * INTO v_validation FROM public.video_validation WHERE analytics_id = p_analytics_id;
    SELECT * INTO v_analytics FROM public.video_analytics WHERE id = p_analytics_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;
    
    -- Check if time requirement is met (90% of total duration)
    IF v_validation.time_requirement_met = FALSE THEN
        RETURN FALSE;
    END IF;
    
    -- Check if cheat score is acceptable (above 70)
    IF v_validation.cheat_score < 70 THEN
        RETURN FALSE;
    END IF;
    
    -- Check if progress is unlocked
    IF v_validation.progress_unlocked = FALSE THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

