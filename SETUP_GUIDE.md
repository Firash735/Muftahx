# MuftahX — Complete Setup Guide
## From zero to fully working in 15 minutes

---

## STEP 1 — Install Node.js (if not already installed)

Go to https://nodejs.org → download the LTS version → install it.

Check it works:
```bash
node --version
# should show: v20.x.x or higher
```

---

## STEP 2 — Put this project on your computer

Unzip the downloaded file. You get a folder called `muftahx`.

Open your terminal (Mac: Terminal app, Windows: PowerShell or Command Prompt).

Navigate into the folder:
```bash
cd path/to/muftahx
# example on Mac:  cd ~/Downloads/muftahx
# example Windows: cd C:\Users\YourName\Downloads\muftahx
```

Install dependencies:
```bash
npm install
```
This takes 1–2 minutes. You will see packages downloading.

---

## STEP 3 — Set up Supabase (your free database)

1. Go to **https://supabase.com** → Sign Up (free)
2. Click **New Project**
3. Give it a name: `muftahx`
4. Set a database password (save this somewhere safe)
5. Choose region: **East Africa (Nairobi)** or nearest
6. Wait ~2 minutes for project to be ready

Get your API keys:
- In your Supabase project → click **Settings** (gear icon on left)
- Click **API**
- You will see:
  - **Project URL** → looks like `https://abcdefgh.supabase.co`
  - **anon public** key → a long string starting with `eyJ...`
  - **service_role** key → another long string (keep this secret!)

---

## STEP 4 — Add your keys to the project

Open the file `.env.local` in the `muftahx` folder with any text editor (Notepad, VS Code, etc.)

Replace the placeholder values:
```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_ACTUAL_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your_actual_service_role_key
JWT_SECRET=any_long_random_string_you_choose_like_muftahx2025secret
GOOGLE_AUTH_ENABLED=false
```

Save the file.

---

## STEP 5 — Create the database tables

1. In your Supabase project → click **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `supabase_schema.sql` from this project in any text editor
4. Copy ALL the contents
5. Paste it into the Supabase SQL editor
6. Click **Run** (the green button)

You will see: `Success. No rows returned.`

This creates:
- `registrations` table — stores everyone who signs up from the website
- `exporters` table — stores the exporter database (pre-filled with 7 sample records)
- `users` table — stores admin accounts
- Admin user: `sharifabdi735@gmail.com` / password: `Mx!Sharif735#Admin`

---

## STEP 6 — Start the website

In your terminal (inside the muftahx folder):
```bash
npm run dev
```

You will see:
```
▲ Next.js 14.x
  ✓ Local: http://localhost:3000
  ✓ Ready in 370ms
```

---

## STEP 7 — Test everything

Open your browser and test each URL:

### 7a. The Marketplace
```
http://localhost:3000
```
You should see the full MuftahX website with:
- Hero section with Kenya highlands photo
- Live price ticker at the top
- Product cards (Coffee, Tea, Flowers, etc.) — click any card
- SokoData intelligence dashboard
- How It Works accordion
- Compliance badges

### 7b. Test Registration (as a Seller)
1. Click **"I'm a Seller →"** button in the top nav
2. Fill in:
   - Company Name: `Test Kenya Flowers Ltd`
   - Your Name: `James Kamau`
   - Email: `james@testflowers.co.ke`
   - Category: `Cut Flowers`
   - Compliance: `KEPHIS only`
3. Click **"Create Seller Account →"**
4. You should see a green banner: "Registration received! We will contact you within 24 hours..."

### 7c. Test Registration (as a Buyer)
1. Click **"I'm a Buyer"** button
2. Fill in:
   - Company Name: `Dutch Flowers Import BV`
   - Country: `Netherlands`
   - Email: `buyer@dutchflowers.nl`
   - Sourcing: `Cut Flowers`
3. Click **"Find Verified Suppliers →"**
4. Green banner should appear

### 7d. Admin Panel
```
http://localhost:3000/admin
```
Login with:
- Email: `sharifabdi735@gmail.com`
- Password: `Mx!Sharif735#Admin`

You should see:
- **Stats row**: Total registrations, Sellers, Buyers, Exporters counts
- **Registrations tab**: The seller and buyer you just registered appear here
- **Exporters tab**: 7 sample Kenyan exporters pre-loaded

