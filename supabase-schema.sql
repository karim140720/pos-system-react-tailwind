-- POS System Database Schema for Supabase
-- Run this in the Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE customer_type AS ENUM ('in_shop', 'trading');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'bank_transfer', 'credit');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'completed', 'cancelled');
CREATE TYPE product_category AS ENUM ('safety_equipment', 'trading_supplies', 'tools', 'consumables');
CREATE TYPE cashbox_transaction_type AS ENUM ('opening', 'sale', 'expense', 'adjustment', 'closing');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'manager' CHECK (role IN ('admin', 'manager', 'cashier')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE public.customers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    type customer_type DEFAULT 'in_shop',
    address TEXT,
    credit_limit DECIMAL(10,2) DEFAULT 0,
    current_balance DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products/Inventory table
CREATE TABLE public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category product_category NOT NULL,
    sku TEXT UNIQUE,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    cost DECIMAL(10,2) DEFAULT 0 CHECK (cost >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    min_stock INTEGER DEFAULT 0 CHECK (min_stock >= 0),
    supplier TEXT,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders/Invoices table
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL, -- Denormalized for performance
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax DECIMAL(10,2) DEFAULT 0 CHECK (tax >= 0),
    discount DECIMAL(10,2) DEFAULT 0 CHECK (discount >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    payment_method payment_method NOT NULL,
    status order_status DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Order items table
CREATE TABLE public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL, -- Denormalized for performance
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE public.expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category TEXT NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    payment_method payment_method NOT NULL,
    receipt_url TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cashbox transactions table
CREATE TABLE public.cashbox_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    type cashbox_transaction_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
    expense_id UUID REFERENCES public.expenses(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cashbox daily summary table
CREATE TABLE public.cashbox_daily (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    opening_balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    closing_balance DECIMAL(10,2),
    total_sales DECIMAL(10,2) DEFAULT 0,
    total_expenses DECIMAL(10,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_name ON public.customers(name);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_products_name ON public.products(name);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_cashbox_transactions_date ON public.cashbox_transactions(created_at);
CREATE INDEX idx_cashbox_daily_date ON public.cashbox_daily(date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cashbox_daily_updated_at BEFORE UPDATE ON public.cashbox_daily FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashbox_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cashbox_daily ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow authenticated users to access all data
-- (You can customize these based on your business needs)

-- Users can read their own data
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);

-- All authenticated users can manage customers
CREATE POLICY "Authenticated users can manage customers" ON public.customers FOR ALL USING (auth.role() = 'authenticated');

-- All authenticated users can manage products
CREATE POLICY "Authenticated users can manage products" ON public.products FOR ALL USING (auth.role() = 'authenticated');

-- All authenticated users can manage orders
CREATE POLICY "Authenticated users can manage orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');

-- All authenticated users can manage order items
CREATE POLICY "Authenticated users can manage order items" ON public.order_items FOR ALL USING (auth.role() = 'authenticated');

-- All authenticated users can manage expenses
CREATE POLICY "Authenticated users can manage expenses" ON public.expenses FOR ALL USING (auth.role() = 'authenticated');

-- All authenticated users can manage cashbox transactions
CREATE POLICY "Authenticated users can manage cashbox transactions" ON public.cashbox_transactions FOR ALL USING (auth.role() = 'authenticated');

-- All authenticated users can manage cashbox daily
CREATE POLICY "Authenticated users can manage cashbox daily" ON public.cashbox_daily FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO public.customers (name, phone, email, type, address, credit_limit, current_balance) VALUES
('أحمد محمد', '+201001234567', 'ahmed@example.com', 'in_shop', 'القاهرة، مصر', 5000, 0),
('شركة البناء المتقدم', '+201223456789', 'info@advanced-construction.com', 'trading', 'الإسكندرية، مصر', 50000, 15000);

INSERT INTO public.products (name, category, sku, price, cost, stock, min_stock, supplier, description) VALUES
('خوذة أمان', 'safety_equipment', 'HELMET-001', 150, 100, 50, 10, 'مورد معدات الأمان', 'خوذة أمان عالية الجودة'),
('حذاء أمان', 'safety_equipment', 'SHOE-001', 200, 130, 30, 5, 'مورد معدات الأمان', 'حذاء أمان مقاوم للانزلاق'),
('قفازات عمل', 'safety_equipment', 'GLOVE-001', 25, 15, 100, 20, 'مورد معدات الأمان', 'قفازات عمل متينة');

-- Create a function to get low stock products
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS TABLE (
    id UUID,
    name TEXT,
    stock INTEGER,
    min_stock INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.name, p.stock, p.min_stock
    FROM public.products p
    WHERE p.stock <= p.min_stock AND p.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get daily sales summary
CREATE OR REPLACE FUNCTION get_daily_sales_summary(target_date DATE DEFAULT CURRENT_DATE)
RETURNS TABLE (
    total_sales DECIMAL(10,2),
    total_orders INTEGER,
    total_customers INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(o.total), 0) as total_sales,
        COUNT(o.id)::INTEGER as total_orders,
        COUNT(DISTINCT o.customer_id)::INTEGER as total_customers
    FROM public.orders o
    WHERE DATE(o.created_at) = target_date
    AND o.status = 'completed';
END;
$$ LANGUAGE plpgsql;
