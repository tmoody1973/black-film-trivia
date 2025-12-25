import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // Clerk JWT issuer domain
      // In dev: https://verb-noun-00.clerk.accounts.dev
      // In prod: https://clerk.<your-domain>.com
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
