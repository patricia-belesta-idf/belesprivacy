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

-- Sample courses
INSERT INTO public.courses (title, description, duration, total_units, is_published) VALUES
('Fundamentos de Protección de Datos', 'Aprende los conceptos básicos de la protección de datos personales, incluyendo principios fundamentales, derechos de los usuarios y obligaciones de las organizaciones.', 120, 8, true),
('GDPR y Regulaciones Europeas', 'Domina el Reglamento General de Protección de Datos (GDPR) y otras regulaciones europeas relacionadas con la privacidad y protección de datos.', 180, 12, true),
('Implementación de Políticas de Privacidad', 'Aprende a crear e implementar políticas de privacidad efectivas, procedimientos de cumplimiento y sistemas de gestión de datos personales.', 150, 10, true)
ON CONFLICT DO NOTHING;

-- Sample units for the first course
INSERT INTO public.units (course_id, title, description, "order", video_url, duration) VALUES
((SELECT id FROM public.courses WHERE title = 'Fundamentos de Protección de Datos' LIMIT 1), 'Introducción a la Protección de Datos', 'Conceptos básicos y fundamentos de la privacidad y protección de datos personales.', 1, 'https://example.com/video1.mp4', 15),
((SELECT id FROM public.courses WHERE title = 'Fundamentos de Protección de Datos' LIMIT 1), 'Principios de la Protección de Datos', 'Los siete principios fundamentales que rigen el tratamiento de datos personales.', 2, 'https://example.com/video2.mp4', 20),
((SELECT id FROM public.courses WHERE title = 'Fundamentos de Protección de Datos' LIMIT 1), 'Derechos de los Usuarios', 'Conoce los derechos que tienen las personas sobre sus datos personales.', 3, 'https://example.com/video3.mp4', 18)
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
