# 🚂 Railway Quick Start Checklist

## ⚡ **20-Minute Deployment Guide**

### **✅ Step 1: Railway Setup (5 minutes)**
1. Go to [railway.app](https://railway.app)
2. Login with GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory: `medusa-backend`

### **✅ Step 2: Add Database (1 minute)**
1. In Railway project: "New" → "Database" → "Add PostgreSQL"
2. Database automatically connects to your app

### **✅ Step 3: Environment Variables (5 minutes)**
Copy these into Railway → Variables:

```bash
# Auto-configured
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Generate strong secrets (32+ characters)
JWT_SECRET=your_super_secure_jwt_secret_here
COOKIE_SECRET=your_super_secure_cookie_secret_here

# Your domains
STORE_CORS=https://makushinpadshop.netlify.app
ADMIN_CORS=https://your-admin-domain.com

# Mollie payments
MOLLIE_API_KEY=test_your_mollie_test_key
MOLLIE_WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}/mollie/webhooks

# Email notifications
EMAIL_PROVIDER=gmail
GMAIL_USER=your-business-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
BUSINESS_EMAIL=your-business-email@gmail.com

# Environment
NODE_ENV=production
```

### **✅ Step 4: Database Setup (5 minutes)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and connect
railway login
railway link

# Run migrations
railway run medusa migrations run

# Create admin user
railway run medusa user -e admin@yourstore.com -p your_password
```

### **✅ Step 5: Update Frontend (2 minutes)**
In Netlify → Environment Variables:
```bash
GATSBY_MEDUSA_BACKEND_URL=https://your-project.railway.app
```

### **✅ Step 6: Test Everything (2 minutes)**
- [ ] Backend health: `https://your-project.railway.app/health`
- [ ] Admin panel: `https://your-project.railway.app/app`
- [ ] Frontend loads products from Railway
- [ ] Cart functionality works

## 🎯 **Essential URLs**
- **Railway Dashboard**: https://railway.app/dashboard
- **Your Backend**: https://your-project.railway.app
- **Admin Panel**: https://your-project.railway.app/app
- **Frontend**: https://makushinpadshop.netlify.app

## 💰 **Cost**
- **Railway Hobby**: $5/month
- **Includes**: 512MB RAM, 1GB disk, PostgreSQL database

## 🚨 **Common Issues**

### **CORS Errors**
```bash
# Add your frontend domain to STORE_CORS
STORE_CORS=https://makushinpadshop.netlify.app,http://localhost:8000
```

### **Database Connection**
```bash
# Verify DATABASE_URL is set to:
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### **Payment Webhooks**
```bash
# Ensure webhook URL uses Railway domain:
MOLLIE_WEBHOOK_URL=${{RAILWAY_PUBLIC_DOMAIN}}/mollie/webhooks
```

## 🎉 **Success Checklist**
- [ ] Railway backend deployed and running
- [ ] PostgreSQL database connected
- [ ] Migrations completed successfully
- [ ] Admin user created
- [ ] Frontend updated with Railway URL
- [ ] Products load from Medusa API
- [ ] Cart functionality works
- [ ] Checkout process initiates
- [ ] Payment integration configured
- [ ] Email notifications set up

## 📞 **Need Help?**
- **Full Guide**: See `docs/guides/RAILWAY_DEPLOYMENT.md`
- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway

Your Shin Shop is ready to launch! 🚀
