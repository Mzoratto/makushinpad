# 🚂 Railway CLI Deployment - Bypass Cache Issues

## 🚨 **Current Situation**

Railway dashboard deployment is still failing due to persistent cache issues with the non-existent `medusa-payment-mollie` package. Despite all fixes, Railway seems to be using a cached build.

## 🎯 **SOLUTION: Railway CLI Direct Deployment**

This bypasses Railway's dashboard caching and deploys directly from your local machine.

### **Step 1: Install Railway CLI**

```bash
# Install Railway CLI globally
npm install -g @railway/cli

# Verify installation
railway --version
```

### **Step 2: Deploy from medusa-backend Directory**

```bash
# Navigate to the backend directory
cd medusa-backend

# Login to Railway
railway login

# Initialize new Railway project
railway init

# Deploy directly
railway up
```

### **Step 3: Add PostgreSQL Database**

```bash
# Add PostgreSQL database to your project
railway add postgresql

# The database will be automatically linked
```

### **Step 4: Set Environment Variables**

```bash
# Set essential environment variables
railway variables set JWT_SECRET=your_super_secure_jwt_secret_32_chars
railway variables set COOKIE_SECRET=your_super_secure_cookie_secret_32_chars
railway variables set STORE_CORS=https://makushinpadshop.netlify.app
railway variables set NODE_ENV=production

# Optional: Mollie integration
railway variables set MOLLIE_API_KEY=test_your_mollie_test_key

# Optional: Email notifications
railway variables set EMAIL_PROVIDER=gmail
railway variables set GMAIL_USER=your-business-email@gmail.com
railway variables set GMAIL_APP_PASSWORD=your-gmail-app-password
railway variables set BUSINESS_EMAIL=your-business-email@gmail.com
```

### **Step 5: Run Database Migrations**

```bash
# Run Medusa migrations
railway run medusa migrations run

# Create admin user
railway run medusa user -e admin@yourstore.com -p your_secure_password

# Verify installation
railway run npm run verify
```

## 🎯 **Why Railway CLI Works Better**

### **Advantages:**
- ✅ **Bypasses Dashboard Cache** - No cached build issues
- ✅ **Direct Deployment** - Uses your local clean code
- ✅ **Real-time Logs** - See exactly what's happening
- ✅ **Better Control** - More deployment options
- ✅ **Fresh Environment** - No previous build artifacts

### **Expected Output:**
```
✅ Detected Node.js project
✅ Installing dependencies with npm ci
✅ Running postinstall verification
✅ All checks passed! Installation is clean and ready.
✅ Building with npm run build
✅ Starting with npm run start
✅ Server listening on port 9000
```

## 🔧 **Alternative: Create New Railway Project**

If CLI doesn't work, create a completely fresh Railway project:

### **Method 1: New Repository**

```bash
# Create separate repository with just backend
mkdir shin-shop-backend-only
cp -r medusa-backend/* shin-shop-backend-only/
cd shin-shop-backend-only

# Initialize new git repository
git init
git add .
git commit -m "Clean Medusa backend for Railway"

# Create new GitHub repository and push
# Then connect this new repo to Railway
```

### **Method 2: Railway from Scratch**

1. **Delete Current Railway Project** (backup environment variables first!)
2. **Create New Railway Project** from GitHub
3. **Select Repository** and set root directory to `medusa-backend`
4. **Fresh Deployment** with no cache issues

## 🚀 **Alternative Platforms**

If Railway continues to have issues:

### **Render.com (Recommended Alternative)**

```bash
# 1. Go to render.com
# 2. Connect GitHub repository
# 3. Create Web Service
# 4. Root Directory: medusa-backend
# 5. Build Command: npm run build
# 6. Start Command: npm run start
# 7. Add PostgreSQL database
# 8. Set environment variables
```

### **Heroku**

```bash
# Install Heroku CLI
npm install -g heroku

# Deploy from medusa-backend
cd medusa-backend
heroku create your-app-name
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set COOKIE_SECRET=your_secret
heroku config:set STORE_CORS=https://makushinpadshop.netlify.app

# Deploy
git init
git add .
git commit -m "Deploy to Heroku"
heroku git:remote -a your-app-name
git push heroku main
```

## 📋 **Success Checklist**

### **Railway CLI Deployment Success:**
- [ ] Railway CLI installed and logged in
- [ ] Deployed from medusa-backend directory
- [ ] PostgreSQL database added
- [ ] Environment variables set
- [ ] Migrations completed successfully
- [ ] Admin user created
- [ ] Verification script passes
- [ ] API endpoints responding

### **Verification Commands:**
```bash
# Check deployment status
railway status

# View logs
railway logs

# Test API endpoint
curl https://your-app.railway.app/health

# Test store API
curl https://your-app.railway.app/store/products
```

## 💡 **Pro Tips**

1. **Use Railway CLI** - More reliable than dashboard for problematic deployments
2. **Fresh Project** - Sometimes starting over is faster than debugging cache issues
3. **Alternative Platforms** - Render.com often handles Node.js better than Railway
4. **Local Testing** - Always test `npm ci && npm run build && npm run start` locally first

## 🎉 **Expected Result**

After successful CLI deployment:
- ✅ **Clean Build** - No cache issues
- ✅ **Working API** - All endpoints responding
- ✅ **Database Connected** - Migrations completed
- ✅ **Admin Panel** - Accessible and functional
- ✅ **Ready for Frontend** - Backend URL for Netlify

Your Shin Shop backend will finally be live! 🚂✨
