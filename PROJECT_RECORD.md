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

### 2026-10-23 — Image loading and missing-asset repairs

- Reviewed the owner's browser log: several chunk requests failed, and image optimization returned 400 for missing images. Live checks now return 200 for the two cited shared JavaScript chunks. One sample optimized portrait was about 55KB versus the 663KB original; observed timings are single requests, not performance benchmarks.
- Added a real lightweight SVG fallback and replaced references to absent placeholder/drone/GIS/LiDAR files in records and page components. Generic fallback is explicitly labelled unavailable, rather than misrepresenting another project's photo.
- Added responsive image sizes to cards, featured carousel, About carousel and Home portrait so the browser need not request 1920px versions for small cards. Added a tiny SVG monogram favicon (Apple icon uses an existing portrait) and a manual Reload page files action to the error screen.
- Verification: production build including lint/TypeScript passed; static record/media scan found no missing referenced assets. Public deployment checks pending. Missing original project photos still need owner-provided replacements; this change prevents failed requests using a fallback. Chunk availability does not establish the cause of the earlier intermittent browser failures.

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
