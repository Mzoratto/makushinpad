# 🔒 Security Guide - The Shin Shop

This document outlines the security measures implemented in The Shin Shop and provides guidelines for maintaining security.

## 🛡️ Security Measures Implemented

### **1. Environment Variables Security**
- ✅ **No hardcoded credentials** in source code
- ✅ **Separate environment files** for development/production
- ✅ **Template files** with placeholder values
- ✅ **Environment validation** on application startup

### **2. API Security**
- ✅ **Authorization checks** on all API endpoints
- ✅ **Input validation** for all user inputs
- ✅ **CORS restrictions** (production-only origins)
- ✅ **Rate limiting** considerations
- ✅ **Error handling** without information leakage

### **3. Database Security**
- ✅ **Row Level Security (RLS)** enabled
- ✅ **Proper access policies** for different user roles
- ✅ **Input sanitization** to prevent SQL injection
- ✅ **Audit logging** for sensitive operations
- ✅ **Data integrity constraints**

### **4. Race Condition Prevention**
- ✅ **Atomic cart operations** using database functions
- ✅ **Row-level locking** for critical operations
- ✅ **Transaction safety** for multi-step operations

### **5. Frontend Security**
- ✅ **Client-side validation** (with server-side backup)
- ✅ **Secure API communication** with proper headers
- ✅ **Error boundary handling**
- ✅ **XSS prevention** through React's built-in protection

## 🔧 Security Configuration

### **Environment Variables**

**Development (.env.development):**
```bash
GATSBY_SUPABASE_URL=https://your-project.supabase.co
GATSBY_SUPABASE_ANON_KEY=your_anon_key
GATSBY_DEBUG_MODE=true
```

**Production (.env.production):**
```bash
GATSBY_SUPABASE_URL=https://your-project.supabase.co
GATSBY_SUPABASE_ANON_KEY=your_anon_key
GATSBY_DEBUG_MODE=false
GATSBY_ENVIRONMENT=production
```

### **Supabase Security Settings**

1. **RLS Policies:**
   - Products: Only published products visible
   - Carts: Users can only access their own carts
   - Orders: Restricted to authenticated users

2. **API Keys:**
   - Use **anon key** for frontend
   - Use **service role key** only in Edge Functions
   - Never expose service role key to frontend

3. **CORS Configuration:**
   ```typescript
   const corsHeaders = {
     'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
       ? 'https://makushinpadshop.netlify.app' 
       : '*'
   }
   ```

## 🚨 Security Checklist

### **Before Deployment**
- [ ] Remove all hardcoded credentials
- [ ] Update CORS origins for production
- [ ] Enable RLS on all tables
- [ ] Test authentication flows
- [ ] Verify input validation
- [ ] Check error handling
- [ ] Review audit logs
- [ ] Test rate limiting

### **Production Monitoring**
- [ ] Monitor API usage patterns
- [ ] Review audit logs regularly
- [ ] Check for unusual database activity
- [ ] Monitor error rates
- [ ] Verify backup procedures

## 🔍 Security Testing

### **Manual Testing**
1. **Authentication:**
   - Test with invalid tokens
   - Test with expired tokens
   - Test without authorization headers

2. **Input Validation:**
   - Test with malformed data
   - Test with extremely large inputs
   - Test with special characters

3. **Race Conditions:**
   - Test concurrent cart additions
   - Test simultaneous inventory updates

### **Automated Testing**
```bash
# Run security tests
npm run test:security

# Check for vulnerabilities
npm audit

# Scan dependencies
npm run security:scan
```

## 🛠️ Security Maintenance

### **Regular Tasks**
- **Weekly:** Review audit logs
- **Monthly:** Update dependencies
- **Quarterly:** Security audit
- **Annually:** Penetration testing

### **Incident Response**
1. **Immediate:** Isolate affected systems
2. **Assessment:** Determine scope of breach
3. **Containment:** Stop ongoing attack
4. **Recovery:** Restore secure operations
5. **Lessons:** Update security measures

## 📋 Security Best Practices

### **Development**
- Never commit secrets to version control
- Use environment variables for all configuration
- Validate all inputs on both client and server
- Implement proper error handling
- Use HTTPS everywhere

### **Database**
- Enable RLS on all tables
- Use parameterized queries
- Implement proper access controls
- Regular backups with encryption
- Monitor for unusual activity

### **API**
- Authenticate all requests
- Validate all inputs
- Implement rate limiting
- Use CORS appropriately
- Log security events

## 🆘 Emergency Contacts

**Security Issues:**
- Email: security@shinshop.com
- Phone: +420-XXX-XXX-XXX (24/7)

**Supabase Support:**
- Dashboard: https://app.supabase.com
- Support: support@supabase.com

**Netlify Support:**
- Dashboard: https://app.netlify.com
- Support: support@netlify.com

---

## 📚 Additional Resources

- [Supabase Security Guide](https://supabase.com/docs/guides/auth)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [Gatsby Security](https://www.gatsbyjs.com/docs/how-to/security/)

**Remember: Security is an ongoing process, not a one-time setup!**
