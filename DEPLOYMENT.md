# HomeBeli Deployment Guide

This guide covers deploying HomeBeli to various platforms.

## Pre-Deployment Checklist

- [ ] All environment variables documented
- [ ] Database migrations tested
- [ ] RLS policies enabled and tested
- [ ] Storage bucket created and configured
- [ ] OAuth providers configured (if using)
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors
- [ ] Tests passing: `npm test`

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest option for Next.js apps.

#### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**
   
   Add these in Vercel dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_postgres_connection_string
   ```

4. **Update Supabase Settings**
   
   Add your Vercel domain to Supabase:
   - **Auth** → **URL Configuration** → Add your Vercel URL
   - **Auth** → **Redirect URLs** → Add:
     - `https://your-app.vercel.app/api/auth/callback`
     - `https://your-app.vercel.app/**` (wildcard)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Visit your app at `https://your-app.vercel.app`

#### Automatic Deployments

Vercel automatically redeploys when you push to your main branch.

### Option 2: Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Functions directory: `netlify/functions`

2. **Install Next.js Plugin**
   ```bash
   npm install -D @netlify/plugin-nextjs
   ```

3. **Create `netlify.toml`**
   ```toml
   [[plugins]]
   package = "@netlify/plugin-nextjs"
   ```

4. **Configure Environment Variables**
   Same as Vercel, add in Netlify dashboard

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Option 3: Docker

1. **Create `Dockerfile`**
   ```dockerfile
   FROM node:18-alpine AS deps
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npx prisma generate
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static

   EXPOSE 3000
   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Update `next.config.js`**
   ```js
   module.exports = {
     output: 'standalone',
     images: {
       remotePatterns: [
         {
           protocol: 'https',
           hostname: '*.supabase.co',
           pathname: '/storage/v1/object/public/**',
         },
       ],
     },
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t homebeli .
   docker run -p 3000:3000 --env-file .env homebeli
   ```

### Option 4: Railway

1. **Create `railway.json`**
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "restartPolicyType": "ON_FAILURE"
     }
   }
   ```

2. **Deploy**
   - Connect GitHub repository
   - Add environment variables
   - Deploy automatically

### Option 5: Self-Hosted (VPS)

For deployment on your own server:

1. **Server Requirements**
   - Node.js 18+
   - PM2 or similar process manager
   - Nginx (reverse proxy)
   - SSL certificate (Let's Encrypt)

2. **Build Application**
   ```bash
   npm ci
   npm run prisma:generate
   npm run build
   ```

3. **Start with PM2**
   ```bash
   pm2 start npm --name "homebeli" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```nginx
   server {
     listen 80;
     server_name yourdomain.com;

     location / {
       proxy_pass http://localhost:3000;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

5. **Set Up SSL**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

## Post-Deployment Steps

### 1. Test Core Functionality

- [ ] Sign up works
- [ ] Sign in works
- [ ] Create dish works
- [ ] Image upload works
- [ ] Drag and drop works
- [ ] Edit dish works
- [ ] Delete dish works
- [ ] Scores calculate correctly

### 2. Configure Custom Domain (Optional)

**Vercel:**
1. Go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Supabase:**
1. Add custom domain to allowed URLs
2. Update OAuth redirect URLs

### 3. Set Up Monitoring

**Vercel Analytics:**
- Enable in dashboard → Analytics

**Error Tracking (Sentry):**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com) (free)
- [Pingdom](https://www.pingdom.com)

### 4. Performance Optimization

**Enable Caching:**
- Add `Cache-Control` headers for static assets
- Use Vercel's Edge Network (automatic)

**Database:**
- Monitor slow queries in Supabase
- Add indexes if needed

**Images:**
- Already optimized with Next.js Image component
- Consider CDN for heavy traffic

## Environment-Specific Configuration

### Production vs Development

**Development:**
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
# Disable email confirmation
# Use test OAuth credentials
```

**Production:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://prod.supabase.co
# Enable email confirmation
# Use production OAuth credentials
# Enable error tracking
```

## Troubleshooting Deployment Issues

### Build Fails

**Error: "Cannot find module '@prisma/client'"**
```bash
# Add to build command
npm run prisma:generate && npm run build
```

**Error: "Module not found: Can't resolve '@/...'"**
- Check `tsconfig.json` paths configuration
- Ensure `baseUrl` is set correctly

### Runtime Errors

**Database Connection Issues:**
- Use connection pooling (Transaction mode for Prisma)
- Check DATABASE_URL uses pooler URL
- Verify IP allowlist in Supabase (allow 0.0.0.0/0 for serverless)

**Authentication Issues:**
- Ensure redirect URLs match your domain
- Check CORS settings in Supabase
- Verify environment variables are set

**Image Upload Fails:**
- Check storage bucket policies
- Verify public access is enabled
- Check file size limits

## Scaling Considerations

### Database
- Supabase free tier: 500MB, 2GB transfer
- Upgrade to Pro for more resources
- Consider read replicas for high traffic

### Storage
- Supabase free tier: 1GB
- Upgrade or use external CDN (Cloudflare Images, Cloudinary)

### Compute
- Vercel free tier: 100GB bandwidth
- Consider Pro for commercial use
- Monitor Edge Function usage

## Backup Strategy

### Database Backups
- Supabase automatically backs up (Pro plan)
- Manual export: Dashboard → Database → Backup

### Storage Backups
- Download bucket contents periodically
- Use `supabase-js` to sync to external storage

### Code Backups
- Use Git (GitHub, GitLab, Bitbucket)
- Tag releases: `git tag -a v1.0.0 -m "Release 1.0.0"`

## Rollback Plan

If something goes wrong:

1. **Vercel:** Rollback to previous deployment in dashboard
2. **Database:** Restore from backup in Supabase
3. **Code:** `git revert` or checkout previous tag

## Security Checklist

- [ ] Environment variables not in code
- [ ] RLS policies enabled
- [ ] HTTPS enforced
- [ ] CORS configured properly
- [ ] Rate limiting considered
- [ ] Input validation on all forms
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (React handles this)
- [ ] CSRF protection (Next.js handles this)

## Cost Estimates

### Free Tier (Development/Personal Use)
- **Hosting**: Vercel Free ($0)
- **Database**: Supabase Free ($0)
- **Domain**: Namecheap (~$10/year)
- **Total**: ~$10/year

### Production (Small Scale)
- **Hosting**: Vercel Pro ($20/month)
- **Database**: Supabase Pro ($25/month)
- **Domain**: (~$10/year)
- **Total**: ~$45/month + $10/year

### Production (Medium Scale)
- **Hosting**: Vercel Pro ($20/month)
- **Database**: Supabase Team ($599/month)
- **CDN**: Cloudflare Images ($5/month)
- **Monitoring**: Sentry ($29/month)
- **Total**: ~$653/month

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

**Happy deploying! 🚀**

