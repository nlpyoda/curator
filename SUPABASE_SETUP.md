# Supabase Database Setup for Production

## 🚀 Quick Setup Guide

### Step 1: Create Supabase Project
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign up/Sign in with GitHub
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `curator-app` 
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users
6. Click "Create new project"

### Step 2: Get Database Connection URL
1. In your Supabase dashboard, go to **Settings** > **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with the password you created

### Step 3: Update Environment Variables
1. Replace the DATABASE_URL in your `.env` file:
   ```bash
   # Replace localhost URL with Supabase URL
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```

2. For Netlify deployment, add the DATABASE_URL to your environment variables:
   - Go to Netlify dashboard > Site settings > Environment variables
   - Add: `DATABASE_URL` = `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Step 4: Deploy Schema and Data
Run these commands after updating the DATABASE_URL:

```bash
# Push schema to Supabase
npx prisma db push

# Migrate data to Supabase
node scripts/migrateMockData.js

# Verify connection
node scripts/testDbConnectivity.js
```

## 🔧 What This Enables

- **Production Database**: Cloud PostgreSQL accessible from deployed app
- **Automatic Scaling**: Supabase handles traffic spikes
- **Backup & Recovery**: Built-in database backups
- **Global CDN**: Fast database access worldwide
- **Free Tier**: 500MB database, 1GB bandwidth

## 🚦 Current Status

- ✅ Local database integration working
- ✅ Migration scripts ready
- ✅ AIProductService configured for cloud database
- ⏳ **NEEDED**: Supabase project creation and URL update

## 📝 Next Steps

1. Create Supabase project (5 minutes)
2. Update DATABASE_URL in `.env` and Netlify
3. Run migration script
4. Redeploy app

The app will automatically detect and use the cloud database once configured!