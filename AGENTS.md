# Project instructions

## What this repository is
This repository contains two Next.js apps:
- Root app (`./`) — the real personal website and admin dashboard. Work here by default.
- Nested app (`./personal-website/`) — a separate experiment. Do not edit, deploy, or treat as the live site unless the owner explicitly names that folder.

## Non-negotiable rules
1. Prefer changing content through JSON under `data/` and media under `public/` when the request is a content edit.
2. Keep routine text, lists, ordering, visibility, and featured placement editable without writing code.
3. Local saves may write files. Production admin saves create a GitHub pull request. A PR is not published until merge and deployment succeed. Never describe a pending PR as live.
4. For every behavior change, append a dated entry to `PROJECT_RECORD.md` with: changed behavior/files, checks and results, limitations, and next work. Preserve historical entries. Distinguish implemented work from planned work. Never record secrets or credentials.
5. Preserve existing user content and media unless the owner explicitly asks to remove them.

## Source of truth
- App version and scripts: root `package.json`
- Content shapes: `data/**` and `src/lib/types.ts`
- CMS goals and phases: `DYNAMIC_WEBSITE_PLAN.md` plus the newest `PROJECT_RECORD.md` entries (newer wins when they disagree)
- Detailed agent operating rules: `.cursor/rules/*.mdc`
