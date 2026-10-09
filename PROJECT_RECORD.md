# Website project record

This is the ongoing record of project decisions, implementation, verification, and remaining work. Update it with every project change; do not rewrite historical entries to imply unfinished work was completed.

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
