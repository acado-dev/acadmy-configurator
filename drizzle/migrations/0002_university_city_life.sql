CREATE TABLE public.university_city_life (university_id text PRIMARY KEY, university_name text NOT NULL, draft jsonb NOT NULL DEFAULT '{}'::jsonb, published jsonb, saved_at timestamptz NOT NULL DEFAULT now(), published_at timestamptz);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.university_city_life TO authenticated;
GRANT ALL ON public.university_city_life TO service_role;
ALTER TABLE public.university_city_life ENABLE ROW LEVEL SECURITY;
CREATE POLICY city_life_admin ON public.university_city_life FOR ALL TO authenticated USING (public.can_manage_community_university(auth.uid(),university_id)) WITH CHECK (public.can_manage_community_university(auth.uid(),university_id));
CREATE FUNCTION public.city_life_published(university text) RETURNS TABLE(university_id text,university_name text,content jsonb,published_at timestamptz) LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT university_id,university_name,published,published_at FROM public.university_city_life WHERE university_id=university AND published IS NOT NULL $$;
REVOKE ALL ON FUNCTION public.city_life_published(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.city_life_published(text) TO anon,authenticated;
CREATE FUNCTION public.validate_city_life() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ DECLARE item jsonb; section text; target text; BEGIN
IF jsonb_typeof(NEW.draft)<>'object' THEN RAISE EXCEPTION 'Draft must be structured content'; END IF;
NEW.saved_at:=now();
IF NEW.published IS NOT NULL AND NEW.published IS DISTINCT FROM OLD.published THEN
IF coalesce(trim(NEW.published->>'title'),'')='' OR coalesce(trim(NEW.published->>'city'),'')='' OR coalesce(trim(NEW.published->>'country'),'')='' THEN RAISE EXCEPTION 'Page title, city and country are required'; END IF;
IF coalesce(NEW.published->>'hero','')<>'' AND coalesce(trim(NEW.published->>'heroAlt'),'')='' THEN RAISE EXCEPTION 'Hero alt text is required'; END IF;
FOREACH section IN ARRAY ARRAY['facts','seasons','places','housing','gallery','faqs'] LOOP
IF jsonb_typeof(NEW.published->section) IS DISTINCT FROM 'array' THEN RAISE EXCEPTION 'Content collections must be arrays'; END IF;
FOR item IN SELECT value FROM jsonb_array_elements(NEW.published->section) LOOP
IF coalesce((item->>'visible')::boolean,true) THEN
IF section='gallery' AND (coalesce(item->>'image','')='' OR coalesce(trim(item->>'alt'),'')='') THEN RAISE EXCEPTION 'Gallery images and alt text are required'; END IF;
IF section<>'gallery' AND coalesce(trim(item->>'title'),'')='' THEN RAISE EXCEPTION 'Visible entries need a title'; END IF;
IF section='faqs' AND coalesce(trim(item->>'description'),'')='' THEN RAISE EXCEPTION 'FAQs need answers'; END IF;
IF section='places' AND coalesce(item->>'url','')<>'' AND (item->>'url') !~ '^https://(maps\.app\.goo\.gl/|maps\.google\.com/|www\.google\.com/maps(/|\?)|google\.com/maps(/|\?))' THEN RAISE EXCEPTION 'Place links must point to Google Maps'; END IF;
IF section='housing' AND coalesce(item->>'url','')<>'' AND (item->>'url') !~ '^https://[^/[:space:]]+(/|$)' THEN RAISE EXCEPTION 'Housing resources must use HTTPS'; END IF;
END IF; END LOOP; END LOOP;
target:=coalesce(NEW.published->>'appointmentUrl',''); IF target<>'' AND target !~ '^https://[^/[:space:]]+(/|$)' THEN RAISE EXCEPTION 'Appointment calendar must use HTTPS'; END IF;
IF coalesce((NEW.published->>'weatherEnabled')::boolean,false) AND (coalesce(NEW.published->>'latitude','')='' OR coalesce(NEW.published->>'longitude','')='' OR (NEW.published->>'latitude')::numeric NOT BETWEEN -90 AND 90 OR (NEW.published->>'longitude')::numeric NOT BETWEEN -180 AND 180) THEN RAISE EXCEPTION 'Valid weather coordinates are required'; END IF;
NEW.published_at:=now();
END IF;
IF NEW.published IS NULL THEN NEW.published_at:=NULL; END IF; RETURN NEW; END $$;
CREATE TRIGGER validate_city_life_content BEFORE INSERT OR UPDATE ON public.university_city_life FOR EACH ROW EXECUTE FUNCTION public.validate_city_life();
CREATE POLICY city_life_media_admin ON storage.objects FOR ALL TO authenticated USING (bucket_id='city-life-media' AND public.can_manage_community_university(auth.uid(),(storage.foldername(name))[1])) WITH CHECK (bucket_id='city-life-media' AND public.can_manage_community_university(auth.uid(),(storage.foldername(name))[1]));
CREATE POLICY city_life_media_published ON storage.objects FOR SELECT TO anon,authenticated USING (bucket_id='city-life-media' AND EXISTS (SELECT 1 FROM public.city_life_published((storage.foldername(name))[1]) p WHERE jsonb_path_exists(p.content,'$.** ? (@ == $path)',jsonb_build_object('path',name))));