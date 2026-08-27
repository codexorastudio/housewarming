import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const rsvpSchema = z.object({
  guest_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  attending: z.boolean(),
  guest_count: z.number().int().min(1).max(6),
  dietary_notes: z.string().trim().max(500).optional().nullable(),
  message: z.string().trim().max(1000).optional().nullable(),
});

export const submitRsvp = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => rsvpSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
    const { error } = await supabase.from("rsvps").insert({
      guest_name: data.guest_name,
      email: data.email,
      attending: data.attending,
      guest_count: data.guest_count,
      dietary_notes: data.dietary_notes ?? null,
      message: data.message ?? null,
    });
    if (error) {
      console.error("RSVP insert failed", error);
      throw new Error("Could not save your RSVP. Please try again.");
    }
    return { ok: true };
  });
