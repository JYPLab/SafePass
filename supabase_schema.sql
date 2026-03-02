-- Supabase SQL Schema for SafePass AI V2

-- 1. Create Projects Table
CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_name VARCHAR NOT NULL,
    target_market VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    status VARCHAR DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ANALYZING', 'COMPLETED')),
    ingredients_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Optional, can be disabled for pure MVP testing)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read/write access for all users" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- 2. Create Regulation Database (Mock Seed Data)
CREATE TABLE public.regulation_db (
    id SERIAL PRIMARY KEY,
    market VARCHAR NOT NULL,
    ingredient_name VARCHAR NOT NULL,
    cas_number VARCHAR,
    status VARCHAR NOT NULL CHECK (status IN ('PROHIBITED', 'RESTRICTED', 'SAFE')),
    max_limit DECIMAL,
    regulation_note TEXT
);

-- Enable RLS
ALTER TABLE public.regulation_db ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON public.regulation_db FOR SELECT USING (true);

-- Insert Initial MVP Seed Data for US (FDA) and EU (CPNP) scenarios
INSERT INTO public.regulation_db (market, ingredient_name, cas_number, status, max_limit, regulation_note) VALUES
-- Prohibited
('cpnp', 'Butylphenyl Methylpropional', '80-54-6', 'PROHIBITED', NULL, 'Banned in EU Cosmetic Regulation (CMR 1B substance).'),
('fda', 'Red 3', '16423-68-0', 'PROHIBITED', NULL, 'Banned by FDA for cosmetic use.'),
-- Restricted
('cpnp', 'Retinol', '68-26-8', 'RESTRICTED', 0.30, 'Allowed up to 0.3% in face/hand products.'),
('fda', 'Titanium Dioxide', '13463-67-7', 'RESTRICTED', 25.0, 'Approved as a color additive with limits.'),
('cpnp', 'Phenoxyethanol', '122-99-6', 'RESTRICTED', 1.0, 'Maximum concentration in ready for use preparation is 1.0%.')
ON CONFLICT DO NOTHING;
