# 🚀 Supabase Setup Guide for POS System

## Step 1: Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign up/sign in
2. **Click "New Project"**
3. **Fill in project details:**
   - **Name**: `pos-system-react-tailwind`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with **Free** plan

4. **Wait for project creation** (usually 2-3 minutes)

## Step 2: Get Your Project Credentials

1. **Go to Settings → API** in your Supabase dashboard
2. **Copy these values:**
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Set Up Database Schema

1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy the contents of `supabase-schema.sql`** (created in your project root)
3. **Paste and run the SQL** to create all tables and functions

## Step 4: Configure Environment Variables

1. **Create a `.env` file** in your project root (copy from `env.example`)
2. **Add your Supabase credentials:**

```env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 5: Test the Connection

1. **Start your React app:**
   ```bash
   npm start
   ```

2. **Check the browser console** for any Supabase connection errors

## Step 6: Set Up Authentication (Optional)

1. **Go to Authentication → Settings** in Supabase
2. **Configure your site URL:**
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**: `http://localhost:3000/**`

## Step 7: Enable Row Level Security (RLS)

The SQL schema already includes RLS policies, but you can customize them:

1. **Go to Authentication → Policies** in Supabase
2. **Review the policies** created by the schema
3. **Modify as needed** for your security requirements

## Step 8: Test Database Operations

1. **Go to Table Editor** in Supabase
2. **Check that all tables were created:**
   - `users`
   - `customers`
   - `products`
   - `orders`
   - `order_items`
   - `expenses`
   - `cashbox_transactions`
   - `cashbox_daily`

3. **Verify sample data** was inserted in `customers` and `products` tables

## Step 9: Configure Storage (Optional)

If you want to store product images and receipts:

1. **Go to Storage** in Supabase
2. **Create buckets:**
   - `product-images` (for product photos)
   - `receipts` (for expense receipts)

3. **Set up policies** for public access if needed

## Step 10: Production Deployment

When ready for production:

1. **Update environment variables** with production URLs
2. **Configure production site URL** in Authentication settings
3. **Set up proper RLS policies** for your use case
4. **Enable email authentication** if needed

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Check your `.env` file exists and has correct variable names
   - Restart your development server after adding environment variables

2. **"Invalid API key"**
   - Verify you copied the correct anon key from Supabase
   - Check for extra spaces or characters

3. **"Row Level Security" errors**
   - Check that RLS policies are properly configured
   - Verify user authentication is working

4. **Database connection issues**
   - Check your project URL is correct
   - Verify your project is not paused (free tier limitation)

### Getting Help:

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Discord Community**: [discord.supabase.com](https://discord.supabase.com)
- **GitHub Issues**: Check the project repository for issues

## Next Steps

Once Supabase is set up:

1. **Update your Zustand store** to use Supabase instead of mock data
2. **Implement authentication** in your React app
3. **Add real-time subscriptions** for live updates
4. **Deploy to production** with Vercel or your preferred platform

---

**Need help?** Check the troubleshooting section or refer to the Supabase documentation.
