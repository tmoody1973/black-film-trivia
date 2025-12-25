# Clerk Setup Instructions

## Step 1: Sign up for Clerk
1. Go to [clerk.com/sign-up](https://clerk.com/sign-up)
2. Create a free account

## Step 2: Create a New Application
1. In the Clerk Dashboard, click "Create Application"
2. Name it: `Black Cultural Trivia`
3. Choose sign-in options:
   - ✅ Google (recommended)
   - ✅ Email/Password
   - Optional: GitHub, Apple, etc.

## Step 3: Create JWT Template for Convex
1. In Clerk Dashboard, navigate to **JWT Templates** page
2. Click "**New template**"
3. Select "**Convex**" from the template list
4. **IMPORTANT**: Do NOT rename the JWT token - it MUST be called `convex`
5. Copy the **Issuer URL** (Format: `https://verb-noun-00.clerk.accounts.dev`)
6. Keep this URL safe - you'll need it next

## Step 4: Get Your Clerk API Keys
1. In Clerk Dashboard, go to **API Keys** page
2. In the "Quick Copy" section, copy:
   - **Publishable Key** (starts with `pk_test_...`)
   - **Secret Key** (starts with `sk_test_...`)

## Step 5: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
CLERK_JWT_ISSUER_DOMAIN=https://your-domain.clerk.accounts.dev
```

## Step 6: Deploy Convex Configuration
Run this command to sync your auth configuration to Convex:

```bash
npx convex dev
```

## Step 7: Test the Setup
1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. You should see Clerk's sign-in UI
4. Try signing in with Google or email

## Production Setup (Later)

When deploying to production:

1. In Clerk Dashboard, get **production** keys:
   - Publishable Key will start with `pk_live_...`
   - Issuer URL will be `https://clerk.<your-domain>.com`

2. Add these to your Vercel environment variables:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   CLERK_JWT_ISSUER_DOMAIN=https://clerk.yourdomain.com
   ```

3. In Convex Dashboard, set production environment variables

4. Deploy: `npx convex deploy`

## Troubleshooting

If `useConvexAuth()` returns `isAuthenticated: false` after login:
1. Verify JWT template is named exactly `convex`
2. Check that `CLERK_JWT_ISSUER_DOMAIN` matches your Clerk Issuer URL
3. Run `npx convex dev` to sync configuration
4. Check Convex Dashboard logs for auth errors

## Next Steps

After Clerk is configured, you can:
- Access user info with `useUser()` from `@clerk/nextjs`
- Use `useConvexAuth()` from `convex/react` for auth state
- Access user identity in Convex functions with `ctx.auth.getUserIdentity()`
