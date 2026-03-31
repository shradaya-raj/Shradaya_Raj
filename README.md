# Personal website (root app)

This repository contains **two** Next.js projects:

- **Root app (DEPLOY THIS)**: this directory (`./`) — Next.js 14
- **Nested app (do not deploy)**: `./personal-website/` — separate Next.js 15 experiment

The hosted site at `https://shradaya-raj.vercel.app/` should be configured in Vercel to build from the **root app**.

## Local development (root app)

```bash
npm install
npm run dev
```

## Content + admin editing (git-based)

Site content is stored in git:

- Structured items: `data/projects/*.json`, `data/achievements/*.json`, `data/eca/*.json`
- Site copy (home/about/contact): `data/site/*.json` (created as part of this repo’s pipeline work)
- Media: `public/images/<category>/<slug>/...`

Edits should be made via the admin UI, which creates a **GitHub Pull Request** (no production filesystem writes).

### Media rules (recommended)
- **paths**: store assets under `public/images/<category>/<slug>/...` and reference the filename in the item JSON `images` array.
- **types**: PDF/DOC/DOCX, images (`.png/.jpg/.jpeg/.webp/.gif`), and small videos (`.mp4/.webm`).
- **size**: keep files small for PR-based workflows. For large videos, prefer external hosting (YouTube/Vimeo) and store the URL in JSON.
- **Git LFS (optional)**: if you must store large binaries in git, set up Git LFS and document it for collaborators.

## Environment variables

Copy `.env.example` to `.env.local` and fill values for local dev.

