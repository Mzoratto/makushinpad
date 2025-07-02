# 🚂 Railway Complete Deployment Guide

## 🎯 **Why Railway is Perfect for Medusa.js**

- **✅ One-Click Medusa Deployment** - Built-in Medusa.js templates
- **✅ Managed PostgreSQL** - Automatic database provisioning
- **✅ Zero Configuration** - Automatic builds and deployments
- **✅ Built-in Monitoring** - Logs, metrics, and alerts
- **✅ Affordable Pricing** - $5/month for hobby projects
- **✅ Excellent Developer Experience** - CLI, dashboard, and GitHub integration

## 🚀 **Complete Railway Deployment (20 Minutes)**

### **Step 1: Prepare Your Repository (2 minutes)**

Ensure your `medusa-backend` folder is ready:

```bash
# Verify your medusa-backend structure
medusa-backend/
├── package.json
├── medusa-config.js
├── .env.example
├── src/
└── README.md
```

### **Step 2: Create Railway Account (2 minutes)**

1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your repositories
4. You'll get $5 free credit to start!

### **Step 3: Deploy Medusa Backend (5 minutes)**

#### **Option A: One-Click Medusa Template (RECOMMENDED)**
1. Go to Railway dashboard
2. Click "New Project"
3. Select "Deploy from Template"
4. Search for "Medusa" and select the official template
5. Connect your GitHub repository
6. Select the `medusa-backend` folder as root directory

#### **Option B: Deploy from GitHub Repository**
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your `makushinpad` repository
3. Railway will detect it's a Node.js project
4. Set **Root Directory**: `medusa-backend`
5. Railway auto-detects build/start commands

### **Step 4: Add PostgreSQL Database (1 minute)**

1. In your Railway project dashboard
2. Click "New" → "Database" → "Add PostgreSQL"
3. Railway automatically creates and connects the database
4. Database URL is automatically added to environment variables

### **Step 5: Configure Environment Variables (5 minutes)**

In Railway dashboard → Your Project → Variables tab:

```bash
# Database (Auto-configured by Railway)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Security Secrets (Generate strong random strings)
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
COOKIE_SECRET=your_super_secure_cookie_secret_minimum_32_characters

# CORS Configuration
ADMIN_CORS=https://your-admin-domain.com
STORE_CORS=https://makushinpadshop.netlify.app,http://localhost:8000

# Mollie Payment Integration
MOLLIE_API_KEY=test_your_mollie_test_key_here
MOLLIE_WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}/mollie/webhooks

# Email Configuration
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
BUSINESS_EMAIL=your-business-email@gmail.com
BUSINESS_CC_EMAIL=optional-cc-email@gmail.com

# Environment
NODE_ENV=production
PORT=9000

# Optional: Redis for scaling (Railway can add this later)
# REDIS_URL=${{Redis.REDIS_URL}}
```

### **Step 6: Deploy and Verify (5 minutes)**

1. **Automatic Deployment**: Railway deploys automatically after configuration
2. **Get Your Backend URL**: Copy from Railway dashboard (e.g., `https://medusa-production-xxxx.up.railway.app`)
3. **Test API Endpoint**: Visit `https://your-backend-url.railway.app/health`

## 🗄️ **Database Setup and Migrations**

### **Run Medusa Migrations**

#### **Option A: Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and connect to your project
railway login
railway link

# Run migrations
railway run medusa migrations run

# Create admin user
railway run medusa user -e admin@yourstore.com -p your_secure_password
```

#### **Option B: Railway Dashboard Terminal**
1. Go to Railway Dashboard → Your Project → Deployments
2. Click on latest deployment → "View Logs"
3. Open terminal and run:
```bash
medusa migrations run
medusa user -e admin@yourstore.com -p your_secure_password
```

### **Seed Initial Products (Optional)**
```bash
# If you have a seed script
railway run npm run seed

# Or manually add products via admin panel
# Access: https://your-backend-url.railway.app/app
```

## 🌐 **Frontend Configuration (Netlify)**

### **Update Netlify Environment Variables**

1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Update/Add:

```bash
# Replace with your Railway backend URL
GATSBY_MEDUSA_BACKEND_URL=https://your-backend-url.railway.app

# Ensure correct Node.js version
NODE_VERSION=20.x
NPM_VERSION=10.x
```

### **Trigger Frontend Deployment**
1. Push any change to trigger rebuild, or
2. Manually trigger deploy in Netlify dashboard
3. Verify frontend connects to Railway backend

## 💳 **Payment Integration (Mollie)**

### **Mollie Configuration**
1. Go to [mollie.com](https://mollie.com) dashboard
2. Get your API keys:
   - **Test**: `test_...` (for development/testing)
   - **Live**: `live_...` (for production)

### **Update Railway Environment**
```bash
# For testing
MOLLIE_API_KEY=test_your_test_key

# For production (when ready)
MOLLIE_API_KEY=live_your_live_key

