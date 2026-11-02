# Website project record

This is the ongoing record of project decisions, implementation, verification, and remaining work. Update it with every project change; do not rewrite historical entries to imply unfinished work was completed.

## Section directory

These links open the local website while its server is running at http://127.0.0.1:3000. Admin pages may require authentication when an admin password is configured.

| Public section | Link |
| --- | --- |
| Home | [Open Home](http://127.0.0.1:3000/) |
| Projects | [Open Projects](http://127.0.0.1:3000/projects) |
| Achievements | [Open Achievements](http://127.0.0.1:3000/achievements) |
| Extracurricular activities | [Open ECA](http://127.0.0.1:3000/eca) |
| About | [Open About](http://127.0.0.1:3000/about) |
| Contact | [Open Contact](http://127.0.0.1:3000/contact) |

| Admin section | Link and purpose |
| --- | --- |
| Dashboard | [Open dashboard](http://127.0.0.1:3000/admin) — overview and editor links |
| Home editor | [Edit Home](http://127.0.0.1:3000/admin/pages/home) — portrait, biography, tools, statistics, buttons and featured selection |
| About editor | [Edit About](http://127.0.0.1:3000/admin/pages/about) — biography paragraphs and skills |
| Contact editor | [Edit Contact](http://127.0.0.1:3000/admin/pages/contact) — image, contact details and LinkedIn |
| Content library | [Manage content](http://127.0.0.1:3000/admin/upload) — projects, achievements and ECA upload/edit controls |
| AI assistant | [Open AI assistant](http://127.0.0.1:3000/admin/ai) — optional site/item drafting and publishing review |

| Dedicated project page | Link |
| --- | --- |
| Utility Management System | [Open UMS](http://127.0.0.1:3000/projects/utility-management-system) |
| Airlift Kailas cleanup campaign | [Open Airlift](http://127.0.0.1:3000/projects/airlift-kailas-cleanup-campaign) |
| Deurali Basic School | [Open Deurali](http://127.0.0.1:3000/projects/deurali-basic-school) |
| Drone mapping | [Open Drone Mapping](http://127.0.0.1:3000/projects/drone-mapping) |
| GIS mapping | [Open GIS Mapping](http://127.0.0.1:3000/projects/gis-mapping) |
| LiDAR scanning | [Open LiDAR](http://127.0.0.1:3000/projects/lidar-scanning) |

Additional item details can be opened from their cards on Projects, Achievements and ECA. Media-library, revision-history and site-settings pages are planned and do not yet have routes.

Repository: [shradaya-raj/Shradaya_Raj](https://github.com/shradaya-raj/Shradaya_Raj). Local links do not confirm that a production deployment is available.

## Baseline — 9 October 2026

- The root Next.js 14 app is the active website. The nested personal-website directory is a separate experiment.
- Public pages: Home, Projects, Achievements, ECA, About, Contact, generic item details and six dedicated project case studies.
- Content: JSON records under data/projects, data/achievements, data/eca and data/site. Media lives under public.
- Admin: /admin/upload and /admin/ai, with local saves, AI assistance and GitHub PR publishing paths.
- Existing work in the checkout predates this record and is preserved. Git status already contained modified source files and untracked trial content.
- Local testing: seven main/admin pages, three APIs and 25 item detail routes returned HTTP 200; lint passed. Four contact-route TypeScript errors, missing images, wrong Home CTA, missing SMTP password and absent CAPTCHA keys were found. Email, uploads and AI publishing were not tested end to end.
- Detailed audit: DYNAMIC_WEBSITE_PLAN.md. The AI_INTEGRATION_PHASE2.md checklist is older and must be reconciled with implemented intake functionality.

## Agreed requirements

The owner must be able to edit routine content without code: text, media, links, repeating lists, list membership, ordering, visibility and featured placement. Forms must work without AI. Projects need editable content sections, charts and attachments. Removing a featured placement must not delete the project. Drafts, preview, publishing and restoration are planned. New kinds of features/layouts may still require development.

## Implementation sequence

1. Dashboard home and ordinary Home/About/Contact editors; editable repeating lists and featured selection.
2. Complete project editor and media management; stable URLs and consistent publishing/deletion.
3. Migrate dedicated case studies and eight UMS datasets to shared editable content blocks.
4. Navigation, metadata, page introductions, section visibility/order and automatic statistics.
5. Durable production storage if immediate publication is required; drafts, revisions, publication status and optional inquiries/analytics.

## Publishing decision

Until persistent production storage is chosen, extend the existing workflow: local edits write JSON; production edits create GitHub pull requests and publish after merge/deployment. Do not label a pending PR as already published. Immediate production publication is still an open architecture decision.

## Change log

### 2026-10-23 — Production page-save diagnostics

- Owner reported authenticated PUT /api/site/home returning 500. Existing page-save error concealed missing GitHub publishing configuration and invalid repository/token failures; font preload notice is unrelated to the save request.
- Added missing-setting checks returning 503 with variable names only. GitHub errors now distinguish invalid token, denied permissions/rate limit, inaccessible repo/base branch and branch/rule conflicts; upstream response bodies/credentials are not returned. Trimmed publishing configuration values.
- Production still requires the owner's GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO (and optional GITHUB_BASE_BRANCH) in Vercel. Code changes cannot supply those credentials. Actual remote configuration and failure reason are not yet confirmed.
- Verification: pending checks and deployment. The credential header included in the report must not be copied into records; advised the owner to replace the exposed admin password.
- Verification completed: production build/lint/TypeScript passed. Diagnostic checks exercised 401/403/404/422 classifications without network calls. A production-mode local PUT with missing GitHub settings returned 503 and named the missing keys, without writing content or opening a PR. Remote Vercel settings still require owner configuration.
- Vercel confirmed deployment success for 99a8aa8. Owner can retry to see the specific publishing error; real production credentials/publishing have not been validated. Deployment outcome recorded locally.

### 2026-10-23 — Animation responsiveness

- Found full Home rerenders on every mousemove, plus fresh random background positions each render. Replaced with isolated HeroGlow component using one pending animation-frame transform update, no React state per pointer movement, and disabled pointer tracking for coarse pointers/reduced-motion users.
- Made floating-shape positions deterministic and pause their animation outside the hero viewport. Removed Home's mounted-only blank render now that random positions no longer require it.
- Shortened Home reveals and About/Projects carousel travel/transitions; carousel timers skip hidden tabs, stop offscreen and disable auto-advance for reduced-motion users. Added a shared MotionConfig reduced-motion preference and CSS fallback for smooth scrolling/animated gradients.
- Verification: lint and TypeScript passed; production build and browser smoke checks pending. No measured FPS improvement is claimed; these changes remove identified rendering work and intentional long transitions.
- Final verification: production build passed. Production-mode browser checks confirmed Home rendered without captured console errors and the About Next project transition completed. Deployment pending; no device-specific FPS benchmark was performed.
- Vercel confirmed successful deployment of b6c74c2. Result recorded locally after deployment to avoid an extra documentation-only deployment.

### 2026-10-23 — Image loading and missing-asset repairs

- Reviewed the owner's browser log: several chunk requests failed, and image optimization returned 400 for missing images. Live checks now return 200 for the two cited shared JavaScript chunks. One sample optimized portrait was about 55KB versus the 663KB original; observed timings are single requests, not performance benchmarks.
- Added a real lightweight SVG fallback and replaced references to absent placeholder/drone/GIS/LiDAR files in records and page components. Generic fallback is explicitly labelled unavailable, rather than misrepresenting another project's photo.
- Added responsive image sizes to cards, featured carousel, About carousel and Home portrait so the browser need not request 1920px versions for small cards. Added a tiny SVG monogram favicon (Apple icon uses an existing portrait) and a manual Reload page files action to the error screen.
- Verification: production build including lint/TypeScript passed; static record/media scan found no missing referenced assets. Public deployment checks pending. Missing original project photos still need owner-provided replacements; this change prevents failed requests using a fallback. Chunk availability does not establish the cause of the earlier intermittent browser failures.
- Deployment verified: a0e94d7 succeeded on Vercel. Public favicon and SVG fallback return 200; /projects returns 200 and uses the new fallback without the missing JPG placeholder. /api/items/all remains protected (401). Result saved locally after deployment; use the stable shradaya-raj.vercel.app domain for the latest deployment.

### 2026-10-23 — Fresh deployment after Vercel settings correction

- Owner reported correcting Root Directory/build settings but the security-remediation Redeploy control remains disabled. Confirmed main still matches GitHub at c652ddf and the root package uses Next.js 15.5.27.
- Sending this documentation commit to trigger a fresh Git-integrated Production build with the saved Vercel settings rather than retrying an old deployment snapshot. Application source unchanged; prior build/test results still apply. Deployment result remains pending until checked.
- Verified result: commit 0356bc2 deployed successfully (Vercel Production deployment 7275469300 / dpl_FZ2PxyxUGfJqTJJ8vHveLr91gsAi). Public https://shradaya-raj.vercel.app/, /projects and /contact returned HTTP 200; /admin returned 401 without credentials. Deployment URL: https://shradaya-kdbmqbubp-shradaya-rajs-projects.vercel.app. This result entry is saved locally after deployment to avoid triggering an unnecessary second deployment.

### 2026-10-23 — GitHub sync and Vercel deployment check

- Compared local main with fetched origin/main: committed history matched at 4b93273, but the QA report and first remediation batch were not yet committed. Preparing them for the requested push; loose input files and preview screenshots remain local.
- GitHub reports the previous Production deployment failed. Vercel's automated security PR changes only the nested experiment, supporting the earlier wrong-root diagnosis. The root app remains the intended deployment target.
- Vercel project settings redirect to login in the available browser. Requested the owner sign in before inspecting/changing root directory. No deployment success or working production URL is claimed yet.
- Prior production build/regression checks passed for this remediation batch; no source changes since those checks except whitespace cleanup.
- Result: remediation commit ebc4347 pushed and verified on origin/main. Vercel automatically attempted Production deployment dpl_J7Q6WMLuiip13W6S8hDqPeHMVJvk and reported failure. Deployment settings/log inspection still requires Vercel sign-in; no new working production URL has been verified.

### 2026-10-23 — First QA remediation batch

- Upload edits preserve existing slugs, old media paths, attachments, rich body and unknown fields; category moves read the original category and reject destination collisions. New attachments append rather than replacing content; existing summaries are not regenerated during edits. Duplicate filenames are rejected to prevent overwrites.
- Added shared category/slug validation, required title/description/date and integer importance checks, aggregate upload limits and filename checks. Production upload fails clearly when GitHub publishing is unavailable. Item reads reject unknown categories.
- Production deletion now creates a GitHub PR; UI keeps the item visible until merge/deployment. Both local and production deletion retain media because moved items can share asset paths. Orphan-media cleanup remains a separate future operation.
- Fixed pdf-parse 2.x class usage and Node mammoth buffer handling. Legacy DOC is excluded from AI intake. Intake has aggregate file limits. Corrected media classification so absolute PDF/video paths are not treated as images.
- Added unsaved-change navigation/reload protection to page and upload editors; fixed Home CTA destination and closed mobile-menu accessibility state.
- Added tests/cms-regression.cjs. Disposable-record checks passed for stable URLs, append/preservation, category move, invalid fields/categories, duplicate attachments and deletion retaining media. Real local PDF and DOCX extraction passed without external AI calls. Existing portfolio content preserved.
- Browser unsaved-dialog automation was inconclusive because the automation click timed out and navigation completed before the dialog could be inspected; manual cancellation testing remains required. Final build result recorded below when complete.
- Final verification: production build, lint and TypeScript passed. Production-mode save/delete with missing GitHub configuration returned 503 and preserved the disposable record. Real PDF/DOCX extraction and the repeatable regression suite passed. Localhost restarted on port 3000. GitHub PR creation/merge was not exercised.
- Remaining: exact live preview/drafts/history, conflict protection, dedicated case-study migration, persistent instant publishing, remaining dependency review, metadata/assets and complete no-code controls. No GitHub push or real publishing PR created in this batch.

### 2026-10-18 — QA audit against agreed CMS requirements

- Added QA_REPORT_2026-10-18.md with reproducible defects, source-inspected risks, deployment limitations, unimplemented requirements and prioritized improvements.
- Lint, TypeScript and production build passed. Twelve public/admin pages, five content APIs and all 17 existing item detail URLs returned 200; nonexistent page returned 404.
- Production-mode authentication checks passed for admin/write routes using a disposable process-only password. No credentials are recorded. Confirmed local SMTP/Turnstile are not ready; no email or AI request sent.
- Disposable edit tests confirmed changing a title changes the slug, category moves lose media references, and blank title/description are accepted by upload API. Browser test confirmed unsaved heading disappears after switching admin pages. Production cache probe confirmed new detail record absent from prebuilt listing. Fixtures cleaned up; real portfolio content preserved.
- Additional findings include production filesystem deletion, broken PDF/DOCX intake integration, missing assets, wrong CTA, mixed hardcoded/detail data and incomplete schema enforcement. npm audit reported 20 flagged entries (15 high/five moderate); Next.js/PostCSS not flagged.
- This pass documents findings rather than changing application behavior. Next: content preservation/validation, document intake fixes and durable publishing, then draft protection and remaining no-code controls.

### 2026-10-14 — Next.js security upgrade in progress

- Replacing Next.js/eslint-config-next 14.1.0 with the latest published 15.5 release observed in npm, 15.5.27. React 18 remains within its declared peer range.
- Migrated server page/API route parameters to awaited promises; moved the client page editor into src/components/PageEditor.tsx behind a server wrapper. Removed the unavailable NextRequest.ip fallback; forwarded-header handling remains.
- Verification: dependency installation and build checks pending. Do not treat this entry as confirmation of a successful deployment.
- Security sources: Vercel May 2026 guidance requires upgrading 13/14 to supported lines. Next.js also announced an October 14 upstream security release; its published advisory/patch availability must be checked separately, and this update is not a guarantee against future advisories.
- Updated PostCSS to 8.5.30 with a dependency override after npm audit found a vulnerable bundled copy. Audit now reports neither Next.js nor PostCSS advisories; other unrelated dependency advisories remain outside this change.
- Next.js 15 route validation exposed a broken legacy DELETE handler at /api/upload that expected nonexistent category/slug URL parameters. It now returns 405 and directs callers to the existing /api/items/{category}/{slug} endpoint used by the dashboard.
- Verification: production build (including lint and TypeScript) passed. Homepage, Home editor, site/content APIs and a dynamic project detail returned HTTP 200 after restart. npm audit reports no Next.js/PostCSS advisory. Generated next-env.d.ts updated by Next.js. Localhost is running on the upgraded version.
- Publication: preparing security fix for GitHub; Vercel deployment must still complete using the root app. The nested experiment was intentionally not changed.

### 2026-10-14 — Admin updates and content removals prepared for GitHub

- Included the floating admin navigation and redesigned deletion dialog described below.
- Included eight project-record deletions and seven associated media-file deletions already made through the local admin. Preserved loose root input files and local preview screenshots outside the commit.
- Initial SSH fetch failed on DNS lookup; HTTPS API confirmed the repository was accessible and retrying SSH fetch succeeded.
- Verification: lint, TypeScript and staged whitespace checks passed. Prepared for origin/main; production deployment remains unverified.
- Push result: commit 33d6da3 successfully pushed to origin/main, including the UI updates and existing local content removals. Vercel deployment completion has not been checked.

### 2026-10-14 — Content deletion dialog and scroll stability

- Replaced browser confirm/alert prompts in src/app/admin/upload/page.tsx with a styled native dialog, item title, cancel/delete controls, pending state and inline failure feedback. Native modal behavior provides focus containment and Escape cancellation.
- Successful deletion updates only the affected list instead of replacing all lists with a loading screen. This prevents the page-height collapse that reset scroll position. Added inline success feedback; deleting the currently edited item clears its form.
- Verification: lint and TypeScript passed; browser confirmed the dialog shows the selected item and Keep content closes it. Saved admin-delete-preview.png. No existing portfolio content deleted during verification; successful deletion's scroll behavior has not been exercised against real content.
- Limitation: deleting near the page bottom can still require normal browser scroll clamping as the page becomes shorter. Production deletion persistence remains a separate planned improvement.

### 2026-10-14 — Shared floating admin navigation

- Added src/components/AdminNavigation.tsx and src/app/admin/layout.tsx: fixed gradient navigation matching the public site's style, shared across all admin routes, with active-page indicators and a collapsible small-screen menu.
- Navigation links directly to Dashboard, Home, About, Contact, Content library and AI assistant, plus the public website. Content library continues to manage Projects, Achievements and ECA together.
- Replaced dashboard editor tiles with content-count summaries and a content-library shortcut. Removed the separate public navigation bars from admin upload/AI screens; adjusted top spacing for the shared bar.
- Verification: lint and TypeScript checks passed. Browser checks confirmed the small-screen menu opens, About navigation works and closes the menu, and the shared navigation remains on the editor. At 1280px the full bar is visible, fixed, and fits without horizontal overflow. Saved admin-navigation-preview.png as a local preview.
- Next: continue image uploads and complete project editing; dedicated project/achievement editors remain planned.

### 2026-10-09 — Section links added

- Added the section directory to PROJECT_RECORD.md, covering six public sections, six dashboard/editor routes and six dedicated project pages.
- Verified the documented paths against the root app's page files; no application behavior changed.
- Next: continue the CMS implementation sequence below; keep this directory current when routes are added.

### 2026-10-09 — Planning and first implementation started

- Added DYNAMIC_WEBSITE_PLAN.md during the preceding audit.
- Added this record and repository instructions requiring future changes to update it.
- Next implementation: /admin overview, form-based page editing and controllable featured project membership/order/limit.
- Verification: pending; subsequent entry will record concrete results.

### 2026-10-09 — First dashboard editing milestone completed

- Added /admin overview (src/app/admin/page.tsx), with current content counts and links to page editors, content library and AI assistant.
- Added /admin/pages/[page] (src/app/admin/pages/[page]/page.tsx) for Home, About and Contact. All currently stored fields have ordinary form controls. Repeating lists support add, edit, remove and move up/down, including tools/categories, skills, biography paragraphs, specialties and statistics.
- Added proposed-value review, discard edits, save/error feedback and a browser refresh/close warning for unsaved edits. This is a content review, not an exact visual page preview or an autosaved draft.
- Added featured-project controls to the Home editor: automatic/manual selection, ordered membership, removal without deleting projects, and a display limit of 1–30. An empty manual list returns no featured projects. Home and Projects share the featured API; separate placement configuration is still future work.
- Added authenticated PUT handling to src/app/api/site/[page]/route.ts. Local saves write JSON using a temporary file and rename. Production saves create a GitHub PR with the existing helper and report pending publication honestly.
- Added src/lib/siteContent.ts for fixed content-shape validation, bounded text/list sizes, allowed link protocols, and featured selection validation. Public site/featured reads explicitly avoid static route caching.
- Updated src/app/api/featured/route.ts to honor manual selection order/limit, preserving the existing automatic newest-featured default when settings are absent. Existing content files were restored byte-for-byte after tests.
- Checks: lint passed. Dashboard and three editor routes returned HTTP 200. Invalid incomplete content and javascript links returned HTTP 400. API integration checks passed for manual order, limit, empty selection, persistence and preserved project-library counts.
- Browser checks: About editor loaded existing content; adding/reordering a skill appeared correctly in review; discard restored the original form. Home manual selection revealed project controls. Temporary browser edits were discarded.
- Type checking still reports only the four previously identified contact-route errors (missing nodemailer declarations and three optional-string errors). Production PR creation was not exercised; no PR/deployment was created.
- Limitations: image fields currently require existing paths; no page-level image uploader, exact visual preview, revision restore, section visibility or section ordering yet. Last saved page values replace the previous values; conflict detection and version history are still planned.
- Next: media upload/selection for page images, complete existing-project content/media editing, and shared content persistence with revision history; then dedicated case study migration and remaining list/visibility controls.

### 2026-10-09 — Selected image previews

- Updated src/app/admin/pages/[page]/page.tsx to display the selected Home portrait and Contact image beside their path fields. Previews update immediately when the path changes, without saving.
- Added loading, empty selection, invalid URL and missing-image feedback. Images fit within the preview without cropping. Remote http/https images can be previewed; production image hosting support still depends on the public site's image configuration.
- Verification: lint passed. Browser confirmed the existing Home portrait loaded, changing the field updated the preview source immediately, a missing path displayed the error message, and discard restored the original portrait. Temporary edits were not saved.
- Next: image upload/library selection remains planned; this change previews existing image paths and URLs.

### 2026-10-09 — GitHub synchronization started

- Confirmed configured repository shradaya-raj/Shradaya_Raj and main branch. Fetched origin; local HEAD matched origin/main before synchronization.
- Preparing current website source, portfolio content/media, CMS work and documentation for the requested push. Existing trial content within data/public is included; loose root test inputs, tmp-upload-test.txt and generated build caches are excluded.
- Fixed contact validation's TypeScript narrowing with an explicit success/error union and added nodemailer type declarations to remove the earlier build blockers. Ignored generated *.tsbuildinfo files.
- Verification: TypeScript, lint, staged whitespace check and production build passed. No environment-secret files are staged. Publishing prepared updates to origin/main; remote commit and CI will be checked after push.
- Push result: website commit 2a1a010 successfully pushed to origin/main and verified with git ls-remote. GitHub CI run 37917492610 started and was still running at verification time; deployment status is not confirmed. Local development server restarted at http://127.0.0.1:3000.
- The remaining untracked root trial files are preserved locally. No destructive cleanup or production configuration change was performed.

### 2026-10-29 — Deployable website package

- Added DEPLOYMENT_GUIDE.md with GitHub/Vercel and CLI deployment steps, free vercel.app address setup and custom-domain DNS guidance. Public portfolio uses bundled JSON/media; existing optional server/admin code remains included. This is a Next.js source package, not a static HTML export.
- Preparing releases/personal-website-2026-10-29.zip from an explicit source/config/content allowlist. Excludes credentials (.env.local), Git history, dependencies, build caches, nested experiment and loose trial files. Existing user work preserved.
- Checks: production build started; result pending. Archive entry inspection will verify required files and exclusions. No deployment, domain registration or production settings changed.
- Limitations: contact delivery and production CMS/AI require separate configuration; database/drafts/history remain planned. Next: deploy package to Vercel and optionally connect an owned domain; complete backend later.
- Final verification: production build including lint and TypeScript passed; 26 static pages generated. ZIP inspection found 183 entries, required package.json/guide present and zero excluded-path violations. Build used existing local environment; package intentionally excludes it. Fresh-host deployment and email/CMS integrations were not exercised.

### 2026-10-29 — Return-to-list controls on detail pages

- Added src/components/DetailBackLink.tsx and mounted it in src/app/layout.tsx. Project, achievement and ECA detail routes now show a fixed bottom-left arrow link labelled Back to Projects/Achievements/Activities. Styling follows the dark blue palette with keyboard focus and mobile safe-area spacing.
- Links use explicit parent-list destinations, so direct visits also return to the correct list. Applies to dedicated case studies and generic detail routes; list and admin routes do not display the control.
- Checks: lint and TypeScript passed. Local HTTP checks returned 200 for a dedicated project detail, achievement detail and both listing pages; expected back links present on detail pages and absent on listings.
- Limitations: no visual browser or device check performed; list filter/scroll restoration is not added. Existing downloadable ZIP predates this change. Next: review placement locally and refresh the deployment package when requested.

### 2026-10-29 — Back-link placement correction

- Moved the detail-page return link from bottom-left to bottom-right in src/components/DetailBackLink.tsx after the owner screenshot showed overlap with the Next.js local development indicator. Preserved mobile safe-area spacing and existing link behavior.
- Check: inspected the class change; no application logic changed. Visual confirmation remains with local refresh. No new tests needed for this placement-only adjustment.
- Limitations/next: downloaded deployment ZIP predates this adjustment; review local placement and refresh the package when needed.

### 2026-10-29 — Refined detail return control

- Restyled src/components/DetailBackLink.tsx as a compact rounded rectangle with a subtle slate surface/border, inset blue arrow tile, softer shadow and clear hover/focus states. Retains descriptive text, explicit list destinations, bottom-right positioning and mobile safe-area spacing.
- Checks: placement/style-only source review and whitespace validation; no routing changes. Visual browser verification pending owner review on localhost.
- Limitations/next: deployment ZIP is unchanged; review the revised control locally before regenerating a package.

### 2026-10-29 — Text-only return button

- Removed the arrow and icon tile from src/components/DetailBackLink.tsx at owner request. Centered the label with balanced horizontal padding, retaining the slate styling, hover/focus feedback and parent-list navigation.
- Checks: source review and git diff --check passed; visual confirmation pending local refresh. No behavior changes or additional tests required.
- Limitations/next: existing ZIP does not include these local UI refinements; regenerate before a future deployment.

### 2026-10-29 — Video-inspired color theme

- Reviewed sampled frames across the supplied 20.88-second screen recording. It presents three distinct palette examples; selected the first for the existing dark portfolio: jet black #0A0A0A, cerulean #007BA7 and neon rose #FF2D95. This is an adaptation, not a claim that all three examples use this palette.
- Updated tailwind.config.js with a shared cerulean shade scale and brand colors. Existing blue/purple utility classes now share the cerulean scale, keeping page/card highlights consistent. This shared utility mapping also affects admin styling; status and chart dataset colors remain unchanged.
- Updated globals.css background/scrollbar/ambient gradient, HeroGlow.tsx glow, Navigation.tsx neutral background, and Home hero shadows/primary CTA. Rose is reserved for the Home primary action, with black text and explicit keyboard focus. Body text remains light; lighter cerulean shades support readable highlights.
- Checks: lint and TypeScript passed. Local homepage rendered successfully and desktop browser screenshot review confirmed neutral navigation, cerulean accents and rose CTA. Whitespace check completed after cleanup.
- Limitations: no full production build, mobile visual review, exhaustive contrast audit or chart recoloring in this pass. Current downloadable ZIP predates these changes; no push/deployment performed. Next: owner review of localhost, then refresh deployment package when requested.

### 2026-10-29 — Professional geomatics palette

- Replaced the rejected neon palette with deep navy #0B1220, muted steel-blue highlights and soft teal #79B8AC primary action. Updated tailwind.config.js, globals.css, Home CTA/portrait treatment in src/app/page.tsx and HeroGlow.tsx. Removed rose tokens, reduced portrait/glow intensity and retained neutral light body text.
- Shared shade mappings carry the muted accents across existing public/admin components. Content, charts and navigation destinations are unchanged; no CMS scope additions.
- Checks: lint and TypeScript passed. Local desktop browser review confirmed navy surfaces, muted blue headings and teal CTA; whitespace check passed. Existing user work preserved.
- Limitations: no exhaustive page/mobile or contrast audit; ZIP remains an older snapshot. Next: owner review at localhost, then refresh package when needed.

### 2026-10-29 — Light forest-green theme preview

- Owner approved trying warm white, charcoal and forest green. Added PortfolioTheme.tsx and mounted it in layout.tsx to scope the light treatment to public routes. globals.css maps existing public surfaces/text/borders to light tones, with dark media overlays retained. Shared accent shades in tailwind.config.js now use forest green.
- Home uses a warm pale hero, white title panel, charcoal name and forest-green role/primary button. Adjusted About background, marked Projects/About media carousels, generic detail lightbox and dedicated case-study captions to retain light text over photography.
- Checks: lint, TypeScript and whitespace check passed. Local desktop screenshots reviewed for Home and Projects; warm surfaces, green primary action and dark text rendered. Existing content and backend behavior preserved.
- Limitations: this is a local visual theme preview; mobile, all dedicated layouts, chart internals and exhaustive contrast coverage are not yet audited. Admin keeps its existing dark surfaces with shared green accent scale. No production build/deployment or ZIP refresh performed.
- Next: owner review of the light direction; refine any remaining individual component contrast before packaging for publication.

### 2026-10-29 — Remembered public light/dark theme option

- Added ThemeToggle and theme context in src/components/PortfolioTheme.tsx; Navigation.tsx shows the switch on desktop and beside the mobile menu. It has an accessible pressed state, descriptive switch tooltip, visible keyboard focus and a minimum 44px touch target.
- Theme choice is stored locally, restored before paint through a small head script in layout.tsx, and synchronized across tabs. Without a saved choice, the agreed light theme remains default. If storage is blocked, the switch still works for the current page session.
- globals.css now scopes light/dark public styles by the document theme attribute. Dark palette uses charcoal #141414, raised #202020 surfaces, off-white #EDEDED text and mint #9BCBB2 accents. Keeps existing light forest palette and dark photography overlays; admin surfaces remain independently styled.
- Design research: https://vercel.com/geist/colors and https://www.carbondesignsystem.com/building-blocks/foundations/color/guidelines. Adapted their principles of neutral layers, contrasting text and themed accents; chosen hex values are an adaptation, not an official complete palette copied from either system.
- Checks: lint and TypeScript passed. Browser verified toggling, dark persistence across reload/navigation, and switching back to light at 390px width with no horizontal overflow. Desktop dark Home and mobile Achievements reviewed visually. Production build running; result pending.
- Limitations: no exhaustive contrast audit or all-page/device review; chart dataset colors unchanged. No deployment, publishing or ZIP refresh performed. Next: owner preview and package refresh when ready.
- Additional validation: calculated contrast ratios for selected solid color pairs: dark primary text/background 15.74:1, mint text/raised surface 8.98:1, dark primary button 8.84:1 and light primary button 9.72:1. These checks cover those pairs only, not every rendered element. Initial production build conflicted with the running dev server and failed on generated page entries; stopped dev server and reran build separately.
- Final production verification: isolated build passed, including lint/TypeScript and generation of 26 static pages. Restarted the local development preview on port 3000 after the build; final HTTP check pending.
- Localhost restart verified: Home returned HTTP 200 after development compilation. Public preview available again on http://localhost:3000.

### 2026-10-29 — Refined professional dark composition

- Replaced the public dark palette with ink blue #0C1623, slate surfaces #142234, light text #E8EEF5, muted text #ADBDCE and restrained teal #75C8C0. Reworked the dark block in globals.css with reusable surface/text/border/accent variables and consistent nav, card, badge, typography and button treatments.
- Added targeted styling hooks in src/app/page.tsx and HeroGlow.tsx. Dark mode hides portrait halo/pointer glow, straightens the hero panel, softens the portrait border and uses pale slate role text rather than accenting every line. Existing light styling and theme preference behavior retained.
- Checks: lint and TypeScript passed; whitespace check passed. Local desktop dark Home reviewed after fixing an overly broad badge selector so hover-only navigation styles no longer create default filled backgrounds. Saved professional-dark-preview.png outside the repository in the task visualizations folder.
- Limitations: no production rebuild for this style-focused pass; exhaustive responsive/contrast and dedicated-page review not performed. No changes to professional claims/content, backend, deployed site or downloadable ZIP. Next: owner review and package refresh when approved.

### 2026-10-29 — Cinematic light/dark transition

- Updated PortfolioTheme.tsx to use same-document View Transitions when supported: the incoming palette expands from the theme button center across the viewport. globals.css defines a 720ms eased circular reveal with a subtle initial blur, rather than moving page content.
- Added a 450ms color/border/background fallback, immediate switching for prefers-reduced-motion, prevention of overlapping clicks and transition/timer cleanup. Theme storage and light/dark styles remain intact. API reference: https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition.
- Checks: lint, TypeScript and whitespace check passed. Browser verified switching in both directions, active theme-unveil animation and theme-reveal class, button-derived reveal origin/radius, and class cleanup after completion. No captured browser warnings/errors during the check. Saved theme-transition-preview.png in the task visualizations folder outside the repository.
- Limitations: fallback and reduced-motion paths source-reviewed but not browser-emulated; no production build or full device matrix for this motion-only change. No deployment/ZIP refresh. Next: owner review of timing on localhost.

### 2026-10-29 — Theme transition performance simplification

- Owner reported lag during circular reveal. Replaced full-screen animated clip-path/blur with a 200ms opacity-only crossfade in globals.css. Removed reveal-origin/radius calculations and the per-element fallback color transitions from PortfolioTheme.tsx; unsupported browsers switch directly. Reduced-motion users still switch immediately.
- Retained transition cleanup, overlapping-click guard and stored preference. Shortened toggle icon motion to 150ms. This removes identified animation work; no measured FPS improvement is claimed.
- Checks: lint and TypeScript passed; browser confirmed theme-crossfade-in with 0.2s duration and switching both ways. Whitespace check passed. No production build/deployment or ZIP refresh.
- Limitations/next: browser snapshot capture still has a cost; if the owner's device continues to lag, use direct switching. Review responsiveness locally; no device-specific frame benchmark performed.

### 2026-10-29 — Lightweight portfolio interaction motion

- Added PortfolioMotion.tsx, mounted for public pages in PortfolioTheme.tsx, for one-time 320ms fade/10px entrances. IntersectionObserver unobserves revealed elements; a child-addition observer registers streamed content. No scroll handlers or animation-frame React updates. Content remains visible without JavaScript.
- ItemCard.tsx now has a short 3px hover lift and subtle 1.025 image zoom clipped within its image area. Projects/Achievements headings use the same entrance markers. Added animated desktop nav underlines and a small return-button hover lift via Navigation.tsx, DetailBackLink.tsx and globals.css. Existing Home entrances remain in place.
- Hover movement is limited to fine pointers with hover support; new animation and transitions opt out for reduced-motion users. Existing theme crossfade and themes retained.
- Checks: lint and TypeScript passed. Browser confirmed portfolio-enter on visible achievement cards, additional cards revealed on scroll (8 of 9 after scrolling) and transform-only card transition. Streamed-card registration was corrected during verification. Saved portfolio-motion-preview.png outside the repository in the task visualizations folder. Whitespace check passed.
- Limitations: no FPS benchmark, touch-device or reduced-motion browser emulation; guards verified in source. No production rebuild/deployment or ZIP refresh. Next: owner review of interactions locally.

### 2026-10-29 — Cinematic geomatics motion scene

- Replaced Home's five slow, faint Framer Motion circles (small travel over 20s) with CinematicBackdrop.tsx: visible drifting shapes, moving SVG terrain contours, an orbiting survey marker and pulsing location beacons. Deterministic code-native graphics use transform/opacity loops without animated blur or React updates each frame.
- Scene works in light/dark themes, pauses when outside the viewport or the tab is hidden, and includes a keyboard-accessible Pause/Resume control. Reduced-motion users see a static scene. Mobile uses a smaller orbit and lighter contour density.
- Updated page.tsx and globals.css for a brief primary-action highlight sweep and tools-card hover lift. Added a native scroll-timeline reading-progress line through PortfolioTheme.tsx, only in supporting browsers and outside reduced-motion mode. Generic ItemDetail header now uses the existing one-time reveal system.
- Checks: lint and TypeScript passed. Browser sampled different drift transforms, verified Pause sets animation-play-state to paused, Resume works and offscreen data-running becomes false. Reading progress scaled with scroll. Reviewed both themes on desktop and light Home at 390px with no horizontal overflow. Saved cinematic-hero-preview.png outside the repo in the task visualizations folder. Whitespace check passed.
- Limitations: no device FPS benchmark, background-tab emulation or reduced-motion browser emulation; related guards reviewed in source. No production build/deployment or ZIP refresh. Existing content and earlier user work preserved. Next: owner review of visible motion and device responsiveness locally.

### 2026-10-29 — Mapping, UAV, survey and reconstruction animation motifs

- Extended CinematicBackdrop.tsx with a recognizable quadcopter following a looping lawnmower coverage path and ground-control corner marks; a triangulated illustrative terrain mesh with building wireframe that tilts in perspective; and a total-station/tripod graphic with a pulsing control-network sightline.
- Added profile-specific captions and motion/layout rules in globals.css. Graphics sit around the hero edges; smaller displays reduce/clip decorative motifs and hide the survey instrument/captions to keep content clear. All motifs share existing Pause/Resume, offscreen/hidden-tab and reduced-motion behavior.
- Geometry is illustrative, not real survey data or project telemetry. Existing copy/content and theme controls preserved.
- Checks: lint and TypeScript passed; browser confirmed drone-coverage offset motion and terrain-turn animation, plus paused states on both motifs. Reviewed desktop light/dark views and checked 390px has no horizontal overflow. Saved mapping-profile-animation.png in task visualizations outside the repo. Whitespace check passed.
- Limitations: this is a lightweight SVG/CSS illustration, not an interactive WebGL/model viewer; no FPS benchmark, production rebuild, deployment or ZIP refresh. Next: owner review of profile-specific animation locally.

### 2026-10-29 — Expanded profile motifs and removed motion control

- Removed the Pause/Resume button and user-pause state from CinematicBackdrop.tsx at the owner's explicit request. Retained automatic suspension outside the viewport/hidden tabs and the reduced-motion static scene.
- Added illustrative GNSS satellite/positioning links, a 63-point LiDAR-style terrain cloud and a floating stack of GIS spatial layers. Added responsive positioning and transform/opacity animations in globals.css, removing unused motion-control styles. Smaller screens reduce/hide secondary motifs to protect profile readability.
- Checks: lint and TypeScript passed. Browser confirmed zero motion-control buttons and active satellite-drift, terrain-turn and map-stack-float animation names on wide desktop layout. Whitespace check passed. Existing content and prior user work preserved.
- Limitations: graphics remain illustrative rather than real positioning/model data; no FPS benchmark or production rebuild/deployment/ZIP refresh. Next: review expanded composition and device responsiveness locally.

### 2026-10-29 — Multi-satellite GNSS constellation detail

- Replaced the single GNSS satellite in CinematicBackdrop.tsx with six solar-panel satellites orbiting across three inclined elliptical planes. Different speeds/directions and phase offsets distribute the satellites around a latitude/longitude globe. Added orbital tracks, pulsing illustrative positioning links and a receiver marker.
- Added constellation layout/motion rules in globals.css; motion inherits offscreen/hidden-tab suspension and reduced-motion static rendering. Responsive scaling keeps the constellation beside the portrait. No pause button reintroduced.
- Checks: lint and TypeScript passed; browser confirmed six satellites, three planes and constellation-revolve animation. Offset distance changed from 20.3% to 75.0% across checks, confirming revolution. Desktop dark view reviewed; saved gnss-constellation-preview.png in task visualizations outside the repo. Whitespace check passed.
- Limitations: illustrative orbital geometry, not a scientifically accurate GNSS simulator; no real positioning data, new FPS benchmark, production build/deployment or package refresh. Next: owner review of constellation scale/detail locally.

### 2026-10-29 — Capture-to-reconstruction profile composition

- Added an illustrative 360-degree camera/panorama sweep, orthomosaic parcel grid with a moving scan line and a cartographic north indicator in CinematicBackdrop.tsx/globals.css. Increased the illustrative LiDAR cloud from 63 to 99 points while retaining deterministic geometry.
- Positioned details along the hero margins around the existing UAV, GNSS, survey, GIS and terrain motifs; secondary details are hidden below 1024px to preserve portrait/text focus. Existing automatic animation suspension/reduced-motion rules apply; no manual motion button added.
- Checks: lint and TypeScript passed. Browser confirmed panorama-sweep/orthomosaic-scan, 99 cloud points, no desktop horizontal overflow, and reviewed both themes. Saved geomatics-profile-composition.png outside the repo in task visualizations. Whitespace check passed.
- Limitations: all motifs remain decorative, not project data, processing status or a physical simulation. No new FPS benchmark, production build/deployment or ZIP refresh. Next: owner review of the complete profile composition locally.

### 2026-10-29 — Animation placement and highlighting correction

- Updated globals.css with separate scene-line and scene-label colors: stronger muted green instruments/deeper green labels in light mode, brighter teal instruments/blue-white labels in dark mode. Removed low group opacity from major desktop motifs so captions do not inherit excessive fading; softened backdrop circles/contours to establish hierarchy.
- Moved GNSS/panorama captions below navigation with minimum top clearances; aligned flight/terrain graphics and spaced the orthomosaic/LiDAR and GIS/survey groups vertically. Smaller desktop widths hide secondary parcel/GIS motifs; phone layouts keep low-opacity edge graphics and hide captions to protect text.
- Checks: CSS whitespace validation passed. Browser reviewed both themes at 1920x900 and dark mobile at 390x844; all desktop caption tops were 117px or lower, below the 64px nav. Confirmed mobile no horizontal overflow and secondary parcel/caption suppression. Saved highlighted-scene-placement.png outside the repo in task visualizations.
- Limitations: CSS-only pass, no new build/lint/TypeScript run; no exhaustive contrast audit or FPS benchmark. No deployment/ZIP refresh. Next: owner review of visibility and balance locally.

### 2026-10-29 — Organized top animation band

- Added a desktop layout band in globals.css for UAV/GNSS at 10%/30% and panorama/terrain at 70%/90%, framing the central portrait. Aligned four captions on one baseline, standardized their typography and reduced graphic envelopes. Added flight-graphic wrapper in CinematicBackdrop.tsx to scale the drone/path together without shrinking caption text.
- Kept side-rail GIS/survey/parcel/LiDAR details and existing smaller-screen layouts; reduced desktop contour prominence. Animation behavior and themes preserved.
- Checks: lint and TypeScript passed. Desktop browser at 1920x900 confirmed all four top captions at y=135px and reviewed the balanced dark composition. Saved aligned-profile-band.png outside the repository in task visualizations. Whitespace check passed.
- Limitations: no fresh full mobile matrix or production build for this scoped layout pass; no deployment/ZIP refresh. Next: owner review of the reorganized top section locally.

### 2026-10-29 — Clearer 3D reconstruction motif

- Rebuilt the terrain graphic in CinematicBackdrop.tsx as an isometric survey platform with a separate triangulated terrain patch and a distinct building model. Opaque shaded roof/front/side faces and finer facade lines replace the ambiguous intersecting wireframe.
- Added a subtle descending scan plane and pulsing survey node in globals.css; existing tilt, offscreen suspension and reduced-motion handling retained. Theme-specific face colors keep the building legible in light/dark modes.
- Checks: lint and TypeScript passed; desktop dark browser review confirmed distinct model faces and reconstruction-scan animation. Saved focused refined-3d-reconstruction.png outside the repo in task visualizations. Whitespace check passed.
- Limitations: illustrative SVG model, not an actual reconstruction or WebGL viewer. No new production build/deployment or ZIP refresh. Next: owner review of model clarity locally.

### 2026-10-29 — Mountain-valley reconstruction motif

- Replaced the building-and-terrain symbol in CinematicBackdrop.tsx with a cohesive isometric mountain-valley model. Deterministic 9x9 elevation grid produces 128 shaded triangular faces, raised ridges, layered base strata, a valley trace and highlighted survey nodes.
- Kept gentle perspective motion and the scanning plane, theme-aware colors and existing reduced-motion/offscreen suspension. globals.css adds the layered terrain-base treatment. Geometry is a stylized illustration, not real survey results.
- Checks: lint and TypeScript passed; browser confirmed 128 mesh faces and reconstruction-scan animation; focused dark preview inspected and saved as mountain-reconstruction.png outside the repository in task visualizations. Whitespace check passed.
- Limitations: SVG perspective illustration, not a true interactive 3D viewer; no production build/deployment or ZIP refresh. Next: owner review of the more recognizable terrain representation locally.

### 2026-10-29 — Recognizable orthomosaic and LiDAR details

- Replaced the sparse parcel grid in CinematicBackdrop.tsx with an illustrative mapped landscape: varied fields/parcel boundaries, road, building footprints, river, selected parcel, control vertices and map-corner marks. Theme-aware colors in globals.css distinguish surfaces while preserving scene harmony and the scan line.
- Replaced the generic point field with 263 deterministic projected points forming terrain, roof and two building walls. Contrasting roof points clarify the structure; added an animated scan-plane sweep and subtle base reference edges. Existing scene suspension/reduced-motion behavior applies.
- Checks: lint and TypeScript passed. Wide desktop dark browser review confirmed 263 points and lidar-sweep animation. Focused paired preview inspected and saved as orthomosaic-lidar-upgrade.png in task visualizations outside the repo. Whitespace check passed.
- Limitations: synthetic SVG illustrations, not real imagery, parcel records or LiDAR samples; no production rebuild/deployment or ZIP refresh. Next: owner review of the clearer paired graphics locally.

### 2026-10-29 — Paired graphic captions and placement

- Renamed the decorative caption to POINT CLOUD in CinematicBackdrop.tsx. globals.css centers the two detail captions with matching letter spacing, line height and a 12px gap before each graphic.
- Orthomosaic and point cloud now share one right-aligned column and equal viewport-height-aware widths on wide desktop layouts. The second graphic's position follows the first with a consistent gap, reducing crowding on shorter viewports. Existing narrow-screen suppression remains.
- Checks: source and whitespace review passed; browser placement validation pending below. Existing content and animations preserved.
- Limitations/next: no production rebuild or ZIP refresh for this local label/layout adjustment; review at localhost.
- Browser verification completed at 1920x900: both detail blocks share x=1657.8px and width=216px; orthomosaic ends at y=617.6px and point-cloud label starts at y=657.4px, leaving about 40px between blocks. Confirmed caption is POINT CLOUD. Saved aligned-parcel-pointcloud.png outside the repo in task visualizations.

### 2026-10-29 — Responsive and visitor-side audit

- Added QA_UI_2026-10-29.md covering measured layout issues, fixes, route checks, remaining content concerns and explicit verification limits.
- Fixed short-phone hero clipping: flexible height/nav clearance plus compact portrait/title/action spacing in page.tsx/globals.css. At 360x640 both CTA buttons now end within the first screen (~506/574px); previously portrait began behind the nav and the second action exceeded the hero. Hidden clipped decorative captions on tablets.
- Contact page now clears the nav, stacks details on phones, wraps/links email, labels inputs persistently, adds autocomplete and an accessible LinkedIn label, and uses a shorter entrance. Navigation mobile menu has a 44px target and correct Open/Close accessible name.
- Replaced mutation-based global reveals with hydrated React-owned PortfolioMotion wrappers and a shared IntersectionObserver in ItemCard/ItemDetail/Projects/Achievements. Fixed a reproduced streamed-markup hydration mismatch; fresh browser checks captured no errors and reveals remained active.
- Corrected Article Published/Trainings Attended labels in Home JSON and fallback, preserving all statistics values and content records. Trial content and unavailable-photo fallbacks are documented rather than deleted.
- Checks: responsive hero at seven dimensions, desktop light main pages, phone dark public/detail samples, mobile menu and back-link navigation, and contact label/bounds checks. All 23 main/current-record URLs returned HTTP 200. Lint, TypeScript and whitespace checks passed. Production build running; result to append.
- Limitations: no email sent, no full backend/admin workflow, actual-device FPS or exhaustive accessibility/contrast certification. No push/deployment or ZIP refresh. Remaining editorial issues include trial records, original media, metadata and manually maintained counts. Next: finish build, restore localhost and owner review of the audit report.
- Final verification: isolated production build passed with lint/TypeScript and 26 generated static pages. Development server restarted after the build; no simultaneous dev/build cache use. Final localhost availability check pending.
- Localhost restart check passed with HTTP 200. Restored dark preference after testing. QA_UI_2026-10-29.md records remaining content/configuration concerns without claiming full backend readiness.

### 2026-10-29 — Vertical side-caption alignment

- Verified the four top captions already shared a horizontal baseline, but UAV/Terrain centers differed from their lower side-rail labels. Updated globals.css so UAV/GIS/Survey share one column, and Terrain/Orthomosaic/Point Cloud share the other, with matching widths and centered caption styling. Kept the inner GNSS/panorama placement and small-screen behavior.
- Checks: browser at 1920x900 measured all left title centers at x=146px and all right title centers at x=1766px. Top UAV/Terrain captions retain y=135px. Desktop screenshot reviewed and saved as vertical-caption-alignment.png outside the repository. Whitespace validation passed; no logic/build tests needed for this CSS-only change.
- Limitations/next: no deployment or ZIP refresh; review local placement.

### 2026-10-29 — Shared side-title alignment

- Updated globals.css so UAV/GIS/Survey and Terrain/Orthomosaic/Point Cloud captions align to the starting edge of their respective side columns instead of centering each differently sized label. Retained top-row placement and consistent line height/letter spacing.
- Checks: CSS/source and whitespace review; local browser measurement pending. No application logic or content changes.
- Limitations/next: local-only styling change, no deployment or ZIP refresh; verify the shared caption edges at desktop width.
- Browser verification at 1920x900: UAV/GIS/Survey captions share x=38px; Terrain/Orthomosaic/Point Cloud captions share x=1658px, all left-aligned. Saved side-title-alignment.png in task visualizations outside the repository. Local preview restarted on port 3000.

### 2026-10-29 — Refined profile portrait styling

- Updated Home portrait markup in page.tsx and styling in globals.css: closer head/torso CSS crop, stable image positioning, fine double frame and four survey-style reference ticks. Removed the glow/large hover zoom and downward image shift; softened the entrance from half-size to 96% scale.
- Added theme-aware frame/shadow colors and responsive image sizes for the closer crop. Existing Home image-path/alt-text editing remains available; original image file unchanged.
- Checks: lint and TypeScript passed. Reviewed dark desktop and light 360x640 phone layouts; phone frame starts at about y=79 below the ~65px nav, no horizontal overflow, 640px hero remains intact. Saved refined-profile-portrait.png outside the repo in task visualizations. Whitespace check passed.
- Limitations: crop tuned to the current portrait, not an automatic face detector; no production build/deployment or ZIP refresh. Next: owner review of the crop and framing locally.

### 2026-10-29 — Removed north indicator

- Removed the decorative north SVG from CinematicBackdrop.tsx and its unused globals.css rules at owner request. Other hero graphics and layout retained.
- Checks: source search confirms no mapping-north references; whitespace check passed. No new tests needed for this decorative removal.
- Limitations/next: local change only; deployment package remains unchanged.

### 2026-10-29 — Professional photo edit and clean portrait presentation

- Used the built-in image_gen tool with an identity-preserve prompt to edit public/profile1.jpg into a studio-style chest-up headshot with neutral slate background and natural lighting. Saved non-destructively as public/profile-professional-2026.png; original photo retained. This is an AI-edited image; owner should review likeness.
- Updated Home's JSON and fallback image references, removed the decorative survey frame from page.tsx, and replaced the aggressive crop with simple portrait framing in globals.css. The dashboard's image-path/alt-text controls remain usable. Contact image was not changed.
- Added PROFILE_IMAGE_EDIT.md with the exact final prompt, source/output paths and built-in tool mode. Generated original also retained in Codex generated_images storage; the website asset resides in the workspace.
- Checks: generated image visually reviewed, lint and TypeScript passed, local browser confirmed the new asset loaded and clean Home presentation. Saved professional-headshot-on-site.png outside the repo in task visualizations. Whitespace check passed.
- Limitations: generative editing may introduce small likeness differences; no production build/deployment or ZIP refresh. Next: owner review of edited headshot on localhost.

### 2026-10-29 — Editorial portrait card presentation

- Replaced circular hero presentation with an upright softly rounded portrait card in page.tsx/globals.css. Added fine frame, restrained shadow, small accent rule and theme-specific materials; preserved the AI-edited photo itself.
- Desktop card is 176x208px; phone card is 116x140px. Existing photo editing controls and gentle entrance retained.
- Checks: lint and TypeScript passed; desktop light presentation reviewed, phone 360x640 measured no horizontal overflow, portrait top y=88px, last action bottom y=584px within the hero. Theme switch exercised. Saved editorial-portrait-card.png in task visualizations outside the repo; whitespace check passed.
- Limitations: local presentation update only, no production build/deployment or ZIP refresh. Next: owner review of the portrait-card direction.

### 2026-10-29 — Added delivery and response expertise

- Added Drone Delivery and Disaster Response to Home's highlights list in data/site/home.json and the page.tsx fallback. Routine list editing remains available in the Home editor.
- Each highlight now renders as an inline block so multiword specialties wrap as complete phrases rather than splitting within names.
- Checks: JSON parsed successfully and contains both new entries; whitespace check passed. No new tests required for this content/inline layout change.
- Limitations/next: local update only; no deployment or ZIP refresh. Review the expanded expertise line locally.

### 2026-10-29 — Resume-based Home biography expansion

- Expanded the Home intro in data/site/home.json and page.tsx fallback from the latest available Drone Pilot resume in Downloads, checked against the general resume. Included Airlift/Lalitpur/landfill mapping, assisted Manaslu delivery operations and flood-impact mapping, Galli Maps/360 capture, virtual tours, WebGIS, MeroEV and relevant training.
- Kept role wording specific: assisted the pilot, not an invented lead-pilot/license claim. Omitted inconsistent resume date ranges and did not add experience totals or unverified outcomes. No resume contact information copied into records.
- Updated Home rendering to split the existing editable paragraph string on blank lines, displaying three left-aligned paragraphs with readable line spacing. CMS shape and ordinary Home text editing retained; About page unchanged.
- Checks: JSON parsed as three paragraphs, lint and TypeScript passed. Browser confirmed the expanded text and paragraph spacing; saved expanded-resume-bio.png outside the repo in task visualizations. Whitespace check passed.
- Limitations: experience wording is based on the supplied/local resume, not independently verified; no production build/deployment or ZIP refresh. Next: owner review of biography accuracy and tone locally.

### 2026-10-29 — Concise Home bio

- Shortened the resume-based Home bio to one focused paragraph in data/site/home.json and page.tsx fallback, retaining core skills, Airlift/Manaslu experience, Galli Maps and WebGIS work. Existing editor and paragraph rendering retained.
- Checks: JSON parsing and source review; whitespace check passed. No new tests needed for this copy-only revision.
- Limitations/next: local content change only; no deployment/ZIP refresh. Owner can review the shorter introduction locally.

### 2026-10-29 — Added owner-provided flood-response delivery experience

- Updated the concise Home bio and page.tsx fallback with the owner's stated drone-delivery operations following the Rasuwa-Bhotekoshi flood in Nepal, operating DJI FlyCart 100 and FlyCart 30. Retained distinct assisted-pilot wording for the earlier Manaslu work.
- Checks: JSON parsed; both aircraft names and flood reference present; source/whitespace review passed. Copy-only change, no new tests required.
- Limitations: this additional experience comes directly from the owner, not the previously reviewed resume; no event date, delivery totals, license claims or independently verified outcomes added. No deployment/ZIP refresh. Next: owner review of wording locally.

### 2026-10-29 — Center-aligned Home biography

- Changed the Home biography wrapper in src/app/page.tsx from text-left to text-center at owner request; content and readable width unchanged.
- Checks: source review and whitespace check passed. No tests needed for this alignment-only adjustment.
- Limitations/next: local change only; deployment package unchanged. Review after refresh.

### 2026-10-29 — Added Drones gadget category

- Added a Drones category to the Home Gadgets & Software list in data/site/home.json and page.tsx fallback with the eight owner-provided models: DJI Neo 2, Mavic 3E, Matrice 4E, FlyCart 30, FlyCart 100, Phantom 4 RTK, Mini 4 Pro and Matrice 350. Standardized capitalization/spacing only; no technical specifications or ownership claims added.
- Existing categories retained; the new category/items remain editable in the Home dashboard.
- Checks: JSON parsed and category contains eight entries; whitespace check passed. No new tests required for this content-only update.
- Limitations/next: local change only; no deployment/ZIP refresh. Review new gadget card locally.

### 2026-10-29 — Drone-specific count badge

- Updated the Home gadget count badge in page.tsx to use drone/drones for the Drones category, producing 8 drones for its current entries. Other categories retain tool/tools; counts remain derived from editable lists.
- Checks: source review and whitespace check passed; no tests needed for this small display-text adjustment.
- Limitations/next: local change only, no deployment/ZIP refresh.

### 2026-10-29 — Added DJI Reality

- Added DJI Reality to Photogrammetry in Home JSON and page.tsx fallback; its derived count now shows five tools. Existing dashboard editing retained.
- Checks: JSON parsed successfully; whitespace check passed. Content-only update, no additional tests required.
- Limitations/next: local only; no deployment/ZIP refresh.

### 2026-10-29 — GIS tools list cleanup

- Removed uMap and OpenRoute Service from the Home GIS & Mapping category in JSON and page.tsx fallback at owner request. ArcGIS and QGIS remain; the count derives as two tools. Other references/content unchanged.
- Checks: JSON parsing and whitespace check passed. No tests needed for this content-only edit.
- Limitations/next: local only; no deployment/ZIP refresh.

### 2026-10-29 — Shortened Surveying drone label

- Changed Drones (Mavic 3E, Phantom 4 RTK) to Drones in the Home Surveying list and page.tsx fallback. Other Surveying entries and the dedicated Drones category retained.
- Checks: JSON parsing and whitespace check passed; no additional tests needed for this label-only edit.
- Limitations/next: local only; no deployment/ZIP refresh.

### 2026-10-29 — Added SW Maps to Surveying

- Added SW Maps to the Home Surveying list in data/site/home.json and page.tsx fallback. Its derived count now shows eight tools; dashboard list editing remains available.
- Checks: JSON parsing and whitespace check passed; no additional tests needed for this content-only edit.
- Limitations/next: local only; no deployment/ZIP refresh.

### 2026-10-29 — Professional portrait on Contact

- Updated Contact imageSrc/imageAlt in data/site/contact.json and the contact page fallback to use the existing professional headshot. Original photos retained; Contact editor remains the ordinary editing path.
- Checks: target asset exists, JSON parses and whitespace check passed. Existing layout retained; no additional tests needed for the asset-reference change.
- Limitations/next: local only; no deployment/ZIP refresh. Owner can review Contact after refresh.

### 2026-10-29 — Compact Contact form without nested scrolling

- Reduced Contact page/card spacing and heading size, placed name/email side by side on wider screens and combined email/location/LinkedIn into a compact footer in src/app/contact/page.tsx. Reduced portrait display height to balance the form. Inputs retain associated labels and responsive stacking.
- Kept all content in normal flow, without fixed card heights, clipped content or an internal form scrollbar. On phones the whole page scrolls naturally.
- Checks: lint and TypeScript passed. Browser measured 492px form card at 1440x900, 1366x768 and 1024x768 with no page or internal scrolling. At 360x640, page scrolls naturally with no nested card scrolling or horizontal overflow. Saved compact-contact-form.png outside the repo in task visualizations. Whitespace check passed.
- Limitations: email delivery not exercised; optional CAPTCHA can add height when configured. No deployment/ZIP refresh. Next: owner review of compact Contact layout locally.

### 2026-10-29 — Updated Contact location

- Changed Contact location to Kathmandu, Nepal in data/site/contact.json and the contact page fallback at owner request. Historical project and biography locations retained.
- Checks: JSON parsing and whitespace check passed. Content-only change; no additional tests needed.
- Limitations/next: local only; no deployment/ZIP refresh.

### 2026-10-29 — Equal Contact columns

- Changed the Contact grid to stretch its children and removed fixed desktop portrait heights in src/app/contact/page.tsx. The portrait now follows the form's natural row height, aligning both top/bottom edges without adding internal scrolling. Phone portrait retains its 260px stacked layout.
- Checks: source/whitespace review passed; browser height check pending. Kathmandu remains the configured location.
- Limitations/next: local layout change only; no deployment/ZIP refresh. Review equal columns after refresh.
- Browser verification completed: portrait and form both measure 492px high, with identical top y=142px and bottom y=634px. Contact displays Kathmandu, Nepal. Saved equal-contact-columns.png in task visualizations outside the repository.

### 2026-10-29 — Updated About biography from provided experience

- Replaced the three About paragraphs in data/site/about.json and About.tsx fallback with a concise profile covering Tribhuvan University, Kathmandu location, geospatial skills, Airlift/Manaslu experience, owner-provided Rasuwa-Bhotekoshi flood delivery operations using FlyCart 100/30, Galli Maps/360 work and WebGIS/tool experience.
- Kept assisted-pilot wording for Manaslu and did not add dates, licenses or outcomes not supplied. Existing skills list, paragraph editor and page layout retained.
- Checks: JSON parsed as three paragraphs with existing six skills preserved; location/delivery references present; whitespace check passed. Copy-only edit, no additional tests required.
- Limitations/next: experience is based on supplied resume and owner statements, not independently verified. Local only; no deployment/ZIP refresh. Review About after refresh.

### 2026-10-29 — Refined light-theme achievement cards

- Updated shared ItemCard tag styling and padding in src/app/components/ItemCard.tsx, with explicit theme colors in src/app/globals.css. Light cards now use subtle borders/shadows and pale sage tags with darker green text; dark tags retain a coordinated blue/teal palette. Projects and Activities share the same card treatment.
- Checks: lint and TypeScript passed. Browser confirmed light-theme tag colors and visually reviewed card spacing, borders and shadows; saved light-achievement-cards.png in task visualizations outside the repository.
- Limitations/next: local styling only; no deployment or ZIP refresh. Review the revised Achievements appearance locally.

### 2026-10-29 — Removed five unwanted project entries

- Removed the project JSON records for Drone Mapping Community Land Assessment Trial, Drone Metrics Chart Trial, 3D LiDAR Scanning, Drone Mapping and GIS Mapping System at the owner's request. Shared content loading removes them from Projects, featured selections and the Home carousel without hard-coded exclusions.
- Removed the three matching legacy static detail pages so deleted sample projects no longer have public detail pages. Other project content and media retained.
- Checks: pending content/API verification and lint. No deployment or ZIP refresh; remaining projects continue to be editable through the CMS.
- Verification completed: lint passed with no warnings/errors; localhost Projects returned successfully and none of the five removed project links/records appear in its response or the featured API. Remaining project JSON records parse successfully. Whitespace check passed.

### 2026-10-29 — Aligned Manaslu project hero image

- Updated the Airlift Kailas detail hero in src/app/projects/airlift-kailas-cleanup-campaign/page.tsx: removed the fixed desktop image height so photography stretches to the adjacent information panel's full height. The outer card handles rounded clipping, with a centered cover crop and responsive image sizes. Mobile retains its landscape aspect ratio; captions stay anchored to the photograph's bottom edge.
- Checks: lint and source whitespace verification pending. No content or image asset changes; local only, no deployment/ZIP refresh.
- Checks completed: lint passed without warnings/errors, whitespace check passed, and localhost detail page returned HTTP 200 with the new responsive image sizing. Visual review across devices remains available locally.

### 2026-10-29 — Renamed Airlift Kailas Manaslu project

- Renamed the project to Airlift Kailas Manaslu Cleanup Campaign in its editable JSON title/full text and the custom detail page heading, narrative, image alternative text and team caption. Existing URL/slug retained so links continue to work.
- Checks: JSON parses and title matches the requested name; source replacement and whitespace check completed. Text-only change; no additional tests needed.
- Limitations/next: local only, no deployment/ZIP refresh. Project lists and featured cards read the updated JSON title.

### 2026-10-29 — Readable featured-project text over bright photography

- Added a dark, high-opacity reading panel behind featured-project titles, descriptions and badges in src/components/Projects.tsx and explicit contrast colors in src/app/globals.css. Tags now have solid teal surfaces and pale text; responsive padding preserves room on phones. Shared Home/Projects carousel receives the fix in both themes.
- Checks: lint and whitespace verification pending. Image assets and project content retained. Local only; no deployment/ZIP refresh.
- Checks completed: lint passed with no warnings/errors and git diff --check passed. Browser visual verification of the revised panel remains for local review.

### 2026-10-29 — Balanced featured-project caption placement

- Based on the supplied screenshot, moved the featured carousel reading panel to the lower-left to expose the mountain peak and sky. Reduced panel padding, description size and vertical spacing in src/components/Projects.tsx; retained readable background and tags, with navigation dots underneath.
- Checks: source/whitespace review passed. Layout-only adjustment; no content or asset changes, no deployment/ZIP refresh. Next: local visual review of the revised balance.

### 2026-10-29 — Removed boxed featured-project caption

- Removed the black caption panel, its border and shadow from the shared featured carousel in src/components/Projects.tsx and src/app/globals.css. Added an edge-to-edge navy gradient that fades upward into the photograph, preserving the bottom caption's readability and open mountain view. Kept clear tag colors.
- Checks: whitespace check passed; styling-only change. Local only, no deployment/ZIP refresh. Next: owner review of the integrated photographic caption.

### 2026-10-29 — Source-based Unified WebGIS project expansion

- Reviewed the supplied 58-page Final documents/123.pdf report, 26-slide Developing Utility Management System presentation and four images in F:/Desktop Files July 23 2026/Project Report/Images. Rendered a report results page and visually inspected the image sources. Original source files remain unchanged.
- Updated data/projects/webgis-utility-management-system-unified-june-1-2024.json with editable context, fieldwork, metric numbering, documented architecture, survey results, team/supervisor credit and prototype limitations. Added five image attachments and three charts (structures, survey population, internet access); copied the field-collection form to public/images/UMS/field-collection-form.jpg. Existing portal, map and workflow assets reused. No household coordinate screenshot or raw survey database added.
- Kept report results (1,977 structures; 1,416 permanent; 6,586 surveyed people) distinct from older background/census figures. Removed unsupported MapTiler claims from this entry's tags; Python/Django/Flask/ReactJS/SQLite3 are documented. Did not infer the owner's individual responsibilities from group authorship or claim current deployment.
- Date limitation: report and presentation say April 2025, documented explicitly in the biography text. Existing June 2024 date/slug retained pending an actual project date; no exact completion day invented. The separate legacy /projects/utility-management-system page was preserved; the requested Unified entry uses the CMS-driven dynamic route.
- Checks: pending lint, TypeScript, asset and localhost route verification. Local only; no deployment or ZIP refresh. Next: owner review and confirmation of project date/individual role if desired.
- Checks completed: lint passed, localhost Unified project returned HTTP 200 with new text, all five attachment assets exist, and whitespace verification passed. TypeScript initially detected stale generated types for the sample routes removed earlier; removed only those obsolete .next generated page type files and TypeScript then passed. No production build or full browser rendering audit performed for this content update.

### 2026-10-29 — Interactive Unified WebGIS case study and project video

- Added src/components/WebGISCaseStudy.tsx and routed the requested Unified project through it in src/app/projects/[slug]/page.tsx. Uses the Manaslu-style split hero, bordered sections, reveal animation, section links, methodology diagrams, compact survey charts, gallery and full-size image viewer. Preserves the existing Projects return control and the separate legacy detail page.
- Content, paragraph/section order, tags, visuals, chart data and video link remain in the existing project JSON. Added a PROJECT VIDEO section containing the supplied LinkedIn URL and MY ROLE section based on the author's public post confirming backend/database responsibilities. No individual frontend responsibility inferred.
- HTTP tools could not access LinkedIn, but browser access succeeded and exposed the public video. Saved the supplied project video to public/images/UMS/project-demonstration.mp4 (14,816,956 bytes), referenced it through editable attachments and added a native controls player with poster, playsInline and preload=none. The original LinkedIn link remains available. No autoplay or full video preload.
- Added optional compact layout to DynamicVisualizations.tsx; other project charts retain their previous layout.
- Checks: lint and TypeScript passed. Browser verified heading/section navigation, image viewer open/close, and native video playback (287.4 seconds, readyState 4, playback advancing with no reported media error). Reviewed desktop hero/video appearance; saved webgis-project-video.png outside the repository. Whitespace check passed.
- Limitations: supplied video has no caption file; no transcript created. Current project date discrepancy remains documented from prior entry. No production build, deployment or ZIP refresh. Next: owner review; production media hosting may be moved later if needed.

### 2026-10-29 — Professional WebGIS colors and chart presentation

- Refined WebGIS case-study surfaces, borders and headings in src/app/globals.css with coordinated teal/steel colors for light and dark themes. Added a read-only theme hook in PortfolioTheme.tsx so canvas charts track the selected theme.
- Redesigned the compact chart presentation in DynamicVisualizations.tsx: doughnut charts with central totals, rounded bars, restrained gridlines, theme-aware axes/tooltips, aligned chart cards and visible value/percentage legends. Added canvas labels and textual values for reading without hover. Other noncompact chart layouts are preserved; project data remains in JSON.
- Checks: lint and TypeScript passed; browser visually reviewed both themes and verified matching totals/percentages (1,977 structures, 6,586 population, 1,416 household internet records). Saved webgis-charts-dark.png and webgis-charts-light.png outside the repository. Whitespace check passed.
- Limitations/next: no production build/deployment or ZIP refresh; no survey values changed. Next: owner review of the refreshed case study.

### 2026-10-29 — Made metric house numbering prominent

- Added an explicit House numbering (MHN) section link in WebGISCaseStudy.tsx, expanded the heading and moved the numbering workflow into its own section beside the existing MHN-sample.png map. Added that sample to the editable project's attachments; images remain clickable for full-size viewing. The general methodology section retains its own flowchart.
- Checks: sample image visually inspected; JSON parsed and source whitespace review passed. Local only, no deployment/ZIP refresh. Next: review the direct #metric-house-numbering section.

### 2026-10-29 — Added project poster from LinkedIn comment

- Located the poster in the owner's LinkedIn comment and compared its downloaded thumbnail with public/images/UMS/Poster for ums.png. They show the same poster; reused the existing 4032x2880 original for legibility instead of the 480px LinkedIn copy.
- Added the existing poster to editable project attachments and a dedicated Project poster section/navigation link in WebGISCaseStudy.tsx. Includes uncropped preview, full-size image viewer and original download link; excluded duplicate poster placement in the general gallery.
- Checks: lint and TypeScript passed; browser confirmed poster section, image load, download target and full-size viewer opening. Saved webgis-poster-section.png outside the repo. Whitespace check passed.
- Limitations/next: no deployment or ZIP refresh; source poster artwork/content unchanged. Next: owner review of the poster section.

### 2026-10-29 — Improved case-study paragraph space usage

- Removed the max-w-4xl paragraph cap in WebGISCaseStudy.tsx so chapter text uses the full available card width. Reduced chapter padding and heading-to-body gap while preserving responsive type and line height. Content remains unchanged and JSON-backed.
- Checks: source/whitespace verification passed; presentation-only change, no additional tests required. Local only; no deployment/ZIP refresh. Next: review paragraph wrapping locally.

### 2026-10-29 — Findings and natural project narrative

- Rewrote the Unified WebGIS description and fullText in data/projects/webgis-utility-management-system-unified-june-1-2024.json with clearer first-person/team language, the practical purpose, verified backend/database role, fieldwork tools, portal features and team credits. Preserved survey values, charts, links and attachments.
- Added KEY FINDINGS covering permanent-building coverage, internet access/exclusion, communal water supply and the demonstrated integrated workflow. Marked potential reach and future service improvements as interpretation or work still requiring measurement. Retained academic-prototype status and report recommendations; no deployment or impact claims invented.
- WebGISCaseStudy.tsx renders the findings as a readable list under What we found. All narrative remains in the editable project record.
- Checks: lint and TypeScript passed; localhost returned HTTP 200 containing the new findings heading; JSON parsed and whitespace check passed. Local only, no deployment/ZIP refresh. Next: owner review of the humanized copy.

### 2026-10-30 — Removed report-review wording from WebGIS narrative

- Replaced date-of-document commentary and third-person verification language in the Unified project JSON with straightforward first-person project context and practical next steps. Simplified the final workflow finding. Kept undergraduate-project status without claiming live municipal deployment; no figures, media or dates changed.
- Checks: JSON parsed and whitespace verification passed. Copy-only edit; no additional tests required. Local only, no deployment/ZIP refresh. Next: owner review of the revised wording.

### 2026-10-30 — Full WebGIS case-study language review

- Reviewed and rewrote every narrative section of the website's Unified WebGIS case study, including overview, personal role, fieldwork, numbering, portal implementation, results, findings, future work, team and visual descriptions. Removed report-review language, repeated conclusions and formal filler; used direct first-person/team wording supported by the supplied report and LinkedIn post.
- Simplified displayed section headings and gallery/poster/video introductions in WebGISCaseStudy.tsx. This edits the website case study, not the original academic PDF or presentation.
- Checks: update script asserted chart configurations, media references, date and slug were unchanged; JSON parsing and lint passed; whitespace check passed. No new factual or measured-impact claims added.
- Limitations/next: local only; no deployment/ZIP refresh. Existing project-date discrepancy remains separate from this language edit. Next: owner review of the complete revised case study.

### 2026-10-30 — Added project leadership role

- Updated the Unified WebGIS MY ROLE paragraph to state that the owner led the project alongside backend development and database management, based on the owner's explicit statement. Team credits and other content preserved.
- Checks: JSON parsed and whitespace check passed. Copy-only edit; no additional tests required. Local only, no deployment/ZIP refresh. Next: owner review.

### 2026-10-30 — Made poster download visible above the image

- Moved Download poster from below the tall poster preview to the section heading row in WebGISCaseStudy.tsx. Added a prominent filled button, download icon and readable PNG filename; it wraps above the preview on phones. Full-size viewing remains available below.
- Checks: original poster asset returned HTTP 200 as image/png; source/whitespace verification passed. No new download service needed for the same-origin asset. Local only, no deployment/ZIP refresh. Next: browser download verification.
- Browser verification completed: Download poster is visible beside the section heading. Clicking it downloaded WebGIS-Utility-Management-Project-Poster.png successfully to Downloads. Saved poster-download-button.png in task visualizations.

### 2026-10-30 — Removed poster from Unified WebGIS page

- Removed the poster section, navigation link, download/full-size controls and attachment reference from WebGISCaseStudy.tsx and the project JSON. Removed the poster mention in project visual copy. Original image file preserved; other images, charts and video unchanged.
- Checks: JSON parsed, source/whitespace check passed; localhost verification pending. Local only, no deployment/ZIP refresh. Next: review the page without the poster.

### 2026-10-30 — Kept poster; removed download button only

- Applied the owner's clarification: retained/restored the poster attachment, section, navigation link and full-size viewer. Removed only the Download poster anchor from WebGISCaseStudy.tsx. Other content preserved.
- Checks: JSON parsed; localhost verification confirms poster/full-size control present and download button absent; whitespace check passed. Local only, no deployment/ZIP refresh.

### 2026-10-30 — Reviewed chart color combinations

- Refined compact chart category palettes in DynamicVisualizations.tsx: structures retain teal/steel blue; population uses blue/amber; internet access uses teal/amber to distinguish the access gap. Light and dark palettes use appropriate brightness, matching legend markers and thin doughnut separators. Data values remain unchanged.
- Checks: lint and TypeScript passed; visually reviewed both themes in browser and saved chart-palette-refined.png outside the repo. Whitespace check passed. No formal color-vision simulation performed; visible labels and exact values provide cues beyond color.
- Limitations/next: local only; no deployment/ZIP refresh. Next: owner review.

### 2026-10-30 — Rasuwa flood-response blog draft

- Created drafts/rasuwa-flood-response.md as a first-person article based on the owner's six-page WFP operation log and explicit account of field/team management, direct WFP coordination, FlyCart 100/30 piloting, M4E preliminary mapping, and drone-speaker communication with villagers across the river.
- Added drafts/rasuwa-editorial-notes.md with source provenance, arithmetic and flight-count inconsistencies, and remaining factual/media review work. Excluded disputed totals, beneficiary counts, and unverified flood statistics. Original sources and pre-existing website work preserved.
- Checks: all six PDF pages extracted and visually inspected; daily cargo arithmetic independently recalculated. Markdown content review completed; whitespace verification recorded below. Content-only draft; no application tests required.
- Limitations: first-person reflections are editorial synthesis for owner review; deployment year/end date and media selection remain to be confirmed. Local draft only, no public route, publication, deployment, or ZIP refresh. Next: owner review and media selection before website integration.


### 2026-10-30 — Added personal experience and continuation to Rasuwa draft

- Updated drafts/rasuwa-flood-response.md with the owner-reported encounter with elderly villagers offering tearful namaste, gratitude for helping people going hungry, and reflections grounded in that account. Added 5,000 kg supplied by the team before his return to Kathmandu, arrangements for continuation, and another week of work by other team members.
- Removed the implied 22 September project end and clarified personal field participation versus the longer team operation. Updated drafts/rasuwa-editorial-notes.md to identify the 5,000 kg as a separate owner-reported milestone, not a total derived from the incomplete PDF or the final project total.
- Checks: reviewed narrative and source notes for consistent chronology, team attribution and milestone wording; whitespace check passed. Copy-only draft update; no application tests needed.
- Limitations/next: exact return/project end dates and media selection remain open. Local draft only; no publication, deployment or website route changes. Next: owner review and media selection.


### 2026-10-30 — Added Chilime visit, loss and coordinated response to Rasuwa draft

- Expanded drafts/rasuwa-flood-response.md with the owner's Chilime tunnel-area visit, access limitations on that route, destruction around Syafrubesi, reflection on nature and children losing parents, and credit to the wider government/security/humanitarian/private response.
- Added linked WFP coverage supporting its own first emergency cargo-drone deployment; used international attention rather than unverified universal praise or a Nepal-wide first. Updated drafts/rasuwa-editorial-notes.md with source and attribution boundaries.
- Checks: read primary WFP article, reviewed additions against owner account, and whitespace check passed. Copy-only draft update; no application tests required.
- Limitations/next: no individual child stories or casualty counts inferred; route/date and media review remain open. Local unpublished draft; next: owner review and media selection.


### 2026-10-30 — Added photographs to Rasuwa blog draft

- Visually reviewed all 11 supplied photos and added eight throughout drafts/rasuwa-flood-response.md, covering terrain, preparation, controller use, community context, supplies, response team and field portrait. Added visible-content captions and descriptive alt text; no unconfirmed location, model, identity or orphanhood inferred.
- Created optimized WebP copies in public/images/rasuwa and source/caption mapping in drafts/rasuwa-media-manifest.json. Updated editorial notes; original Downloads files and videos preserved.
- Checks: eight generated files reopened successfully, image links verified and whitespace check passed. Content/media-only draft; no application code or tests changed.
- Limitations/next: local Markdown uses absolute image paths; adapt to site-relative URLs at integration. No public route, publication, deployment or ZIP refresh. Videos not reviewed or embedded. Next: owner review and agreed website placement.


### 2026-10-30 — Integrated Rasuwa flood response into Projects

- Created data/projects/rasuwa-flood-response.json and src/components/RasuwaCaseStudy.tsx, connected via src/app/projects/[slug]/page.tsx. Existing Projects listing discovers the record automatically; other case studies and pre-existing changes preserved. Full-width narrative includes eight responsive, uncropped images with alt text, captions and original-image links.
- Added source-linked UN flood/access context and a concrete impact section covering owner-reported 5,000 kg supplied before his return, delivery access, speaker communication, diverse essential cargo and continuation by teammates. Preserved personal account; no invented beneficiary, lives-saved or long-term outcome metrics. Retained start-date semantics and nonfeatured placement.
- All routine story text, order, image references/captions and tags remain in editable project JSON. Updated Markdown source and editorial notes; no new publishing backend or change to production workflow.
- Checks: JSON parsed; all eight assets verified on disk and returned HTTP 200; local /projects returned 200 and contains the new project link; /projects/rasuwa-flood-response returned 200 with story, context and impact headings. Lint/TypeScript results recorded below.
- Limitations/next: no full browser visual audit or production build yet; videos remain excluded. Local website implementation only, no production publication, deployment or ZIP refresh. Next: owner review of case-study appearance and content.
- Checks completed: lint passed without warnings/errors; TypeScript passed; whitespace verification passed. Local listing, case-study route and all eight image assets returned HTTP 200.


### 2026-10-30 — Removed floating Rasuwa return button and deepened personal narrative

- Updated src/components/DetailBackLink.tsx to hide the floating Back to Projects control specifically on /projects/rasuwa-flood-response, matching the supplied screenshot. Existing in-article links and other detail-page return controls preserved.
- Revised the project JSON and Markdown draft with more personal language around elderly villagers' namaste, memories of grandparents, grief over the destruction and children losing parents, and mixed pride/sadness after the response. Reflections are editorial wording grounded in the owner's account; no new encounters, quotes, casualty claims, figures or media added.
- Checks: JSON parsing and narrative replacement assertions passed. Local route/button and whitespace checks recorded below. Focused presentation/copy change; no new tests required.
- Limitations/next: local only, no deployment or ZIP refresh. Next: owner review of the revised tone.
- Checks completed: local Rasuwa route returned HTTP 200; rendered HTML excludes the floating return control and contains the revised emotional passages; whitespace check passed.


### 2026-10-30 — Kept floating return button; removed duplicate article links

- Applied owner clarification in src/components/RasuwaCaseStudy.tsx: removed top and bottom return links and unused Link import; reduced heading spacing. Shared DetailBackLink already has the floating control enabled and was preserved.
- Story, emotional passages, photos and other project pages preserved.
- Checks: local Rasuwa route HTTP 200; exactly one floating return control with Back to Projects label rendered; source has no duplicate article Link controls; whitespace check passed. Small UI correction; no new tests required.
- Limitations/next: local only, no deployment or ZIP refresh. Next: owner review.


### 2026-10-30 — Identified WFP country director in Rasuwa photograph

- Updated the response-team-and-aircraft image caption/alt text in the Rasuwa project JSON, Markdown draft and media manifest to identify WFP's Country Director for Nepal, based on the owner's explicit identification. Added source note; no name inferred from the image.
- Checks: JSON parsed; local project HTTP 200 contains the updated caption; whitespace check passed. Copy-only change, no additional tests required.
- Limitations/next: local only; no deployment or ZIP refresh. Next: owner review.


### 2026-10-30 — Highlighted field photograph and added Rasuwa videos

- Added the specifically supplied portrait with cargo drone/helicopter as featured-field-operation.webp and the project's cover image. RasuwaCaseStudy.tsx presents it prominently above the story, uncropped, with a full-size link and highlighted frame.
- Added four original H.264 MP4 copies, generated WebP preview frames and editable attachment references in the project JSON. Dedicated From the field section near the top includes four native controls players, portrait proportions, playsInline, preload=none, no autoplay, and a header jump link. Videos cover river views, road access and aircraft preparation; no flight/location details inferred beyond visible content.
- Created drafts/rasuwa-video-manifest.json mapping originals to copied media and technical metadata. Original Downloads media preserved. Existing story/photos, country-director caption and floating return button retained.
- Checks: ffprobe verified all four video streams/durations; generated preview frames visually reviewed. Local route/media, lint and TypeScript verification recorded below.
- Limitations/next: no supplied captions/transcripts; preview-frame review is not full audiovisual review. No deployment or ZIP refresh. Next: owner review and playback check.
- Checks completed: lint and TypeScript passed; project HTML includes featured image/four players; featured photo, four MP4s and four posters returned HTTP 200; whitespace passed. Full decode succeeded for all four videos using 30fps test output. Original timestamp cadence produced duplicate-DTS warnings at the null test sink; original media preserved. Browser playback/visual audit not performed.


### 2026-10-30 — One video at a time and centered captions

- Added src/components/FieldVideo.tsx as a small client player: starting a video pauses other currently playing videos on the page without resetting their positions. RasuwaCaseStudy.tsx uses it for all four clips, keeping native controls, posters, playsInline and no autoplay/preload.
- Centered the featured photo caption, all inline story-photo captions, and video labels.
- Checks: browser started Road access, then River channel view; earlier video was paused at 6.87 seconds while new video played and other players remained paused. Computed browser styles confirmed all 13 photo/video captions centered. Lint/TypeScript results recorded below; whitespace check passed.
- Limitations/next: local only, no deployment or ZIP refresh. Next: owner review.
- Checks completed: lint and TypeScript passed; browser playback exclusivity and caption alignment checks passed; whitespace passed.


### 2026-10-30 — Matched Rasuwa presentation to Manaslu case study

- Reworked src/components/RasuwaCaseStudy.tsx with Manaslu's max-w-6xl container, split image/text hero, blue accents, rounded bordered gradient sections, inset borders, shadows, heading scale and paragraph spacing. Preserved uncropped portrait imagery and centered photo/video captions.
- Rendered existing Markdown headings as separate sections and extracted each section's existing photos/captions into responsive text-and-image columns. Story, source links, emotion, ordering and all eight inline images preserved; no new narrative facts added. Kept four native FieldVideo players, jump links and the single floating Back to Projects control.
- Added four editable hero facts in existing dataPointsRaw in the project JSON, including the owner's 5,000 kg milestone explicitly before his return. Hero date derives from item.date; content and image references remain in the CMS-backed record.
- Checks: browser desktop screenshot reviewed at 1280px; no horizontal overflow; all nine images and four videos present; all captions compute to centered. Parser check recovered all eight inline photo/caption pairs. Lint/TypeScript and whitespace results recorded below.
- Limitations/next: mobile visual audit and full production build not performed for this layout change; responsive columns stack below large breakpoint. Local only; no deployment or ZIP refresh. Next: owner review of matched design.
- Checks completed: lint and TypeScript passed; whitespace passed. Desktop visual/layout and media-preservation checks passed.


### 2026-10-30 — Simplified Rasuwa photo captions and corrected identity

- Removed the generic hero caption and six repetitive inline captions. Retained two concise contextual captions for the community photograph and WFP country-director photograph; video labels preserved.
- Updated community-photo alt text to identify the owner wearing the WFP vest, based on his explicit clarification. Synchronized project JSON, Markdown draft and media manifest.
- RasuwaCaseStudy.tsx now supports captionless Markdown photos and omits empty caption containers, preserving all image layouts/full-size links and editable optional captions.
- Checks: JSON parsing and replacement assertions passed; route/image preservation, lint/TypeScript and whitespace verification recorded below.
- Limitations/next: local only; no deployment or ZIP refresh. Next: owner review of simplified captions.
- Checks completed: lint and TypeScript passed; local route returned HTTP 200 with all nine photos, two photo captions and four video labels; outdated identity wording absent; whitespace passed.


### 2026-10-30 — Kept caption only on featured Rasuwa photo

- Applied owner clarification: added a centered featured-photo caption, "Leading field operations and piloting cargo drones in Rasuwa." Removed the two remaining inline photo captions from project JSON, Markdown draft and media manifest. Alt text and video labels preserved.
- Checks: local project HTTP 200; rendered HTML contains five captions total (one featured-photo caption and four video labels); whitespace check passed. Copy/layout-only change; no new tests required.
- Limitations/next: local only, no deployment or ZIP refresh. Next: owner review.


### 2026-10-30 — Featured Rasuwa and reverted latest caption change

- Set the Rasuwa project featured=true, preserving the selected featured-field-operation.webp cover. Shared featured selection can now include it.
- Undid the immediately preceding caption change: removed added hero caption and restored the two concise community/country-director captions. Synchronized Markdown draft and media manifest; owner identification and video labels preserved.
- Checks: JSON parsed; after development recompilation local page returned HTTP 200 with six captions (two photo captions, four video labels) and no hero caption; whitespace check passed. Reversible content/display change; no new tests needed.
- Limitations/next: local only; no deployment or ZIP refresh. Next: owner review of featured placement.


### 2026-10-30 — Tightened Rasuwa story and emphasized impact

- Reduced project Markdown from approximately 1,873 to 1,161 whitespace-delimited words (including media markup), removing repeated descriptions of role, communication, gratitude and continuation. Preserved operation timeline, flood/source links, personal emotions, team credit, all eight inline photo references/captions, cover and four videos. Synchronized retained Markdown draft; no new factual claims added.
- Elevated the existing impact section directly after the overview, presenting its four editable list items as responsive cards with a hero jump link. Retained the 5,000 kg milestone as the owner's team delivery total before his return, not the final project total or a reconciled PDF result.
- Improved mobile hero ordering so title/context precede portrait on phones while preserving desktop split layout. Limited portrait height on small screens. Existing video exclusivity, centered selective captions and sole floating return control preserved.
- Checks: browser screenshots reviewed at 390px and 360px; mobile impact cards stack and title precedes portrait; no horizontal overflow at 360/390/1280px. Desktop DOM confirms nine images, four video players, four impact cards, six captions and one floating return control. Local HTTP 200; impact section occurs once and precedes videos. Lint/TypeScript and whitespace results recorded below.
- Limitations: source delivery-log discrepancies remain unresolved; no independent final delivery log supplied, no new verification of 5,000 kg claimed. No production build or deployment/ZIP refresh. Next: owner review; reconcile final logs if available.
- Checks completed: lint and TypeScript passed; whitespace check passed. Mobile/desktop browser checks and local route/media-preservation assertions passed.


### 2026-10-30 — Filled overview space with field workflow

- Added a compact How we worked subsection below the overview paragraphs, using four cards for assessment, WFP/team coordination, speaker communication and cargo flights. Uses only previously supplied facts; no new impact figures or operational claims.
- Content is editable Markdown in the Rasuwa project JSON, synchronized to the draft. RasuwaCaseStudy.tsx presents the overview's numbered list as a responsive two-column card grid, stacking on narrow screens beside/below the existing photograph.
- Checks: JSON parsed; local HTTP 200 contains heading and all four steps; lint/TypeScript and whitespace results recorded below. Existing story/media and controls preserved.
- Limitations/next: local only, no deployment or ZIP refresh. Next: owner review of overview balance.
- Checks completed: lint and TypeScript passed; local route/content assertions and whitespace check passed.


### 2026-10-30 — Removed homepage featured-project loading delay

- Converted src/app/page.tsx to a server entry that reads project records and Home content concurrently, selects featured projects, and supplies compact card props to new src/components/HomePageClient.tsx. Preserved existing homepage content/design and interactive sections. The homepage no longer waits for hydration and /api/featured or /api/site/home requests to populate its content; project narratives/video metadata are excluded from homepage card props.
- Added shared selection helper src/lib/featuredProjects.ts and reused it in /api/featured to preserve automatic newest-first selection, manual ordering, configured limits and missing-slug handling. Kept force-dynamic homepage rendering to read CMS/file changes per request rather than introducing stale static content.
- Removed viewport reveal/stagger gating from homepage featured cards and made them proper Next links, so server-rendered cards and navigation are available immediately. Other homepage animations and shared Projects carousel behavior preserved.
- Checks: selection checks passed for automatic/manual ordering, missing records, limits, empty results and no source-array mutation. Local / and /api/featured HTTP 200; all three API-selected titles/links present in homepage HTML after script payloads removed. Browser confirmed matching three cards, each card and section opacity 1 before scrolling. Lint/TypeScript and whitespace results recorded below.
- Limitations/next: no production performance benchmark/build or deployment/ZIP refresh. Native images still load according to normal viewport/lazy-loading behavior; this fixes the client data/reveal waterfall, not a claimed production timing measurement. Next: owner review on homepage.
- Checks completed: lint and TypeScript passed after link conversion; whitespace passed. Initial-HTML, selection-parity and browser card-visibility checks passed.


### 2026-10-30 — Production-mode web performance audit

- Tested an isolated copy of the root Next.js app; production build, lint and TypeScript passed. Did not copy private environment files or alter the running development server. No application behavior, content or media changed during the audit.
- Added reports/performance-2026-10-30/PERFORMANCE_REPORT.md, summary.json, server-timings.json, ten Lighthouse JSON/HTML reports and three audit screenshots. Lighthouse 13.6.0 used sequential headless Chrome runs: Home desktop plus mobile Home, Projects, Rasuwa, Manaslu and WebGIS; repeated Home mobile twice, Rasuwa three times, WebGIS twice.
- Results: Home desktop 99; Home mobile 89/90; Projects mobile 89; Rasuwa mobile 78/97/71; Manaslu mobile 88; WebGIS mobile 68/68. All audits had zero console errors, no runtime errors/warnings and best-practices score 100. No meaningful CLS. Eight routes returned HTTP 200 with warm median local header response approximately 6–20 ms.
- Confirmed WebGIS video poster fetches original 1.26 MB PNG alongside optimized hero; global Font Awesome CSS blocks rendering; homepage hero text is mobile LCP; Rasuwa posters/nearby images add transfer while actual MP4s remain deferred. Findings and proposed improvements are documented, not implemented.
- Checks: validated ten report files and summary; whitespace check passed. Built/tested snapshot excludes private environment settings. Local lab scores are not live-site field measurements; Rasuwa's substantial variation is explicitly reported, not replaced with its best score. No concurrency/real-user INP testing, deployment or ZIP refresh.
- Next: optimize the WebGIS poster, remove/scope blocking icons, review above-the-fold reveal behavior, then rerun identical production audits and validate deployed performance separately.


### 2026-10-30 — Optimized initial render and deferred video posters

- Removed the unused global Font Awesome stylesheet from src/app/layout.tsx after searching source for dependent icon classes (none found). Existing SVG icons and theme styling preserved.
- HomePageClient.tsx renders hero text/portrait immediately, removing initial opacity/translation waits while keeping below-fold motion and hover feedback. Replaced nested button/link CTA markup with native styled Links; removed unused chart imports.
- Added DeferredVideo.tsx to attach video posters only within 300px of the viewport. FieldVideo.tsx retains native controls, preload=none and one-at-a-time playback using it. WebGISCaseStudy.tsx derives an optimized Next image poster from its existing editable cover rather than fetching the original 1.26 MB PNG on initial load.
- RasuwaCaseStudy.tsx no longer replays a reveal animation on the hero and supplies narrower responsive sizes for inline images. Content, original media, editable source records, captions, cover selection and featured placement preserved.
- Checks so far: lint/TypeScript passed; browser verified homepage hero opacity 1, no blocking icon stylesheet, no nested CTA buttons; Rasuwa posters absent before scroll and attached near players; switching videos pauses the earlier clip at its current position. Local production markup checks passed on Home, Projects, Rasuwa and WebGIS.
- Production rebuild first hit a transient Next worker module lookup error although the module exists; direct resolution check and an unchanged retry passed the complete production build. Testing uses an isolated copy without private environment files; development server preserved.
- Comparative Lighthouse tests in progress under reports/performance-2026-10-30/optimized. Final results and limitations follow below. No deployment or ZIP refresh.

- Final implementation also splits chart imports through next/dynamic in WebGISCaseStudy.tsx and generic ItemDetail.tsx. Final production build passed: shared project-route first-load JS reduced from 258 KB to 191 KB; generic achievement/activity detail routes from 254 KB to 187 KB. Reserved a 16:9 WebGIS player frame for deferred poster loading.
- Final Lighthouse comparisons saved to reports/performance-2026-10-30/optimized/OPTIMIZATION_REPORT.md and comparison.json with all intermediate/final raw reports retained. Home mobile final score 95, LCP 1.12 s (baseline 3.13–3.27 s); WebGIS final score 73, LCP 3.72 s (baseline 9.69–9.84 s), initial transfer 1,722 to 478 KiB (~72% lower); Rasuwa final score 77, LCP 1.59 s, initial transfer 759 to 431 KiB (~43% lower). Intermediate desktop Home scored 100.
- Score limitation: workstation RAM became critically low (~5 MB free at one check), contributing to variable blocking time and filesystem scan failures. Intermediate mobile scores, lower results and original Rasuwa variability are retained; final single runs are not claimed as sustained field scores. Original stylesheet/PNG/initial MP4 requests are absent in final network records; console errors and Lighthouse runtime errors/warnings are zero.
- Development recovery: stopped an accidentally started root build and restarted the existing root Next development service after requests timed out; Home, Rasuwa and WebGIS now return HTTP 200 on localhost:3000. Isolated test server stopped. Final build used one worker in the temporary copy only; root config/dependencies unchanged.
- Final browser verification: all three WebGIS chart canvases have nonzero geometry and exact-value labels; poster absent before scroll, optimized Next image poster attached near the video; player frame remains 16:9. The final frame-reservation CSS was verified in development after the measured production snapshot. Lint/TypeScript, production build and whitespace checks passed. No content/data edits, deployment or ZIP refresh.
- Next: owner review on local preview; measure deployed/physical-device performance separately and consider viewport-deferred chart initialization if further main-thread reductions are desired.


### 2026-10-30 — Fixed procedural SVG hydration mismatch

- Rounded computed SVG coordinates and opacity attributes to four decimal places in src/components/CinematicBackdrop.tsx. This removes full-precision Math.sin/Math.exp serialization differences between server and browser for terrain polygons, ridge/nodes and point-cloud coordinates. Visual geometry/animation and content preserved; no hydration-warning suppression added.
- Added tests/backdrop-hydration.cjs. It renders all 128 terrain faces and the point cloud with normal Math and simulated 1e-15 trigonometric/exponential drift, requiring byte-identical SVG markup and rounded opacity for the reported case.
- Checks: regression test passed; fresh homepage browser load has no error-level console logs and all 128 terrain faces render. Lint/TypeScript and whitespace results recorded below.
- Limitations/next: local only; no production rebuild, deployment or ZIP refresh for this targeted serialization fix. Next: owner refresh/review of the homepage.
- Checks completed: lint and TypeScript passed; SVG drift regression, fresh-browser console check and whitespace verification passed.


### 2026-10-30 — Added informative cards beside Rasuwa photographs

- Added editable Markdown subsections in five practical chapters of data/projects/rasuwa-flood-response.json: field responsibilities, communication/mapping/cargo tools, delivered-goods categories, coordination responsibilities, and continuation milestones. Synchronized the Markdown draft. Additions use existing owner/report facts; no new flight, impact, safety or delivery figures inferred.
- Extended RasuwaCaseStudy.tsx's compact list-card rendering from the overview to photo-bearing sections, supporting numbered and unnumbered lists with responsive columns. Emotional passages, original photographs/captions, featured cover, videos and playback behavior preserved.
- Checks: lint and TypeScript passed; browser screenshot reviewed for the communication section with four new cards filling the space beside the portrait. Desktop DOM confirms no horizontal overflow, nine images and four videos. Whitespace verification passed.
- Limitations/next: local only; no production build, deployment or ZIP refresh for this copy/layout change. Next: owner review of the additional context and balance.


### 2026-10-30 — Added early geospatial processing and rescue-support role

- Updated the Rasuwa project description, overview and impact list with the owner's explicit account of early drone mapping/data processing and delivery of orthomosaics, DSMs and 3D models supporting community rescue and relief distribution. Added an Early mapping for rescue and relief section with editable deliverable cards and Photogrammetry tag; synchronized Markdown draft/editorial notes.
- Kept unspecified early-response dates separate from the report's dated cargo timeline. No exact area, accuracy, software, beneficiary count or lives-saved claim invented. Existing media and owner-reported 5,000 kg milestone preserved.
- RasuwaCaseStudy.tsx styles the new deliverable list as existing compact informational cards; an odd final impact card spans both desktop columns.
- Checks: JSON parsed; local content, lint/TypeScript and whitespace results recorded below.
- Limitations/next: owner-reported mapping outputs have not been attached or independently audited. Local only, no deployment or ZIP refresh. Next: owner review; actual mapping previews may be added if provided.
- Checks completed: lint and TypeScript passed; local route returned HTTP 200 with new mapping/deliverable/impact sections and all nine photos/four videos retained; whitespace passed.


### 2026-10-30 — Added Banchare Danda landfill mapping project

- Reviewed the supplied 39-page Airlift landfill report and single-page grid/buffer maps; extracted source text and checked all pages for embedded links (none found). Visually reviewed the report's introduction/orthomosaic and full map layouts, plus extracted field-team photograph.
- Created data/projects/banchare-danda-landfill-mapping.json, src/components/MappingCaseStudy.tsx, and a branch in the existing dynamic Projects route. Uses the Manaslu/Rasuwa-style split hero, wider card layout, blue accents, responsive informational cards and full-size map links. Existing Projects listing discovers the new nonfeatured record automatically.
- Narrative covers owner-confirmed drone piloting, processing leadership, cadastral digitisation and presentation to Kathmandu Metropolitan City. Includes documented 4.9 km² coverage, three distance buffers, grid organisation and equipment. The 1 km buffer/3 cm per pixel are described as survey-brief targets, not measured accuracy. Date is year-only 2025 from the report; no exact completion day invented.
- Privacy: owner explicitly requested no parcel-ownership information be shared. Public assets are limited to the reviewed field photo and orthomosaic overview maps with distance rings/grid cells in public/images/banchare-danda. No source PDF, parcel table, parcel identifier or ownership data copied into the public page/assets. Original files unchanged in Downloads. Source handling recorded in drafts/banchare-danda-source-notes.md.
- 3D model link intentionally omitted at the owner's explicit request to provide it later. No fabricated URL or disabled placeholder added.
- Checks: JSON parsed; lint and TypeScript passed; /projects and new project route HTTP 200 with expected listing/role/buffer text; all three assets HTTP 200. Desktop and 390px mobile screenshots reviewed; no horizontal overflow, text-first mobile hero and three images confirmed; public page has no PDF links. Whitespace verification passed.
- Limitations/next: no production build/deployment or ZIP refresh. Source accuracy not independently audited; model URL pending owner provision. Next: owner review, then add the supplied 3D model link when available.


### 2026-10-30 — Added Bagmati Corridor / Hami Nepal flood-simulation project

- Reviewed all 17 report pages as extracted text and visually inspected study-area, methodology and simulation-output pages, plus the three supplied full-resolution maps. Owner explicitly confirmed handling all roles: coordination, drone piloting, imagery processing, HEC-RAS modelling and GIS/exposure analysis.
- Created data/projects/bagmati-corridor-flood-simulation.json and routed it through the shared MappingCaseStudy.tsx presentation. New project appears automatically in Projects with June 2026 month precision, split hero, role/workflow cards, three full-size map links and the supplied 25.47-second native simulation video. Added landscape-map layout and conditional deferred video support to the shared template; landfill project remains valid.
- Generated optimized WebP map copies and a small video poster in public/images/bagmati-flood-simulation; copied original H.264/AAC MP4. Source report/PNGs/video remain unchanged. Public PDF not added. Report's embedded Drive-folder link was not exposed as an unreviewed external destination.
- Clearly distinguished exploratory/demo-discharge scenario results from validated forecasting, full corridor modelling from selected drone coverage, and approximate building exposure (Makalbari 1,541; Tinkune–Dhobighat 1,770) from actual damage/people counts. No unique combined total, return period or measured model accuracy invented. DHM collaboration remains future work.
- Source and interpretation details recorded in drafts/bagmati-source-notes.md. No changes to earlier landfill privacy handling or pending 3D link.
- Checks: lint/TypeScript passed; listing, new project, existing landfill route and all five new media assets returned HTTP 200. Full MP4 decode passed. Browser reviewed desktop hero, confirmed native playback advancing to 17.4/25.47 seconds with no media error, four rendered images (cover plus three map sections), and no horizontal overflow at 1280/390px. Mobile hero text precedes cover. Whitespace check passed.
- Limitations/next: supplied video has no captions/transcript; model uses report-stated demo discharge and uncalibrated assumptions. No production build/deployment or ZIP refresh for this addition. Next: owner review and possible future model-data improvements.


### 2026-10-30 — Added APF presentation and map/model training

- Updated the Bagmati project JSON with an owner-confirmed role item and dedicated section describing presentation to the APF disaster rescue team and training on maps and 3D models. Added provenance to drafts/bagmati-source-notes.md.
- No attendee count, training date, certification or measured operational outcome invented. Existing scenario limitations, maps, video and other content preserved.
- Checks: JSON parsed; local route returned HTTP 200 with new heading, APF name and training text; whitespace check passed. Copy-only change; no new application tests required.
- Limitations/next: local only; no deployment or ZIP refresh. Next: owner review.


### 2026-10-30 — Refined Bagmati case-study interface

- Updated MappingCaseStudy.tsx's landscape-map layout: moved hero facts into a four-column desktop/two-column phone strip, paired the simulation player with the overview, expanded detailed maps to full section width with responsive image sizes, and reduced section gaps. Added a data-derived APF training shortcut.
- Preserved project text, scenario assumptions, counts, map/video assets, deferred poster loading and floating return button. Landfill retains its existing portrait-map presentation; no content/schema changes.
- Checks: lint and TypeScript passed; desktop screenshots reviewed for hero and balanced overview/video; map preview measures approximately 1,053px wide rather than half-column. Browser confirms one player and no horizontal overflow at 1280/390px, four desktop metric columns/two mobile columns. Bagmati and landfill HTTP 200 with unique player/section and no unintended landfill video. Whitespace passed.
- Limitations/next: local only; no production build/deployment or ZIP refresh. Next: owner review of the denser, more readable page.


### 2026-10-30 — Added Mustang drone-delivery feasibility assessment

- Reviewed the four-page Mustang Recci Survey Report, 25 source photographs, nine video preview frames and photo-record associations from the supplied folder. Owner confirmed leading the reconnaissance team and serving as client point of contact. Client organisation unspecified and not invented; team credits retain Kaushal Raj Bhattarai and Sagar Giri.
- Created data/projects/mustang-drone-delivery-feasibility-assessment.json and connected it to the shared MappingCaseStudy presentation with a field-assessment mode. Includes exact 13 May 2026 visit date, route/camp elevations, highest reached point, solar-panel dimensions/mass, constraints and preliminary finding. Kept reconnaissance distinct from an implemented delivery service; no delivery-flight or cargo-total claims added.
- Added six reviewed display images (including route overview) and two 12-second 720p excerpts, with posters, in public/images/mustang-reconnaissance. Photos padded/resized without cropping and metadata omitted; originals, long 4K recordings and telemetry remain unchanged. Raw geospatial files, unrelated datasets, travel/hotel records and full report were not published. Source/media provenance recorded in drafts/mustang-source-notes.md and mustang-media-manifest.json.
- Extended the shared template with field-image labels, paired field clips and exact-day date display while preserving existing Bagmati/landfill modes. Narrative, ordering and content remain in editable project JSON.
- Checks: lint and TypeScript passed; Projects listing, new detail and existing Bagmati/landfill routes HTTP 200. All public Mustang assets returned 200 and both clips fully decoded. Desktop hero reviewed; six images/two players and no horizontal overflow at 1280/390px. Browser playback test paused first clip at 8.49 seconds when second began; no media error reported. Whitespace passed.
- Limitations/next: reported elevations/conditions not independently surveyed or operationally certified; stronger wind after 11 AM describes the visit. No captions supplied for silent web excerpts. No production build, deployment or ZIP refresh. Next: owner review and any client-name/context additions if desired.

### 2026-10-30 — Mustang QA and content-strength review

- Reviewed the Mustang case study against its source report and owner-confirmed responsibilities. Saved findings, evidence gaps and scope in reports/qa-mustang-2026-10-30.md; editorial content rating 8/10. Client recommendation/decision remains unknown and was not invented.
- Added centered visible labels to standalone field clips in src/components/MappingCaseStudy.tsx so visitors can distinguish their subjects. Preserved accessible names, deferred loading and existing playback coordination. Bagmati overview player remains unchanged.
- Checks: ESLint and TypeScript passed; local page and all ten referenced media/poster assets returned HTTP 200. Browser confirmed one H1, no broken article fragment targets, no missing article image alt text and no captured error-level console messages. No horizontal overflow at 360/390/768/1280px; viewport reset. Confirmed both labels in rendered DOM. Source date/elevation/cargo checks and replacement-character check passed. Prior playback verification is documented separately; not repeated for this caption-only change.
- Limitations/next: development-browser QA only, no physical-device/accessibility certification, production build, Lighthouse rerun, deployment or ZIP refresh. Next: add the actual recommendation and client outcome when owner supplies them; tighten repeated constraint wording if desired.

### 2026-10-30 — Whole-site QA and targeted corrections

- Audited root public website and saved scope, findings and limits in reports/qa-whole-site-2026-10-30/REPORT.md, with route and internal-link evidence JSON. Preserved all pre-existing user changes.
- Corrected About.tsx phone overflow from horizontal entrance transforms, phone paragraph spacing, missing H1 and unnamed carousel dot buttons. Navigation.tsx now closes the phone menu on route changes and exposes aria-current for active links.
- Updated layout.tsx search/social metadata to derive geomatics identity/specialties and a valid preview portrait from editable Home JSON, replacing developer/designer copy and missing og-image.jpg. Corrected local metadata base to port 3000. Per-project metadata remains future work.
- Hardened api/contact/route.ts: reject malformed JSON/non-string fields with 400; escape visitor content before composing email HTML. SMTP transport/delivery not exercised.
- Checks: 23 existing public routes returned 200 and a missing route 404; 52 internal linked targets passed HEAD requests; 45 local JSON image/profile references exist. Main pages and six case-study layouts checked at 360/1280px; About overflow fixed and rechecked. Additional four detail-layout phone samples passed. No captured browser errors or completed-image failures. Mobile navigation and theme toggle passed; visible contact fields labelled/required. Six admin screens and four read APIs returned 200 locally. Five invalid-contact cases returned 400; focused HTML-escape helper check passed. Lint/TypeScript, 128-face backdrop hydration regression and whitespace checks passed.
- Limitations/next: local contact health reports SMTP and Turnstile unconfigured; no message sent. Admin write/upload/AI/PR workflows, deployed authentication, full accessibility/cross-browser/real-device QA, production build and performance benchmarks not verified in this pass. No deployment/push/ZIP refresh. Next: contact setup and delivery verification, client outcomes/content totals review, per-page SEO and production QA.

### 2026-10-31 — Portfolio quality, discovery, accessibility and performance upgrade

- Added ProjectArchive.tsx keyword/year/specialty filters, live result counts, clear/reset and empty-state behavior. Projects page now server-selects featured content using editable Home settings and passes only card fields (about 3.4 KB versus 39 KB of full records). Reworked Projects.tsx with immediate linked first slide, high-priority image, 44px controls, pause/resume and interaction/reduced-motion guards.
- Added metadata.ts and main/dedicated/detail route metadata, canonical URLs, approved record-derived social images, robots.ts/sitemap.ts and admin noindex. Disabled metadata streaming so descriptions consistently appear in head. Titles/descriptions for record details derive from their editable JSON. No new model links or confidential parcel data exposed.
- Added public skip navigation, content focus targets and focus styling; fixed light-mode Home tag contrast. About.tsx previews now use larger previous/next controls, a count and pause/resume. Deurali map uses a native dialog with a named trigger/close button, Escape, focus containment and focus return.
- Contact page now checks mail availability and presents a direct-email path when SMTP is unavailable. Existing form remains for configured environments. No email sent, credentials added or security checks disabled.
- Added ResponsiveBackdrop.tsx to keep small/reduced-motion screens lightweight while loading full survey artwork on wide screens. Removed animation imports from shared Navigation, Providers and error/404 views; reduced-motion configuration remains on animated Home/About/Contact pages.
- Split Rasuwa, Unified WebGIS, landfill, Bagmati and Mustang into dedicated route entries without changing URLs/templates/JSON. Generic projects still support future ordinary records. Pre-rendered achievement/activity detail records. Final build first-load JS: Rasuwa/mapping 114 KB versus earlier 191 KB; Projects 117 KB; Unified WebGIS 118 KB. Tightened role verb tense in Mustang/landfill/Bagmati JSON without inventing outcomes.
- Added optional NEXT_DIST_DIR/NEXT_QA_BUILD configuration for isolated low-memory validation; ignored .next-quality output. Next added its generated-type path to tsconfig. Ordinary build defaults preserved. Historical files and user work retained.
- Checks: final isolated production build passed lint/TypeScript and generated 38 static pages; whitespace and backdrop hydration regression passed. All 23 public routes plus robots/sitemap returned 200, invalid route 404, unauthenticated production admin 401; descriptions present in head. Search/combined filters/empty/reset, 360/390/768/1280 listing layouts, 44px slider controls, pause/manual slides, phone menu/navigation close, contact fallback, mobile-versus-desktop artwork and native map Escape/focus return verified. No captured final browser errors. Local disposable-record CMS regression passed stable slugs, media/body preservation, collisions, category moves, validation and delete; fixtures cleaned up.
- Final sequential Lighthouse mobile production results: Home 99/100/100/100 (performance/accessibility/best-practices/SEO), LCP 1.1s, TBT 90ms; Projects 97/100/100/100, LCP 2.6s, TBT 60ms; Rasuwa 100/100/100/100, LCP 1.2s, TBT 40ms. CLS 0 for all three. All intermediate/final raw reports and evidence retained in reports/quality-2026-10-31; QUALITY_REPORT.md describes scope and remaining limits. Scores are local lab snapshots, not a universal 9.8 rating or field performance guarantee; Rasuwa has a non-scoring back/forward-cache warning.
- Limitations/next: SMTP/Turnstile setup and authorized end-to-end delivery, deployed/physical-device validation, owner-confirmed content totals and missing Mustang client recommendation/decision remain. Optional owner question sent; no answer assumed. No push/deployment/ZIP refresh. Production PR creation still requires merge/deployment to publish. Temporary audit server will be stopped; root preview remains available.

- Final cleanup verification: temporary production audit server stopped. Root preview returned 200 for Home, Projects, Rasuwa and Contact; browser Mustang search returned one result with no captured errors after cleanup.

### 2026-10-31 — Removed project search/filter bar at owner request

- Simplified src/components/ProjectArchive.tsx to a server-rendered, date-sorted year archive. Removed search, year/specialty selectors, result count, reset controls and filter-only empty state. Preserved all seven project cards, 2026/2025/2024 groupings and the featured slider.
- Updated Projects metadata copy to remove its reference to browsing by specialty. Historical quality reports describe the earlier tested version and remain preserved; search/filter functionality is no longer implemented.
- Checks: TypeScript passed; local Projects returned 200, all three year groups and seven cards remain, and no search/filter control IDs are rendered. Whitespace check passed.
- Limitations/next: local only; no production rebuild, new Lighthouse measurements, deployment or ZIP refresh required for this removal. Existing launch configuration/content follow-ups remain unchanged.

### 2026-10-31 — Confirmed Mustang client and final feasibility outcome

- Updated data/projects/mustang-drone-delivery-feasibility-assessment.json with owner-confirmed client Airlift Technology (their own office). Revised description, client/coordination wording, preliminary finding qualification, visible outcome metric and closing section.
- Final conclusion now states that high winds and a short operating-weather window made the proposed delivery project unviable under assessed conditions and it did not proceed. Clearly distinguishes preliminary technical route potential from the final operational outcome. No invented wind thresholds, weather-window duration, aircraft limits, savings or incidents.
- Added provenance in drafts/mustang-source-notes.md; earlier unspecified-client/future-outcome notes remain historical and are superseded by this owner clarification. Search/share metadata automatically derives from updated record description.
- Checks: JSON parsed; local Mustang route returned 200 with client, final-outcome heading, weather reason and outcome metric. Old Findings and next steps heading no longer rendered; whitespace check passed. Copy-only change, no new implementation tests needed.
- Limitations/next: local only, no rebuild/deployment/ZIP refresh. Missing Mustang client/outcome follow-up is resolved; other deployment/device/contact configuration follow-ups remain.

### 2026-10-31 — About personal-photo gallery replaces project carousel

- Replaced project previews in src/components/About.tsx with a photo-only gallery of the owner: existing department portrait and two Rasuwa field portraits. Removed project links, project titles/descriptions, tags and dark text overlays from that area; biography and skills preserved. Retained accessible 44px previous/next, count, pause/resume and reduced-motion/offscreen guards.
- Added editable photos (imageSrc/imageAlt/position) to data/site/about.json. Updated About route to seed the page from About content instead of loading project records; live About content refresh remains. Added photo schema/legacy compatibility in siteContent.ts and object-entry creation in PageEditor.tsx, so photo selection, ordering and framing can be managed without code. Existing photos remain unchanged; CSS framing only.
- Checks: lint/TypeScript and whitespace passed. Photo-schema validation, legacy About payload compatibility, unsafe-path rejection and all three asset existence checks passed. Browser showed no project links in the gallery and no horizontal overflow at 360/1280px. Desktop visually reviewed; pause and navigation through both field photographs verified, final photograph loaded, no captured errors. Viewport reset after checks.
- Limitations/next: local only; no production rebuild/deployment/ZIP refresh or new Lighthouse score claimed. Next: owner review of selected photos; existing launch configuration follow-ups remain.

### 2026-10-31 — Added supplied field-survey photograph to About

- Copied the owner-supplied WhatsApp Image 2026-10-31 at 11.02.15 AM.jpeg unchanged to public/images/about/field-survey-tripod.jpeg; original download preserved. Added it as the fourth photo in data/site/about.json with descriptive alt text and centered framing. Existing three photos and gallery behavior preserved.
- Checks: About page and new image returned HTTP 200; About content API reports four photos including the new path; JSON and whitespace checks passed. Content/asset-only change; no new code tests required.
- Limitations/next: local only; no production rebuild/deployment/ZIP refresh. Photo order/framing remains editable in the About dashboard.

### 2026-10-31 — Expanded About photos and removed visible gallery controls

- Visually reviewed six candidate project photographs and added five existing images to data/site/about.json: Manaslu solo drone portrait and team photo, Banchare Danda field team, Mustang reconnaissance team and Rasuwa response team/aircraft. Gallery now contains nine images; excluded the community close-up that primarily features another person. Alt descriptions reference scene/project context without naming unconfirmed people.
- Removed the entire arrows/count/pause overlay from About.tsx at owner request. Retained automatic rotation with offscreen, document visibility and reduced-motion guards; hover pauses, focus pauses, arrow keys browse, Space toggles pause, and touch swipes browse. Keyboard instructions are screen-reader-only. No project titles/descriptions restored.
- Added editable cover/contain framing to photo records/schema/editor defaults, preserving backward compatibility for earlier records without fit. New team/landscape images use contain to preserve full compositions; no source images altered or duplicated.
- Checks: lint/TypeScript and whitespace passed; updated/legacy photo-schema checks passed and all nine asset paths exist. Browser confirmed zero gallery buttons and keyboard navigation/wraparound to the new Rasuwa photo with contain framing. Existing desktop gallery visually reviewed without overlay. Swipe handler implemented but not physically touch-device tested.
- Limitations/next: local only; no rebuild, deployment, new performance score or ZIP refresh. Owner can reorder/select/framing-edit photos through About content editor.

### 2026-10-31 — Corrected About frame size and photo rotation

- Owner chose one consistent 500px-tall frame. Updated About.tsx to h-[500px] at all widths, replacing 480/600/680px breakpoints.
- Removed invisible hover/focus pauses that could leave visitors seeing only one photo. Manual navigation resets the seven-second interval; explicit Space pause/resume, document/offscreen and reduced-motion guards remain. No overlay controls restored.
- About content now refreshes without cache on mount, browser focus and visible-tab return, helping existing tabs pick up updated photo records instead of holding an old list. All nine configured photos preserved; no new assets or photo-count claim added without checking.
- Checks: lint/TypeScript passed. Browser traversed all nine distinct photo slides and measured exactly 500px at 360/768/1280px, no horizontal overflow and zero gallery buttons. Automatic rotation changed the displayed photo after resuming and waiting past its interval; no captured browser errors. Viewport reset.
- Earlier Firefox inspection was blocked by the computer-use tool's unsupported Windows-browser URL-policy enforcement; no Firefox controls were operated. This verification used the supported in-app browser. No production rebuild, deployment, new Lighthouse audit or ZIP refresh. Next: owner refreshes the existing Firefox About page once to load the changed component, then reviews framing.

### 2026-10-31 — Created domain-registration cover-letter PDF

- Created output/pdf/Shradaya_Raj_Poudel_Domain_Cover_Letter.pdf from the owner's requested simple cover letter for shradayarajpoudel.com.np. One A4 page, dated 31 October 2026, explaining personal portfolio use and signed with the typed owner name. No signature image or additional identity details invented.
- Checks: reopened PDF and confirmed one page and correct domain text; rendered through Poppler and visually inspected spacing, legibility and margins. No website behavior changed.
- Limitations/next: local document only; not submitted or uploaded to the registration service. Owner may sign if required by their application process.

### 2026-10-31 — Exported cover letter as JPG

- Exported output/pdf/Shradaya_Raj_Poudel_Domain_Cover_Letter.jpg at 200 DPI/high JPEG quality from the verified PDF, preserving letter content and original PDF. Visually checked legibility and margins; file is 264,876 bytes. Local artifact only; no website change or external submission. Next: owner downloads/uploads the JPG as needed.

### 2026-10-31 — Prepare current portfolio update for existing Vercel production project

- Owner requested publishing the latest website on the same Vercel hosting and obtaining its public address. Confirmed origin/main and local main matched at 99a8aa8, GitHub account access works, and prior Git-integrated Vercel deployment succeeded. Existing stable address https://shradaya-raj.vercel.app returned 200.
- Prepared the intended root app, editable records, approved public media, schema/gallery fixes, project additions, metadata and shared UI changes accumulated in this session. Local raw-source notes, reports, release ZIPs, cover-letter outputs, loose trial inputs and screenshots remain untracked/local; .env.local/build caches excluded. Staged text credential-pattern check found no potential credentials in 72 text files; no private environment files staged. New media is about 61 MiB total; largest file about 14 MiB.
- Owner confirmed .com.np registration still awaits approval. Public DNS-over-HTTPS checks currently return NXDOMAIN for its NS/A queries. Local system resolver refused queries, so that failure was not treated as domain evidence. Canonical/share/sitemap base now uses optional SITE_URL, otherwise Vercel's production-domain variable and the existing vercel.app fallback, instead of hardcoding the pending .com.np name. Added configuration guidance and blank SITE_URL example.
- Checks: latest isolated production build passed lint/TypeScript and generated 38 static pages; staged whitespace passed; backdrop regression passed. Local production smoke and subsequent GitHub/Vercel checks are being completed; this entry does not claim publication yet.
- Next: commit/push the reviewed app update to connected main, wait for Vercel status, verify public routes/About assets and report the stable address. Custom .com.np connection remains pending registry approval; existing Vercel nameservers do not need to change for content updates.

### 2026-10-31 — Existing Vercel production update verified live

- Committed and pushed approved root website update 13554ba2e93df9b8cc3e570acb63122b6bc52acd to origin/main. GitHub CI build completed successfully. Vercel reported Production deployment 7455061004 successful (dashboard build 28d6kiZeNHNCPz9TJk2cSLGbtK45; deployment URL https://shradaya-ookpcmdp8-shradaya-rajs-projects.vercel.app). Existing stable address https://shradaya-raj.vercel.app now serves the update.
- Live checks: Home/About/Projects/Contact, Rasuwa/Bagmati/landfill/Mustang/Unified WebGIS detail routes, robots and sitemap all returned 200; unauthenticated admin returned 401. About API contains nine photos and every original photo URL returned 200. Live HTML confirms 500px frame, no old gallery buttons, no project search controls, current Mustang outcome and valid vercel.app canonical. Supported browser confirmed 500px gallery, loaded photo, zero overlay buttons, no horizontal overflow or captured console errors.
- Live contact configuration remains SMTP/Turnstile false; direct email fallback is the available contact path. No email sent or production credentials changed.
- Custom shradayarajpoudel.com.np is still awaiting registry approval as owner confirmed. No custom-domain connection or DNS approval claimed. Existing Vercel NS values remain ns1.vercel-dns.com/ns2.vercel-dns.com. After approval, add/verify the custom domain under the existing project's Domains settings and set SITE_URL/redeploy once serving correctly.
- Stored raw live checks in reports/deployment-2026-10-31/live-checks.json locally. Temporary local production server stopped; restored generated next-env.d.ts QA output reference to the original .next path. Owner inputs, report artifacts and cover-letter outputs remain local/untracked. Result entry intentionally remains local after successful deployment to avoid a documentation-only redeployment.

### 2026-10-31 — Smoother About slideshow and removed Projects pause/resume button

- About.tsx now advances every five seconds and uses an overlapping 0.8-second ease-in-out crossfade instead of wait-mode exit/entry. Preloads the next responsive, optimized photo while the gallery is visible to reduce blank/loading transitions. Existing 500px frame, nine images, keyboard/swipe and reduced-motion guards preserved.
- Removed Projects.tsx pause/resume button. Retained three 44px slide-selection dots and existing hover/focus/offscreen/document/reduced-motion guards. Manual slide selection no longer sets an unreachable permanent pause state; each selected slide resets the timer.
- Checks: lint, TypeScript, whitespace and isolated production build passed (38 static pages). Browser observed two loaded image layers crossfading at complementary opacity values, gallery still 500px tall, and Projects had zero pause/resume controls with three selection dots remaining.
- Owner's existing publication authorization applies to this follow-up on the same Vercel project. Preparing commit/push and deployment verification; no live success claimed in this entry. No new performance score or ZIP refresh.

- Deployment result: follow-up commit 5b4e531 pushed to main; GitHub CI and Vercel Production both succeeded (Vercel build 2c2RV6weYmuWmYNW25ZLkLgWRzop). Live Projects HTML has no pause/resume control and retains three slide dots; About returns 200. Live browser confirmed a 500px frame with two loaded overlapping crossfade layers and no captured errors. Result recorded locally after deployment to avoid a documentation-only redeploy.

### 2026-10-31 — Updated owner-confirmed Home statistics

- Changed data/site/home.json and matching HomePageClient.tsx fallback to 2+ Years of Experience, 12+ Projects Completed and 5+ Trainings Attended. Removed Article Published entirely. Counts are owner-confirmed professional totals, not calculated from the selected portfolio records.
- Balanced the remaining three statistics in three columns from small-screen/tablet widths upward and a single column on narrow phones. Content remains editable through the Home dashboard.
- Checks: lint/TypeScript passed; local rendered Home contains the year label and 12+ figure without Article Published; whitespace passed. No new unit tests for this content/layout-only change. Connected GitHub CI/Vercel production builds will validate publication.
- Preparing follow-up deployment on the existing Vercel project; live result to be recorded separately. No unrelated files or settings changed.

- Publication verified: commit 735dcf1 passed GitHub CI and Vercel Production (build DJ4AgZ9B8riPi3ukz9JzkB9djfbY). Live Home/API show the new three statistics and no Article Published label. Result saved locally after deployment to avoid an extra documentation-only build.

### 2026-11-01 — Live Vercel QA/UAT review and verified-defect fixes

- Audited the root live portfolio at shradaya-raj.vercel.app: all 22 sitemap pages, 60 linked-resource/system checks, narrow-phone layouts for main pages/all seven projects, tablet layouts, light/dark presentation, project navigation, video exclusivity, image viewer, contact availability and metadata. Six sequential public mobile Lighthouse audits scored performance 69–98; accessibility/best practices/SEO each 100. Raw evidence and detailed design/content recommendations are in local reports/live-qa-2026-11-01; these are lab results, not owner UAT sign-off or field Core Web Vitals.
- Fixed a manually observed WebGIS 320px chart clipping defect in src/app/components/DynamicVisualizations.tsx using explicit single-column/shrinkable grid/card/chart containers and phone padding. Fixed image viewer focus restoration in src/components/WebGISCaseStudy.tsx. Added scoped light-theme definition-list surfaces in src/app/globals.css to replace dark translucent fact-card fills. Preserved requested return button, gallery frame/controls and CMS content sources.
- Production dependency scan found seven package findings including a critical Next.js advisory. Verified upstream advisory; updated Next/ESLint config to 15.5.28 and Nodemailer to 10.3.1, refreshed compatible affected transitive packages and scoped Typography selector parser override to 6.1.5. package.json/package-lock.json changed; final production dependency audit reports zero findings. Local Nodemailer JSON transport compatibility passed without sending email. This does not establish exploitability or certify all development tooling.
- Checks so far: lint/TypeScript on UI changes, backdrop regression and whitespace passed; updated-package lint passed; isolated production build/final browser regression pending. Local port 3000 was unavailable, so no local browser result claimed yet. No production CMS mutation or test email; live SMTP/Turnstile remain unconfigured.
- Next: complete updated production build and browser regression, publish checked fixes using existing authorization for the same Vercel project, verify deployment and append results. Recommended later work: initial JavaScript/chart performance, earlier featured work on Home, fewer repeated tags, phone return-link placement, intentional contact setup, real-device/accessibility UAT. Existing user files/history preserved; raw reports remain local.

- Verification follow-up: Next.js 15.5.28 isolated production build passed, generating 38 pages with lint/TypeScript checks. Restored the generated next-env.d.ts reference to .next. Supported browser at local production port 3010 measured all WebGIS cards at 238.4px inside a 238.4px parent at 320px viewport; no internal card overflow. Image viewer Escape restored focus to its opening button. Production audit is zero; all-dependency audit still reports 19 moderate/3 high findings in development-tool dependencies (recorded separately, not claimed resolved). Local JSON-transport mail generation passed; no email delivered. Preparing reviewed commit/deployment; no live fix claim yet.

- Publication result: commit cdf5a99 passed GitHub CI run 41299633388 and Vercel Production build FQn8h1qtH9r6kpZeNsNcJBecZyro. Rechecked all 22 public sitemap routes: 200 with no failures. Public browser verified 320px charts fit their parents, image-viewer Escape restores opening-button focus, and no captured errors/warnings in that flow. Saved live screenshot and final report under reports/live-qa-2026-11-01. Temporary port-3010 server stopped and viewport reset. Remaining work and lab/physical-device limits are explicitly documented; no post-fix performance gain or final owner UAT sign-off claimed. This result entry remains local after deployment to avoid a documentation-only redeploy.

### 2026-11-01 — Implement requested loading, layout, contact preparation and dependency follow-up

- HomePageClient.tsx no longer imports Framer Motion for below-fold fades; content renders immediately. Featured projects now precede tools, controlled by editable home.sectionOrder in data/site/home.json and validated in src/lib/siteContent.ts (legacy records default safely). Home and archive/achievement cards show the first three editable tags; Projects featured carousel shows four; full detail tags and records preserved.
- WebGISCaseStudy.tsx uses new lightweight SurveyCharts.tsx SVG/CSS charts instead of dynamically loading Chart.js. Exact numbers and percentages remain in initial HTML and charts adapt to both themes; generic visualizations elsewhere remain unchanged. Added chart palette/donut theme rules in globals.css. Home first-load JS decreased from 154 KB to 118 KB in the isolated build; no live score improvement claimed yet.
- DetailBackLink.tsx retains one return link, in normal flow after content below 640px and floating on larger screens. Browser phone check confirms position relative and no page overflow, eliminating coverage of chart values/video controls.
- Contact: owner wants enquiries delivered directly to the existing Gmail address, so retained the form. Added client field limits matching server validation and SMTP connection/greeting/socket timeouts. Created CONTACT_EMAIL_SETUP.md with exact non-secret Vercel settings and private app-password handoff. tests/contact-smtp.cjs passed against a local SMTP sink with a separate production app process: configured recipient, visitor Reply-To, escaped HTML and successful response verified without external email. Real Gmail delivery still requires owner-entered SMTP credentials; live mail not claimed working.
- Updated compatible brace-expansion/Browserslist/js-yaml dependency paths in package-lock.json. All-dependency scan improved from 19 moderate/3 high to 18 moderate/0 high/0 critical; production-only scan remains zero. Remaining moderate findings stem from minimatch in the linter chain; no unsafe incompatible override or forced downgrade applied.
- Checks: lint/TypeScript, isolated production build (38 pages), backdrop regression, section-order backward compatibility/validation and local SMTP integration passed. Local browser: Home heading order intro/featured/tools with nine card tags total; WebGIS has three immediately rendered charts and no canvas; phone return link in flow. Generated next-env reference restored to .next.
- Vercel environment UI is signed out in the available browser. Opened sign-in for owner and requested private sign-in before entering non-secret SMTP settings. Gmail app-password creation/entry is an owner handoff. Next: publish verified app changes, measure deployed Home/WebGIS performance and confirm layout; finish Gmail setup once owner signs in/enters credential. Existing raw inputs, local reports and user work preserved.
