import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

// This route is called automatically once a day by Vercel Cron
// (configured in vercel.json). It finds bookings whose event was
// yesterday and still says "awaiting", emails the customer, and
// marks the booking as "sent".
export async function GET() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*")
    .eq("event_date", dateStr)
    .eq("status", "awaiting");

  for (const booking of bookings ?? []) {
    const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/review/${booking.id}`;

    await resend.emails.send({
      from: "Miller's Event Rentals <onboarding@resend.dev>",
      to: booking.customer_email,
      subject: "How did everything go?",
      html: `<p>Hey ${booking.customer_name}, thanks for renting from us! How did everything go?</p>
             <p><a href="${reviewUrl}">Let us know here</a></p>`,
    });

    await supabase
      .from("bookings")
      .update({ status: "sent" })
      .eq("id", booking.id);
  }

  return NextResponse.json({ sent: bookings?.length ?? 0 });
}