# Webhook URL (Railway auto-generates domain)
MOLLIE_WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}/mollie/webhooks
```

### **Test Payment Flow**
1. Use Mollie test card: `4242 4242 4242 4242`
2. Complete checkout process
3. Verify order appears in Medusa admin
4. Check webhook logs in Railway

## 📧 **Email Notifications Setup**

### **Gmail App Password Setup**
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"
4. Use this 16-character password (not your regular password)

### **Update Railway Environment**
```bash
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop  # 16-character app password
BUSINESS_EMAIL=your-business-email@gmail.com
```

### **Test Email Notifications**
1. Complete a test order with customization
2. Check Railway logs for email sending
3. Verify email received in business inbox

## 📊 **Monitoring and Maintenance**

### **Railway Dashboard Features**
- **📈 Metrics**: CPU, Memory, Network usage
- **📋 Logs**: Real-time application logs
- **🔄 Deployments**: Deployment history and rollbacks
- **💾 Database**: PostgreSQL metrics and queries
- **⚙️ Settings**: Environment variables and configuration

### **Key Metrics to Monitor**
- **Response Time**: API endpoint performance
- **Database Connections**: PostgreSQL usage
- **Memory Usage**: Application memory consumption
- **Error Rate**: Failed requests and exceptions

### **Alerts Setup**
1. Railway Dashboard → Project Settings → Notifications
2. Set up alerts for:
   - High CPU usage (>80%)
   - High memory usage (>90%)
   - Application crashes
   - Database connection issues

## 💰 **Railway Pricing**

### **Hobby Plan: $5/month**
- **512MB RAM** - Perfect for small to medium stores
- **1GB Disk** - Sufficient for Medusa.js
- **PostgreSQL Database** - Included
- **Custom Domain** - Included
- **SSL Certificate** - Automatic

### **Pro Plan: $20/month** (When you scale)
- **8GB RAM** - High-traffic stores
- **100GB Disk** - Large product catalogs
- **Priority Support** - Faster response times
- **Advanced Metrics** - Detailed monitoring

## 🧪 **Testing Checklist**

### **Backend Health Check**
- [ ] API responds: `https://your-backend-url.railway.app/health`
- [ ] Products endpoint: `https://your-backend-url.railway.app/store/products`
- [ ] Admin panel accessible: `https://your-backend-url.railway.app/app`
- [ ] Database migrations completed
- [ ] Admin user created successfully

### **Frontend Integration**
- [ ] Products load from Railway backend
- [ ] Add to cart functionality works
- [ ] Cart persists across page reloads
- [ ] Checkout process initiates correctly

### **Payment Integration**
- [ ] Mollie test payments work
- [ ] Webhook receives payment confirmations
- [ ] Orders appear in admin panel
- [ ] Payment status updates correctly

### **Email Notifications**
- [ ] Custom orders trigger emails
- [ ] Email contains all order details
- [ ] Attachments work properly
- [ ] Business email receives notifications

## 🚨 **Troubleshooting**

### **Common Issues and Solutions**

#### **Database Connection Errors**
```bash
# Check DATABASE_URL in Railway variables
# Ensure PostgreSQL service is running
# Verify migrations completed successfully
```

#### **CORS Errors**
```bash
# Update STORE_CORS to include your frontend domain
STORE_CORS=https://makushinpadshop.netlify.app,http://localhost:8000
```

#### **Payment Webhook Issues**
```bash
# Verify webhook URL in Mollie dashboard
# Check Railway logs for incoming webhook calls
# Ensure MOLLIE_WEBHOOK_URL uses Railway domain
```

#### **Email Sending Failures**
```bash
# Verify Gmail App Password is correct
# Check GMAIL_USER email address
# Review Railway logs for email errors
```

## 🎯 **Go Live Checklist**

### **Pre-Launch**
- [ ] Switch Mollie to live API key
- [ ] Test with real payment method
- [ ] Verify email notifications work
- [ ] Check all environment variables
- [ ] Test complete purchase flow

### **Launch Day**
- [ ] Monitor Railway logs for errors
- [ ] Watch payment processing
- [ ] Verify email notifications
- [ ] Check website performance
- [ ] Monitor customer feedback

### **Post-Launch**
- [ ] Set up monitoring alerts
- [ ] Regular database backups
- [ ] Performance optimization
- [ ] Scale resources if needed

## 🎉 **Success! Your Shin Shop is Live**

Your complete e-commerce platform is now running on Railway:

- **🚂 Backend**: Medusa.js on Railway
- **🗄️ Database**: PostgreSQL on Railway  
- **🌐 Frontend**: Gatsby.js on Netlify
- **💳 Payments**: Mollie integration
- **📧 Notifications**: Gmail integration

**Total Monthly Cost**: ~$5-10 (Railway Hobby plan)

Ready to start selling custom shin pads! 🥅⚽

## 🚀 **Quick Reference Commands**

### **Railway CLI Commands**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Run commands on Railway
railway run medusa migrations run
railway run medusa user -e admin@email.com -p password
railway run npm run seed

# View logs
railway logs

# Open project dashboard
railway open
```

### **Important URLs**
- **Railway Dashboard**: https://railway.app/dashboard
- **Your Backend**: https://your-project.railway.app
- **Admin Panel**: https://your-project.railway.app/app
- **API Health**: https://your-project.railway.app/health
- **Frontend**: https://makushinpadshop.netlify.app

### **Environment Variables Quick Copy**
```bash
# Essential variables for Railway
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your_32_char_secret
COOKIE_SECRET=your_32_char_secret
STORE_CORS=https://makushinpadshop.netlify.app
MOLLIE_API_KEY=test_your_key
MOLLIE_WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}/mollie/webhooks
EMAIL_PROVIDER=gmail
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
BUSINESS_EMAIL=your-email@gmail.com
NODE_ENV=production
```

## 📞 **Need Help?**

- **Railway Docs**: https://docs.railway.app
- **Medusa Docs**: https://docs.medusajs.com
- **Railway Discord**: https://discord.gg/railway
- **Medusa Discord**: https://discord.gg/medusajs

Your Shin Shop is production-ready! 🎉
