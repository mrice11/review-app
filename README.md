# Review Requests

This is a working starter app: a dashboard where your dad adds bookings,
and every customer automatically gets a review request the day after
their event. Happy customers go straight to Google. Unhappy ones get
routed to him privately.

You don't need to understand the code to get this running — just follow
the steps below in order. Come back to me with the exact error message
any time something doesn't work.

## What you'll create accounts on (all free to start)

1. **Supabase** — the database that stores bookings
2. **Resend** — sends the review request emails
3. **Vercel** — hosts the app and runs the daily "send emails" job
4. **GitHub** — holds the code so Vercel can deploy it

## Step 1: Put this code on GitHub

1. Create a free account at github.com if you don't have one
2. Create a new repository (any name, e.g. `review-requests`)
3. Upload all the files in this folder to that repository
   (GitHub's website lets you drag and drop files — no command line needed)

## Step 2: Set up the database (Supabase)

1. Create a free account at supabase.com
2. Create a new project (pick any name and password — save the password somewhere)
3. Once it's created, go to the **SQL Editor** tab
4. Open `supabase-schema.sql` from this folder, copy everything in it,
   paste it into the SQL editor, and click **Run**
5. Go to **Project Settings > API** — you'll need two values from here in Step 4:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (click "reveal") → this is `SUPABASE_SERVICE_ROLE_KEY`
     (keep this one secret — never share it publicly)

## Step 3: Set up email sending (Resend)

1. Create a free account at resend.com
2. Go to **API Keys** and create a new one → this is `RESEND_API_KEY`
3. Free accounts can send test emails right away using their built-in
   sending address, which is already set up in the code. Later, once
   you want emails to come from your dad's own domain
   (e.g. `reviews@millersrentals.com`), Resend has a simple guide for
   connecting a domain — come back to me when you're ready for that step.

## Step 4: Deploy the app (Vercel)

1. Create a free account at vercel.com and connect it to your GitHub
2. Click **Add New Project** and pick the repository you created in Step 1
3. Before deploying, add these environment variables (Vercel has a
   section for this on the same screen):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `NEXT_PUBLIC_APP_URL` — leave this blank for now, we'll fill it in
     right after your first deploy, once Vercel gives you a URL
4. Click **Deploy**
5. Once it's live, copy the URL Vercel gives you (something like
   `review-requests-xyz.vercel.app`), go back into your project's
   environment variables, and set `NEXT_PUBLIC_APP_URL` to that URL
   (with `https://` in front). Redeploy once after this change.

## Step 5: Point it at your dad's actual Google reviews

1. In `app/review/[id]/page.tsx`, find the line that says
   `GOOGLE_REVIEW_LINK`
2. Replace it with your dad's real "get more reviews" link — search
   Google for "[his business name] get more reviews link" or find it
   in his Google Business Profile under **Ask for reviews**
3. Push that change to GitHub — Vercel will redeploy automatically

## You're live

At this point:
- Your dad can visit his Vercel URL and add bookings
- Every day at 3pm UTC, the app checks for events from the day before
  and emails those customers automatically
- Happy customers get sent to leave a Google review
- Unhappy customers get routed privately, and show up as "flagged" on
  the dashboard

## What to build next

- Add a simple password so only your dad can see the dashboard
- Send by text message instead of (or in addition to) email
- Let him import bookings automatically from whatever software he
  already uses to manage rentals, instead of typing them in by hand

Come back anytime you want to add one of these, or if anything above
doesn't work the way it's described — this is meant to be a starting
point we keep building on together.
