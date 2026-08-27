import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { submitRsvp } from "@/lib/rsvp.functions";
import { toast } from "sonner";

const schema = z.object({
  guest_name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  attending: z.enum(["yes", "no"]),
  guest_count: z.coerce.number().int().min(1).max(6),
  dietary_notes: z.string().trim().max(500).optional(),
  message: z.string().trim().max(1000).optional(),
});

export function RsvpForm() {
  const send = useServerFn(submitRsvp);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      guest_name: fd.get("guest_name"),
      email: fd.get("email"),
      attending: fd.get("attending"),
      guest_count: fd.get("guest_count"),
      dietary_notes: fd.get("dietary_notes") || undefined,
      message: fd.get("message") || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your entries");
      return;
    }
    setLoading(true);
    try {
      await send({
        data: {
          ...parsed.data,
          attending: parsed.data.attending === "yes",
        },
      });
      setDone(true);
      toast.success("Thank you — your response has been recorded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-sm border border-primary/20 bg-ivory/80 p-10 text-center shadow-[var(--shadow-frame)] max-w-xl mx-auto backdrop-blur-md">
        <p className="font-script text-4xl text-primary">Thank you</p>
        <p className="mt-4 text-lg text-foreground/80 italic font-body">
          Your response has been received. We can't wait to celebrate with you.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full border-0 border-b border-primary/25 bg-transparent px-1 py-3 font-body text-lg text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none focus:ring-0 transition-colors duration-300";
  const labelCls = "font-sans-ui text-[10px] uppercase tracking-[0.35em] text-primary/80 font-medium";

  return (
    <div className="mx-auto w-full max-w-2xl rounded-sm border border-primary/15 bg-ivory/40 p-8 sm:p-12 backdrop-blur-md shadow-[var(--shadow-frame)]">
      <form onSubmit={onSubmit} className="grid gap-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className={labelCls}>Full name</span>
            <input required name="guest_name" maxLength={100} className={inputCls} placeholder="Your name" />
          </label>
          <label className="grid gap-2">
            <span className={labelCls}>Email</span>
            <input required type="email" name="email" maxLength={255} className={inputCls} placeholder="you@example.com" />
          </label>
        </div>

        <fieldset className="grid gap-4">
          <legend className={labelCls}>Will you attend?</legend>
          <div className="flex flex-wrap gap-8 pt-2">
            {(["yes", "no"] as const).map((v) => (
              <label key={v} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="attending"
                    value={v}
                    defaultChecked={v === "yes"}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-5 rounded-full border border-primary/45 bg-transparent group-hover:border-primary transition-colors duration-300" />
                  <div className="absolute h-2.5 w-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform duration-300" />
                </div>
                <span className="font-body text-[17px] text-foreground/90 select-none">
                  {v === "yes" ? "Joyfully accept" : "Regretfully decline"}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="grid gap-2 relative">
          <span className={labelCls}>Number of guests</span>
          <div className="relative">
            <select name="guest_count" defaultValue="1" className={`${inputCls} appearance-none pr-10 cursor-pointer`}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n} className="bg-ivory text-foreground">{n}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-primary/60">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>
        </label>

        <label className="grid gap-2">
          <span className={labelCls}>Dietary requirements</span>
          <input name="dietary_notes" maxLength={500} className={inputCls} placeholder="Vegetarian, allergies, etc." />
        </label>

        <label className="grid gap-2">
          <span className={labelCls}>A note for the couple</span>
          <textarea name="message" maxLength={1000} rows={3} className={inputCls + " resize-none"} placeholder="Send love, wishes, or song requests…" />
        </label>

        <div className="text-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 border border-primary bg-primary px-12 py-4 font-sans-ui text-[11px] uppercase tracking-[0.4em] text-primary-foreground transition duration-300 hover:bg-wine-deep disabled:opacity-60 cursor-pointer"
          >
            {loading ? "Sending…" : "Send RSVP"}
          </button>
        </div>
      </form>
    </div>
  );
}
