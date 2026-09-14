import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Uses the service role key since this is a public endpoint with no
// login - the secret token in the URL is what protects it instead.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// A business's automation tool (Zapier, Make, etc.) sends a POST
// request here whenever a new booking/invoice happens elsewhere.
// Expected JSON body: { "customer_name": "...", "customer_email": "...", "event_date": "2026-09-20" }
export async function POST(
  req: Request,
  { params }: { params: { token: string } }
) {
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("webhook_token", params.token)
    .single();

  if (!business) {
    return NextResponse.json(
      { error: "Invalid or unknown webhook URL" },
      { status: 404 }
    );
  }

  const body = await req.json();
  const { customer_name, customer_email, event_date } = body;

  if (!customer_name || !customer_email || !event_date) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: customer_name, customer_email, event_date",
      },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("bookings").insert({
    business_id: business.id,
    customer_name,
    customer_email,
    event_date,
    status: "awaiting",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
