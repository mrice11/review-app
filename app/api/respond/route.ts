import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Uses the service role key here (server-side only) so this works
// even with row-level security locked down later.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { bookingId, feedback } = await req.json();

  await supabase
    .from("bookings")
    .update({ status: "flagged", feedback })
    .eq("id", bookingId);

  return NextResponse.json({ ok: true });
}
