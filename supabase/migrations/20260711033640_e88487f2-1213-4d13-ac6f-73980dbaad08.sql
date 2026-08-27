CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1 CHECK (guest_count >= 1 AND guest_count <= 6),
  dietary_notes TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.rsvps TO anon;
GRANT INSERT ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an RSVP"
  ON public.rsvps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(guest_name) > 0 AND length(guest_name) <= 100 AND
    length(email) > 0 AND length(email) <= 255 AND
    (dietary_notes IS NULL OR length(dietary_notes) <= 500) AND
    (message IS NULL OR length(message) <= 1000)
  );