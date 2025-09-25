-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('brand', 'stylist');

-- Create enum for invite status
CREATE TYPE public.invite_status AS ENUM ('pending', 'accepted', 'expired');

-- Create enum for brand target audience
CREATE TYPE public.target_audience AS ENUM ('15-19_anos', '20-29_anos', '30-45_anos', '46-60_anos', '60+_anos');

-- Create enum for price ranges
CREATE TYPE public.price_range AS ENUM ('popular_100', 'medio_300', 'alto_600', 'luxo');

-- Create enum for segment
CREATE TYPE public.segment AS ENUM ('luxo', 'premium', 'fast_fashion', 'sustentavel', 'praia', 'fitness', 'jeanswear');

-- Create enum for production model
CREATE TYPE public.production_model AS ENUM ('pronta_entrega', 'sob_encomenda', 'pre_venda', 'dropshipping');

-- Create enum for business model
CREATE TYPE public.business_model AS ENUM ('b2b', 'b2c', 'marketplace', 'atacado_varejo');

-- Create enum for experience level
CREATE TYPE public.experience_level AS ENUM ('iniciante', '1-3_anos', '3-5_anos', '5-10_anos', 'mais_10_anos');

-- Create enum for delivery
CREATE TYPE public.delivery AS ENUM ('3_dias', '4_7_dias', '8_15_dias', 'mais_15_dias');

-- Create enum for life style
CREATE TYPE public.life_style AS ENUM ('classica', 'urbana', 'fashionista', 'minimalista', 'executiva', 'boemia');

-- Create enum for clients inspiration
CREATE TYPE public.clients_inspiration AS ENUM ('instagram', 'pinterest', 'tik_tok', 'famosos', 'desfiles');

-- Create enum for favorite clothes
CREATE TYPE public.favorite_clothes AS ENUM ('calca_jeans', 'saia_longa', 'blusa_alça', 'blusa_manga', 'regata', 'vestido_curto', 'vestido_longo', 'calça_alfaiataria', 'short', 'cropped', 'bermuda', 'legging', 'saia_curta', 'saia_reta', 'camisa', 'jaqueta', 'blusa_frio', 'biquine', 'maio', 'body', 'saida_de_praia');

-- Create enum for brand interests
CREATE TYPE public.brand_interests AS ENUM ('aumentar_ticket_medio', 'atrair_publico', 'consolidar_publico', 'aumentar_categorias', 'melhorar_producao');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    user_type user_type NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brands table for brand-specific data
CREATE TABLE public.brands (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    target_audience target_audience NOT NULL,
    price_range price_range NOT NULL,
    business_model business_model NOT NULL,
    main_challenges TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stylists table for stylist-specific data
CREATE TABLE public.stylists (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    experience experience_level NOT NULL,
    portfolio TEXT,
    specialties TEXT[],
    premium_access BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create brand invites table for the referral system
CREATE TABLE public.brand_invites (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    invite_code TEXT NOT NULL UNIQUE,
    stylist_id UUID NOT NULL REFERENCES public.stylists(id) ON DELETE CASCADE,
    brand_name TEXT NOT NULL,
    brand_email TEXT NOT NULL,
    status invite_status NOT NULL DEFAULT 'pending',
    brand_id UUID REFERENCES public.brands(id),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_invites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for brands
CREATE POLICY "Brands can view their own data" 
ON public.brands 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = brands.profile_id 
        AND profiles.user_id = auth.uid()
    )
);

CREATE POLICY "Brands can create their own data" 
ON public.brands 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = brands.profile_id 
        AND profiles.user_id = auth.uid()
    )
);

CREATE POLICY "Brands can update their own data" 
ON public.brands 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = brands.profile_id 
        AND profiles.user_id = auth.uid()
    )
);

-- Create RLS policies for stylists
CREATE POLICY "Stylists can view their own data" 
ON public.stylists 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = stylists.profile_id 
        AND profiles.user_id = auth.uid()
    )
);

CREATE POLICY "Stylists can create their own data" 
ON public.stylists 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = stylists.profile_id 
        AND profiles.user_id = auth.uid()
    )
);

CREATE POLICY "Stylists can update their own data" 
ON public.stylists 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = stylists.profile_id 
        AND profiles.user_id = auth.uid()
    )
);

-- Create RLS policies for brand invites
CREATE POLICY "Stylists can view their own invites" 
ON public.brand_invites 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.stylists s
        JOIN public.profiles p ON p.id = s.profile_id
        WHERE s.id = brand_invites.stylist_id 
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Stylists can create invites" 
ON public.brand_invites 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.stylists s
        JOIN public.profiles p ON p.id = s.profile_id
        WHERE s.id = brand_invites.stylist_id 
        AND p.user_id = auth.uid()
    )
);

CREATE POLICY "Stylists can update their invites" 
ON public.brand_invites 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.stylists s
        JOIN public.profiles p ON p.id = s.profile_id
        WHERE s.id = brand_invites.stylist_id 
        AND p.user_id = auth.uid()
    )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brands_updated_at
    BEFORE UPDATE ON public.brands
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stylists_updated_at
    BEFORE UPDATE ON public.stylists
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_invites_updated_at
    BEFORE UPDATE ON public.brand_invites
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();