# Dynamic website audit and implementation plan

Reviewed 9 October 2026. Scope: the root Next.js app, public page components, content JSON, admin upload/AI screens, content APIs, and publishing paths. This is an implementation plan; it does not change website behavior.

## Objective

Allow the owner to edit portfolio content through the dashboard, preview it, and publish without editing source code. Keep reusable page layouts and styling in code. Treat editable content and immediate publication as separate requirements.

## Section inventory

| Area | Current state | Dashboard controls to add or complete |
| --- | --- | --- |
| Home hero | Reads data/site/home.json; code fallback also exists | Name, role, portrait and alt text, specialties, button text and destinations |
| Home introduction | JSON-backed | Heading and biography editor |
| Home statistics | Numbers are manually stored strings | Calculate eligible published project/training counts; derive experience from a start date; allow explicit overrides with clearly defined meanings |
| Gadgets and software | JSON-backed categories and lists | Add, edit, reorder, remove categories and tools |
| Featured projects | API selects three newest featured projects | Select projects, define order and display limit, share selection across Home and Projects |
| About | Biography and skills are JSON-backed; project carousel comes from shared records | Paragraphs, skills, selected carousel projects and ordering |
| Project listing | Records and year groups are data-driven; introductory copy is hardcoded | Page heading, description, featured placement; visitor search and tag/year filters |
| Achievements | Records are data-driven; headings and descriptions are hardcoded | Training/certificate records, certificate files, section labels and page introduction |
| ECA | Records are data-driven; page introduction is hardcoded | Activity records, attachments and introduction; optional navigation visibility |
| Generic detail pages | Shared ItemDetail renders JSON, media, reports and charts | Full body editor, cover selection, captions, attachment management, chart editing, preview |
| Dedicated project case studies | Six named project routes contain separate page content | Move their content into structured records while preserving layouts; migrate UMS, Airlift, Deurali, Drone, GIS and LiDAR |
| UMS survey charts | Eight chart components contain fixed datasets | Editable datasets, labels, units, titles, source and survey date; calculate totals and percentages from data |
| Case study maps and media | References are embedded in individual page components | Approved map/embed links, image/video galleries, documents, poster and methodology blocks |
| Contact | Heading, portrait, email, location and LinkedIn read JSON; email API exists | Edit contact information and social links; show mail configuration health. An inbox would require new persistent storage |
| Navigation | Hardcoded desktop/mobile links | Shared editable labels, order and visibility with valid destinations |
| Search/share metadata | Mainly hardcoded in layout.tsx; copy still describes developer/designer | Site and per-page title, description, sharing image and canonical URL |
| Admin dashboard | Upload/editor and AI screen exist; no unified overview route | Overview, content counts, recent edits, drafts, media issues, pending publication and configuration status |

## Existing foundations to reuse

- data/site/{home,about,contact}.json and /api/site/[page].
- data/{projects,achievements,eca}/*.json and src/lib/data.ts.
- /admin/upload supports editing basic fields, files, featured and importance.
- /admin/ai supports site/item instructions and proposed JSON previews.
- Generic detail pages support Markdown, attachments and dynamic visualization configurations.
- Upload publishing supports local filesystem saves and a GitHub PR path. AI publishing also has a PR workflow.

## Gaps to resolve before expansion

1. Dedicated project routes take precedence over /projects/[slug], leaving a split source of truth for cards and detail content.
2. Item deletion currently writes directly to the filesystem, unlike the PR-based production upload workflow. All mutations need the same publishing rules.
3. Slugs are derived from title and date during save. Prefer stable identifiers/URLs; make URL changes explicit and create redirects when needed.
4. The upload form does not provide a complete editor for long-form content, existing attachments, gallery ordering, captions or cover selection.
5. Featured selection ignores importance and fixes the result to three newest records. Define one ordering policy for each placement.
6. Public reads, protected writes and admin endpoints need clear separation. The middleware currently protects /api/items/*, which would restrict using those routes for public browsing in production.
7. Shared schemas must validate category, identifiers, dates, links, media paths and chart values on the server; apply the same validation to AI drafts.
8. Home/About/Contact have duplicated code defaults. Establish a canonical content source and intentional error/fallback behavior.
9. Rendering and caching must match publication expectations. About explicitly uses force-static; JSON-backed content alone does not guarantee updates become immediately visible in production.
10. Existing baseline issues: contact-route TypeScript errors, missing images, wrong Home CTA destination, incomplete SMTP configuration, and outdated professional metadata.
11. AI_INTEGRATION_PHASE2.md has stale unchecked tasks: intake API/UI and multi-file handling are present in code, but need verification before being called complete.

## Recommended phases

### Phase 1: Complete everyday editing

- Create /admin overview with links to page editors, content lists, media and publication status.
- Add ordinary form editors for Home, About and Contact; AI remains optional.
- Extend item editing to body content, media, cover selection and chart configurations.
- Establish shared typed schemas and a single authenticated mutation/publishing service.
- Fix baseline defects and validate that changes survive refresh and publish correctly.

Acceptance: edit text/image and an existing project without source edits; preview before publication; reject invalid content; preserve URLs and existing attachments.

### Phase 2: Migrate case studies

- Introduce reusable content blocks: text, metrics, image/gallery, video, document, chart, map/embed and methodology steps.
- Migrate each dedicated page while preserving its content and visual structure.
- Move UMS datasets out of chart components and into editable records.
- Preserve old links or provide redirects, including UMS record/route differences.

Acceptance: changing a project title, narrative or metric updates the card and detail page consistently; old links work; all current media and charts survive migration.

### Phase 3: Portfolio-wide controls

- Add editable navigation, listing introductions, metadata and section visibility/order.
- Add derived statistics with published/completed/training classification, excluding test and draft records.
- Add shared featured selection and visitor search/filter controls.
- Add media validation and clear empty/loading/error states.

Acceptance: counts and featured placement match published records; desktop/mobile navigation stay consistent; search and filters return the expected content.

### Phase 4: Publishing and operational dashboard

- Add draft, preview, publish, archive and revision history to the chosen persistence workflow.
- Show pending PR/deployment status when using the existing Git workflow.
- If publication must appear instantly without a deployment, replace production file writes with persistent content storage and media storage, then define cache refresh behavior.
- Add contact delivery status; add stored inquiries only if an inbox is required.
- Add analytics later if visitor metrics are wanted; no analytics dataset currently exists to populate those widgets.

Acceptance: edits persist beyond restart/deployment; failed publication is visible; restoring a previous revision works; unpublished content is unavailable publicly.

## Publication decision

The least disruptive first version extends the existing JSON/Git workflow: edit -> preview -> create PR -> merge -> deploy. This gives dashboard-managed content, with deployment required for publication.

If the goal is edit -> publish -> immediate live update, choose persistent content/media storage before implementing production CRUD. A database is not required merely to make content editable, but local files in a deployment cannot be treated as durable live storage.

## Suggested dashboard organization

Overview | Pages (Home, About, Contact) | Projects | Achievements | ECA | Media | Publishing | Site settings

Content forms should work without AI. AI may suggest copy or extract uploaded material, followed by owner review. Do not let generated narrative or automatically inferred charts become published facts without review.
