# Deploy your personal website

This package contains the root Next.js website, portfolio JSON and public media. It needs a Next.js host such as Vercel; it is not a static HTML export. No database is required for the public portfolio. Existing optional API/admin code is included for later use.

## Free Vercel address
1. Extract this ZIP into a new folder.
2. Create a GitHub repository and upload the extracted contents. package.json must be at the repository root. Do not upload the ZIP itself or add .env.local.
3. Sign in at https://vercel.com and choose Add New > Project. Import that repository.
4. Select Next.js. Root Directory must be the repository root (./), not personal-website/. Keep automatic build/output settings (build: npm run build).
5. Deploy. Vercel supplies an HTTPS address ending in .vercel.app. No database, GitHub publishing token or AI key is needed to display the public portfolio.

Alternative from a terminal inside the extracted folder:
    npm ci
    npx vercel
    npx vercel --prod
Follow the sign-in and project prompts. Choose this folder as the root and Next.js as the framework.

## Your own .com
A .com is normally purchased and renewed separately; free hosting does not include ownership of a .com. Buy a domain from a registrar, then open your Vercel project > Settings > Domains, add the domain and www variant, and enter the exact DNS records Vercel shows in your registrar's DNS panel. Vercel enables HTTPS after verification.
Official guide: https://vercel.com/docs/domains/working-with-domains/add-a-domain

## Current limits
- Portfolio content comes from bundled data/ JSON and public/ media. Edit those files and redeploy for updates.
- Production admin is blocked if ADMIN_PASSWORD is unset. Set a private password in Vercel environment variables only if you want to access it.
- Production dashboard saves require GitHub publishing settings; they create a PR, which needs merge and deployment before content becomes public.
- Contact form delivery requires SMTP and any enabled Turnstile configuration. Email/LinkedIn links remain usable. Public launch does not verify email delivery.
- AI features require their own configuration. Database, saved drafts and revision history remain future work.
- Secrets, dependencies, build caches, the nested experiment and loose trial files are excluded from this package. .env.example contains blank/example configuration only.

## Existing Vercel project and .com.np connection
- Existing public address: https://shradaya-raj.vercel.app. Updates pushed to the connected repository's main branch trigger a production deployment; verify its result before assuming the update is live.
- The nameservers remain ns1.vercel-dns.com and ns2.vercel-dns.com when using Vercel DNS. Updating website content does not require changing them.
- Register shradayarajpoudel.com.np through register.com.np. Vercel hosting does not approve the .np registration.
- After approval, add shradayarajpoudel.com.np in the existing Vercel project's Settings > Domains and follow the exact verification/DNS instructions shown there. Verify HTTPS and the desired primary domain before setting SITE_URL=https://shradayarajpoudel.com.np and redeploying.
- Until configured, canonical/share URLs use Vercel's VERCEL_PROJECT_PRODUCTION_URL, with the existing vercel.app address as a fallback. No credentials belong in SITE_URL or this guide.

## Local preview
Install Node.js 22 LTS, then run npm ci, npm run build and npm start. Open http://localhost:3000.