### 7e. Change registration status (admin)
In the Registrations tab:
1. Find the registration you just created
2. In the "Change" column, click the dropdown
3. Change `new` → `contacted`
4. Green toast appears: "✓ Status updated to contacted"
5. The status badge updates immediately

---

## STEP 8 — Check data in Supabase

Go back to Supabase → click **Table Editor** (left sidebar).

Click on `registrations` — you should see the seller and buyer you registered.
Click on `exporters` — you should see the 7 sample exporters.
Click on `users` — you should see the admin account.

---

## WHAT EACH PAGE/URL DOES

| URL | What it is |
|-----|-----------|
| `http://localhost:3000` | Main marketplace (your index.html) |
| `http://localhost:3000/admin` | Admin dashboard — manage registrations |
| `http://localhost:3000/products` | SEO product directory |
| `http://localhost:3000/knowledge` | Export knowledge hub |
| `http://localhost:3000/support` | AI support prototype for buyers, sellers, and admins |
| `http://localhost:3000/buyer/dashboard` | Registered buyer dashboard after Google signup |
| `http://localhost:3000/seller/dashboard` | Registered seller dashboard after Google signup |
| `http://localhost:3000/signup/complete` | Google signup completion route |
| `http://localhost:3000/api/register` | POST endpoint — registration form submits here |
| `http://localhost:3000/api/auth/google?type=seller` | Starts Google signup through Supabase Auth |
| `http://localhost:3000/api/login` | POST endpoint — admin login |
| `http://localhost:3000/api/admin?resource=stats` | GET — stats for admin panel |
| `http://localhost:3000/api/admin?resource=registrations` | GET — all registrations |
| `http://localhost:3000/api/admin?resource=exporters` | GET — all exporters |

---

## ENABLE GOOGLE SIGNUP

The Google signup button uses Supabase Auth. To make it live:

1. Go to Supabase → Authentication → Providers.
2. Enable Google.
3. Add your Google OAuth Client ID and Client Secret.
4. In Google Cloud Console, add your callback URL from Supabase Auth settings.
5. Keep `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
6. Change `GOOGLE_AUTH_ENABLED=false` to `GOOGLE_AUTH_ENABLED=true`.

After that, the signup buttons route through:
`/api/auth/google?type=seller` or `/api/auth/google?type=buyer`.

MuftahX uses Google signup as the main public signup path. This gives each visitor one email identity,
reduces duplicate registrations, and lets the admin panel review real buyers and sellers with cleaner context.

---

## DEPLOY TO THE INTERNET

When you are ready to make it live, push the latest `main` branch to GitHub and connect the repository to your preferred hosting provider. The hosting service must support Next.js and these environment variables from `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

For a production server you control:

```bash
npm install
npm run build
npm run start
```

For GitHub-based deployment, use the repository:
`https://github.com/Firash735/muftahx`

---

## COMMON ERRORS & FIXES

**"Cannot find module" error when running npm run dev**
→ Run `npm install` again

**Green banner doesn't appear after registration**
→ Check `.env.local` has correct Supabase URL and keys (no spaces, no quotes around values)

**Admin login says "Invalid email or password"**
→ Make sure you ran the SQL schema in Supabase (Step 5)
→ Try: sharifabdi735@gmail.com / Mx!Sharif735#Admin

**"Supabase not connected" warning in admin panel**
→ Your `.env.local` keys are wrong or missing. Check Step 4 again.

**Photos don't load**
→ This is normal if your internet is slow. The photos come from Unsplash (free CDN). They load in 1–3 seconds.

---

## PROJECT FILE STRUCTURE

```
muftahx/
├── public/
│   └── index.html          ← Your marketplace (the HTML file)
├── src/
│   ├── app/
│   │   ├── page.tsx        ← Redirects / to index.html
│   │   ├── layout.tsx      ← Root layout
│   │   ├── admin/
│   │   │   └── page.tsx    ← Admin dashboard UI
│   │   └── api/
│   │       ├── register/route.ts  ← Saves registrations to Supabase
│   │       ├── login/route.ts     ← Admin login
│   │       ├── logout/route.ts    ← Clears session
│   │       └── admin/route.ts     ← Reads data for admin panel
│   └── lib/
│       └── supabase.ts     ← Supabase client
├── .env.local              ← YOUR SECRET KEYS (never share this file)
├── supabase_schema.sql     ← Paste this in Supabase SQL editor
├── next.config.js
├── package.json
└── SETUP_GUIDE.md          ← This file
```
