# Luminary Budget — Premium Personal Finance Dashboard

This is a full-stack personal finance web application built with React + Vite, Tailwind CSS, Supabase, and Recharts. The UI uses a soft pastel, premium aesthetic inspired by spreadsheet-style finance dashboards.

Key features
- Supabase Auth (email/password)
- Row-Level Security (RLS) for user data
- Dashboard with KPI cards and charts
- CRUD for income, bills, expenses, savings, debts, and accounts
- Demo data seeder after registration
- Responsive Tailwind UI with pastel palette

Quick setup

1. Create a Supabase project at https://app.supabase.com
2. Run the SQL schema in the Supabase SQL editor: `supabase/schema.sql`
3. Copy `.env.example` to `.env` and fill in the values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

4. Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

5. Open http://localhost:5173, register a new account, and optionally load the demo data.

Notes
- The SQL file creates all tables and RLS policies. Ensure you run it before attempting CRUD operations.
- The app expects the `profiles` table trigger to be created so that profiles are auto-generated on signup.

If you want help deploying this to Vercel or Netlify and connecting environment variables, I can add a deployment guide.
# money_management
💰 Modern personal finance &amp; money management web app inspired by spreadsheet workflows 📊 Built with Next.js &amp; Supabase for real-time expense tracking, budgeting, analytics, and financial organization.
