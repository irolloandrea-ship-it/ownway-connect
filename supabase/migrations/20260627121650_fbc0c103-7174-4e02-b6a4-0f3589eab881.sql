
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users see own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE POLICY "admins see all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- Explorer trip requests
CREATE TABLE public.explorer_trip_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT,
  email TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  destination_country TEXT,
  travel_start_date DATE,
  travel_end_date DATE,
  trip_duration TEXT NOT NULL,
  travel_group TEXT,
  first_time_destination TEXT,
  accommodation_area TEXT,
  already_planned_text TEXT,
  authenticity_comfort_score INT,
  slow_intense_score INT,
  famous_hidden_score INT,
  planning_spontaneity_score INT,
  movement_score INT,
  queue_tolerance_score INT,
  interests TEXT[] DEFAULT '{}',
  specific_request_text TEXT,
  budget_style TEXT,
  food_preferences TEXT,
  mobility_constraints TEXT,
  safety_concerns TEXT,
  preferred_languages TEXT[] DEFAULT '{}',
  consent_to_match BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'matching_pending',
  private_trip_space_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  matching_prompt_packet TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  matched_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE ON public.explorer_trip_requests TO anon, authenticated;
GRANT ALL ON public.explorer_trip_requests TO service_role;
ALTER TABLE public.explorer_trip_requests ENABLE ROW LEVEL SECURITY;
-- No anonymous SELECT broadly; we expose via server fn using token. Admin can read all.
CREATE POLICY "anon can insert trip" ON public.explorer_trip_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read trips" ON public.explorer_trip_requests FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins update trips" ON public.explorer_trip_requests FOR UPDATE TO authenticated USING (public.is_admin());
CREATE TRIGGER trg_trip_updated BEFORE UPDATE ON public.explorer_trip_requests FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- WayMaker applications
CREATE TABLE public.waymaker_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  email TEXT NOT NULL,
  main_location TEXT NOT NULL,
  languages TEXT[] DEFAULT '{}',
  travel_style_tags TEXT[] DEFAULT '{}',
  travel_style_description TEXT,
  preferred_help_methods TEXT[] DEFAULT '{}',
  availability TEXT,
  preferred_contact_method TEXT,
  motivation_text TEXT,
  useful_advice_text TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  blog_url TEXT,
  google_maps_url TEXT,
  other_url TEXT,
  consent_to_profile_review BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending_review',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.waymaker_applications TO anon, authenticated;
GRANT SELECT, UPDATE ON public.waymaker_applications TO authenticated;
GRANT ALL ON public.waymaker_applications TO service_role;
ALTER TABLE public.waymaker_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon can apply" ON public.waymaker_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read apps" ON public.waymaker_applications FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins update apps" ON public.waymaker_applications FOR UPDATE TO authenticated USING (public.is_admin());
CREATE TRIGGER trg_app_updated BEFORE UPDATE ON public.waymaker_applications FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Waymaker destinations
CREATE TABLE public.waymaker_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waymaker_id UUID NOT NULL,
  city TEXT NOT NULL,
  country TEXT,
  relationship_to_destination TEXT,
  confidence_level INT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT, SELECT ON public.waymaker_destinations TO anon, authenticated;
GRANT ALL ON public.waymaker_destinations TO service_role;
ALTER TABLE public.waymaker_destinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read destinations" ON public.waymaker_destinations FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon insert destinations" ON public.waymaker_destinations FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins update destinations" ON public.waymaker_destinations FOR UPDATE TO authenticated USING (public.is_admin());

-- Waymaker public profiles
CREATE TABLE public.waymaker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waymaker_application_id UUID REFERENCES public.waymaker_applications(id) ON DELETE SET NULL,
  public_name TEXT NOT NULL,
  main_location TEXT,
  languages TEXT[] DEFAULT '{}',
  bio TEXT,
  travel_style_tags TEXT[] DEFAULT '{}',
  best_for_tags TEXT[] DEFAULT '{}',
  level TEXT NOT NULL DEFAULT 'WayMaker',
  way_score_average NUMERIC,
  completed_helps_count INT NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.waymaker_profiles TO anon, authenticated;
GRANT ALL ON public.waymaker_profiles TO service_role;
ALTER TABLE public.waymaker_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read profiles" ON public.waymaker_profiles FOR SELECT TO anon, authenticated USING (is_public = true);
CREATE POLICY "admins all profiles" ON public.waymaker_profiles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_profile_updated BEFORE UPDATE ON public.waymaker_profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Matched waymakers
CREATE TABLE public.matched_waymakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  explorer_trip_request_id UUID NOT NULL REFERENCES public.explorer_trip_requests(id) ON DELETE CASCADE,
  waymaker_profile_id UUID NOT NULL REFERENCES public.waymaker_profiles(id) ON DELETE CASCADE,
  admin_match_reason TEXT,
  explorer_selected BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'suggested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  selected_at TIMESTAMPTZ
);
GRANT SELECT ON public.matched_waymakers TO anon, authenticated;
GRANT ALL ON public.matched_waymakers TO service_role;
ALTER TABLE public.matched_waymakers ENABLE ROW LEVEL SECURITY;
-- Explorer access is mediated by server fn using token; allow admin direct access
CREATE POLICY "admins all matches" ON public.matched_waymakers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- City feed posts
CREATE TABLE public.city_feed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  country TEXT,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  expiration_date DATE,
  source TEXT,
  contributor_type TEXT,
  contributor_id UUID,
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.city_feed_posts TO anon, authenticated;
GRANT ALL ON public.city_feed_posts TO service_role;
ALTER TABLE public.city_feed_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read approved feed" ON public.city_feed_posts FOR SELECT TO anon, authenticated USING (status = 'approved');
CREATE POLICY "admins all feed" ON public.city_feed_posts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_feed_updated BEFORE UPDATE ON public.city_feed_posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Trip feedback
CREATE TABLE public.trip_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  explorer_trip_request_id UUID NOT NULL REFERENCES public.explorer_trip_requests(id) ON DELETE CASCADE,
  waymaker_profile_id UUID REFERENCES public.waymaker_profiles(id) ON DELETE SET NULL,
  internal_match_score INT,
  internal_match_feedback TEXT,
  understanding_score INT,
  advice_quality_score INT,
  accuracy_score INT,
  usefulness_score INT,
  overall_experience_score INT,
  most_useful_text TEXT,
  improvement_text TEXT,
  public_review_permission BOOLEAN NOT NULL DEFAULT false,
  admin_review_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.trip_feedback TO anon, authenticated;
GRANT SELECT, UPDATE ON public.trip_feedback TO authenticated;
GRANT ALL ON public.trip_feedback TO service_role;
ALTER TABLE public.trip_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon insert feedback" ON public.trip_feedback FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read feedback" ON public.trip_feedback FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins update feedback" ON public.trip_feedback FOR UPDATE TO authenticated USING (public.is_admin());
