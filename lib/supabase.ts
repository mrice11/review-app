import { createClient } from "@supabase/supabase-js";

// These two values come from your Supabase project settings.
// See README.md for exactly where to find them.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Booking = {
  id: string;
  business_id: string;
  customer_name: string;
  customer_email: string;
  event_date: string;
  status: "awaiting" | "sent" | "reviewed" | "flagged";
  feedback?: string;
  created_at: string;
};

export type Business = {
  id: string;
  business_name: string;
  google_review_link: string;
  webhook_token: string;
  created_at: string;
};
