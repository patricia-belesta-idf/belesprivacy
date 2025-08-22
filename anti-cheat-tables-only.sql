-- ===================================================================
-- ANTI-CHEAT SYSTEM TABLES (ONLY NEW TABLES)
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

-- RLS Policies for video analytics
ALTER TABLE public.video_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_validation ENABLE ROW LEVEL SECURITY;

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

-- Video validation policies
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_analytics_user_unit ON public.video_analytics(user_id, unit_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_session ON public.video_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_completed ON public.video_analytics(is_completed, completed_at);
CREATE INDEX IF NOT EXISTS idx_video_quality_analytics ON public.video_quality_metrics(analytics_id);
CREATE INDEX IF NOT EXISTS idx_video_validation_analytics ON public.video_validation(analytics_id);
CREATE INDEX IF NOT EXISTS idx_video_validation_status ON public.video_validation(can_complete, time_requirement_met);

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
