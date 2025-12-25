# Vercel Deployment Guide

## Quick Deploy

Run this command to deploy to Vercel:

```bash
vercel --prod
```

## Environment Variables Setup

After deployment, you need to add these environment variables in the Vercel Dashboard:

### 1. Convex Variables
```
CONVEX_DEPLOYMENT=<your-convex-deployment>
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
```

Get these from your `.env.local` file or Convex Dashboard.

### 2. Clerk Variables  
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-publishable-key>
CLERK_SECRET_KEY=<your-secret-key>
CLERK_JWT_ISSUER_DOMAIN=<your-issuer-domain>
```

Get these from your Clerk Dashboard.

### 3. API Keys (Coming Soon)
```
PERPLEXITY_API_KEY=<your-perplexity-key>
GOOGLE_BOOKS_API_KEY=<your-google-books-key>
OMDB_API_KEY=<your-omdb-key>
```

## Steps to Deploy

### Option 1: Via CLI (Recommended)

1. **Login to Vercel** (if not already logged in):
   ```bash
   vercel login
   ```

2. **Deploy to production**:
   ```bash
   vercel --prod
   ```

3. **Set environment variables**:
   ```bash
   vercel env add NEXT_PUBLIC_CONVEX_URL production
   vercel env add CONVEX_DEPLOYMENT production
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
   vercel env add CLERK_SECRET_KEY production
   vercel env add CLERK_JWT_ISSUER_DOMAIN production
   ```

4. **Redeploy with env vars**:
   ```bash
   vercel --prod
   ```

### Option 2: Via Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Add environment variables in Project Settings > Environment Variables
5. Deploy

## Post-Deployment Steps

### 1. Update Clerk Redirect URLs

In your Clerk Dashboard, add your Vercel domain to allowed redirect URLs:
- `https://your-app.vercel.app`
- `https://your-app.vercel.app/api/auth/callback`

### 2. Set Production Clerk Keys

For production, you'll need to:
1. Get production keys from Clerk (they start with `pk_live_...` and `sk_live_...`)
2. Update environment variables in Vercel Dashboard
3. Update `CLERK_JWT_ISSUER_DOMAIN` to production domain

### 3. Configure Convex Production

1. In Convex Dashboard, switch to production deployment
2. Set `CLERK_JWT_ISSUER_DOMAIN` environment variable
3. Run `npx convex deploy` to deploy functions to production

### 4. Test the Deployment

1. Visit your Vercel URL
2. Test sign-in with Clerk
3. Verify landing page loads with animations
4. Check that all API calls work

## Continuous Deployment

Once set up, every push to `main` branch will automatically deploy to Vercel.

## Custom Domain (Optional)

1. In Vercel Dashboard, go to Project Settings > Domains
2. Add your custom domain
3. Update Clerk allowed domains
4. Update `CLERK_JWT_ISSUER_DOMAIN` if using custom domain

## Troubleshooting

### Build Fails
- Check build logs in Vercel Dashboard
- Verify all environment variables are set
- Make sure `npm run build` works locally

### Authentication Not Working
- Verify Clerk keys are correct in Vercel
- Check Clerk redirect URLs include Vercel domain
- Verify `CLERK_JWT_ISSUER_DOMAIN` matches Clerk dashboard

### Convex Connection Issues
- Verify `NEXT_PUBLIC_CONVEX_URL` is set
- Check Convex deployment is active
- Verify Convex has `CLERK_JWT_ISSUER_DOMAIN` set

## Monitoring

- **Vercel Analytics**: Automatically enabled
- **Error Tracking**: Check Vercel Dashboard > Logs
- **Performance**: Check Vercel Speed Insights

## Resources

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Convex Dashboard](https://dashboard.convex.dev)
- [Clerk Dashboard](https://dashboard.clerk.com)
