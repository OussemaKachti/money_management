-- Supabase schema for Premium Budget Management App
-- Run this in Supabase SQL editor

create extension if not exists "uuid-ossp";

-- profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- income
create table if not exists income (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  date date,
  source text,
  category text,
  expected numeric default 0,
  actual numeric default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- bills
create table if not exists bills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  bill_name text,
  due_date date,
  budgeted numeric default 0,
  actual numeric default 0,
  paid_status text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- expenses
create table if not exists expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  date date,
  category text,
  subcategory text,
  payment_method text,
  budget numeric default 0,
  actual numeric default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- savings
create table if not exists savings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  goal text,
  target_amount numeric default 0,
  current_saved numeric default 0,
  deadline date,
  monthly_contribution numeric default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- debts
create table if not exists debts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  debt_name text,
  initial_amount numeric default 0,
  remaining_balance numeric default 0,
  interest_rate numeric default 0,
  monthly_payment numeric default 0,
  due_date date,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- accounts
create table if not exists accounts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  account_name text,
  account_type text,
  balance numeric default 0,
  deposits numeric default 0,
  withdrawals numeric default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- categories
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  type text,
  name text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Row Level Security: enable and policies
alter table profiles enable row level security;
create policy "profiles_owner_policy" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Generic policy helper for user-owned tables
-- income
alter table income enable row level security;
create policy "income_owner" on income
  for select using (auth.uid() = user_id);
create policy "income_owner_insert" on income
  for insert with check (auth.uid() = user_id);
create policy "income_owner_update" on income
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "income_owner_delete" on income
  for delete using (auth.uid() = user_id);

-- bills
alter table bills enable row level security;
create policy "bills_owner" on bills
  for select using (auth.uid() = user_id);
create policy "bills_owner_crud" on bills
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- expenses
alter table expenses enable row level security;
create policy "expenses_owner" on expenses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- savings
alter table savings enable row level security;
create policy "savings_owner" on savings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- debts
alter table debts enable row level security;
create policy "debts_owner" on debts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- accounts
alter table accounts enable row level security;
create policy "accounts_owner" on accounts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- categories
alter table categories enable row level security;
create policy "categories_owner" on categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Trigger: create profile on auth user creation
create function public.handle_new_user() returns trigger as $$
begin
  insert into profiles (id, full_name, created_at)
  values (new.id, new.raw_user_meta_data->> 'full_name', timezone('utc', now()))
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- ============================================================
-- LUMINARY BUDGET — SUPABASE SQL SCHEMA
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT '$',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- INCOME
-- ============================================================
CREATE TABLE IF NOT EXISTS public.income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  source TEXT NOT NULL,
  category TEXT DEFAULT 'Other',
  expected NUMERIC(12,2) DEFAULT 0,
  actual NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.income ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own income" ON public.income
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- BILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bill_name TEXT NOT NULL,
  due_date DATE,
  budgeted NUMERIC(12,2) DEFAULT 0,
  actual NUMERIC(12,2) DEFAULT 0,
  paid_status TEXT DEFAULT 'Unpaid',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bills" ON public.bills
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- EXPENSES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  payment_method TEXT DEFAULT 'Cash',
  budget NUMERIC(12,2) DEFAULT 0,
  actual NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own expenses" ON public.expenses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SAVINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.savings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal TEXT NOT NULL,
  target_amount NUMERIC(12,2) DEFAULT 0,
  current_saved NUMERIC(12,2) DEFAULT 0,
  deadline DATE,
  monthly_contribution NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.savings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own savings" ON public.savings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- DEBTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  debt_name TEXT NOT NULL,
  initial_amount NUMERIC(12,2) DEFAULT 0,
  remaining_balance NUMERIC(12,2) DEFAULT 0,
  interest_rate NUMERIC(5,2) DEFAULT 0,
  monthly_payment NUMERIC(12,2) DEFAULT 0,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own debts" ON public.debts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- ACCOUNTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  account_type TEXT DEFAULT 'Checking',
  balance NUMERIC(12,2) DEFAULT 0,
  deposits NUMERIC(12,2) DEFAULT 0,
  withdrawals NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own accounts" ON public.accounts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#C5DFF8',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own categories" ON public.categories
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Done! All tables created with RLS enabled.
-- ============================================================
