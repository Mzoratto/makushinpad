# 🚀 Supabase + Railway Deployment Guide

## 🎯 **Architecture Overview**

This guide shows you how to deploy your Shin Shop using the optimal combination:
- **Frontend**: Netlify (Gatsby.js)
- **Backend**: Railway (Medusa.js)
- **Database**: Supabase (PostgreSQL)

## ✅ **Why This Combination?**

- **Cost Effective**: Supabase free tier + Railway $5/month
- **Performance**: Dedicated Node.js server for Medusa.js
- **Reliability**: Managed PostgreSQL with automatic backups
- **Scalability**: Easy to scale both backend and database
- **Developer Experience**: Excellent tooling and monitoring

## 🗄️ **Step 1: Set up Supabase Database**

### **1.1 Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Choose organization and project name: `shin-shop-db`
5. Set database password (save this!)
6. Choose region closest to your users (Europe for Czech customers)

### **1.2 Get Database Connection Details**
1. Go to Project Settings → Database
2. Copy the connection string:
```bash
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### **1.3 Configure Database Access**
1. Go to Authentication → Settings
2. Disable RLS for Medusa tables (Medusa handles its own auth)
3. Note: We'll use direct database connection, not Supabase client

## 🚂 **Step 2: Deploy Backend to Railway**

### **2.1 Prepare Railway Deployment**
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `makushinpad` repository

### **2.2 Configure Railway Project**
1. **Root Directory**: Set to `medusa-backend`
2. **Build Command**: `npm run build`
3. **Start Command**: `npm run start`
4. **Port**: Railway auto-detects port 9000

### **2.3 Set Environment Variables in Railway**
```bash
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Security
JWT_SECRET=your_super_secure_jwt_secret_here
COOKIE_SECRET=your_super_secure_cookie_secret_here

# CORS (allow your frontend)
ADMIN_CORS=https://your-admin-domain.com
STORE_CORS=https://makushinpadshop.netlify.app

# Mollie Payment
MOLLIE_API_KEY=test_your_mollie_test_key  # Use live_ for production
MOLLIE_WEBHOOK_URL=https://your-app.railway.app/mollie/webhooks

# Email Configuration
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
BUSINESS_EMAIL=your-business-email@gmail.com

# Environment
NODE_ENV=production
PORT=9000
```

### **2.4 Deploy and Test Backend**
1. Railway will automatically deploy
2. Get your backend URL: `https://your-app.railway.app`
3. Test API: `https://your-app.railway.app/store/products`

## 🌐 **Step 3: Configure Frontend (Netlify)**

### **3.1 Update Netlify Environment Variables**
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add/Update:
```bash
GATSBY_MEDUSA_BACKEND_URL=https://your-app.railway.app
NODE_VERSION=20.x
NPM_VERSION=10.x
```

### **3.2 Trigger Deployment**
1. Push any change to main branch, or
2. Manually trigger deploy in Netlify dashboard

## 🗃️ **Step 4: Database Setup**

### **4.1 Run Medusa Migrations**
```bash
# Option 1: Via Railway CLI
railway login
railway link [your-project-id]
railway run medusa migrations run

# Option 2: Via Railway Dashboard
# Go to your Railway project → Deployments → Terminal
# Run: medusa migrations run
```

### **4.2 Create Admin User**
```bash
# In Railway terminal
medusa user -e admin@yourstore.com -p your_password

# Or via API call
curl -X POST https://your-app.railway.app/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@yourstore.com", "password": "your_password"}'
```

### **4.3 Seed Products (Optional)**
```bash
# In Railway terminal
npm run seed

# Or manually add products via admin panel
# Access: https://your-app.railway.app/app
```

## 💳 **Step 5: Payment Configuration**

### **5.1 Mollie Setup**
1. Go to [mollie.com](https://mollie.com) dashboard
2. Get your API keys:
   - **Test**: `test_...` (for testing)
   - **Live**: `live_...` (for production)
3. Set webhook URL: `https://your-app.railway.app/mollie/webhooks`

### **5.2 Update Railway Environment**
```bash
# For testing
MOLLIE_API_KEY=test_your_test_key

# For production
MOLLIE_API_KEY=live_your_live_key
```

## 📧 **Step 6: Email Configuration**

### **6.1 Gmail App Password Setup**
1. Go to Google Account settings
2. Enable 2-factor authentication
3. Generate App Password for "Mail"
4. Use this password (not your regular password)

### **6.2 Update Railway Environment**
```bash
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
BUSINESS_EMAIL=your-business-email@gmail.com
```

## 🧪 **Step 7: Testing & Verification**

### **7.1 Backend Health Check**
```bash
# Test API endpoints
curl https://your-app.railway.app/health
curl https://your-app.railway.app/store/products
```

### **7.2 Frontend Integration Test**
1. Visit: `https://makushinpadshop.netlify.app`
2. Check products load from Medusa API
3. Test add to cart functionality
4. Verify cart persistence

### **7.3 End-to-End Purchase Test**
1. Add product to cart
2. Go through checkout process
3. Use Mollie test card: `4242 4242 4242 4242`
4. Verify order appears in admin panel
5. Check email notification received

## 📊 **Monitoring & Maintenance**

### **Railway Monitoring**
- **Logs**: Railway Dashboard → Deployments → Logs
- **Metrics**: CPU, Memory, Network usage
- **Alerts**: Set up for downtime/errors

### **Supabase Monitoring**
- **Database**: Dashboard → Database → Statistics
- **Performance**: Query performance insights
- **Backups**: Automatic daily backups included

### **Netlify Monitoring**
- **Build Logs**: Deploys → Build logs
- **Analytics**: Site analytics and performance
- **Forms**: Contact form submissions

## 💰 **Cost Breakdown**

### **Monthly Costs:**
- **Supabase**: Free (up to 500MB database, 2GB bandwidth)
- **Railway**: $5/month (Hobby plan, 512MB RAM, 1GB disk)
- **Netlify**: Free (100GB bandwidth, 300 build minutes)
- **Total**: **$5/month**

### **Scaling Costs:**
- **Supabase Pro**: $25/month (8GB database, 50GB bandwidth)
- **Railway Pro**: $20/month (8GB RAM, 100GB disk)
- **Netlify Pro**: $19/month (1TB bandwidth, 25 sites)

## 🚨 **Troubleshooting**

### **Common Issues:**

#### **Database Connection Errors**
```bash
# Check DATABASE_URL format
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Verify Supabase project is active
# Check Railway logs for connection errors
```

#### **CORS Errors**
```bash
# Update STORE_CORS in Railway
STORE_CORS=https://makushinpadshop.netlify.app,http://localhost:8000
```

#### **Payment Webhook Issues**
```bash
# Verify webhook URL in Mollie dashboard
MOLLIE_WEBHOOK_URL=https://your-app.railway.app/mollie/webhooks

# Check Railway logs for webhook calls
```

## 🎯 **Success Checklist**

- [ ] Supabase database created and accessible
- [ ] Railway backend deployed and running
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Products seeded or added manually
- [ ] Netlify frontend updated with backend URL
- [ ] Mollie payment integration working
- [ ] Email notifications configured
- [ ] End-to-end purchase test successful

## 🚀 **Go Live Process**

1. **Switch to Live Mollie API key**
2. **Test with real payment method**
3. **Verify email notifications work**
4. **Monitor logs for any errors**
5. **Set up monitoring alerts**

Your Shin Shop is now live with enterprise-grade infrastructure! 🎉
