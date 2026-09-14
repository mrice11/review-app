import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// Runs once a day via Vercel Cron (see vercel.json). Finds every
// booking, across every business, whose event was yesterday and
// still says "awaiting", emails the customer, and marks it "sent".
export async function GET() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, businesses(business_name)")
    .eq("event_date", dateStr)
    .eq("status", "awaiting");

  let sentCount = 0;

  for (const booking of bookings ?? []) {
    const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/review/${booking.id}`;
    const businessName = booking.businesses?.business_name ?? "Us";

    await resend.emails.send({
      from: `${businessName} <onboarding@resend.dev>`,
      to: booking.customer_email,
      subject: "How did everything go?",
      html: `<p>Hey ${booking.customer_name}, thanks for renting from ${businessName}! How did everything go?</p>
             <p><a href="${reviewUrl}">Let us know here</a></p>`,
    });

    await supabase
      .from("bookings")
      .update({ status: "sent" })
      .eq("id", booking.id);

    sentCount++;
  }

  return NextResponse.json({ sent: sentCount });
}
