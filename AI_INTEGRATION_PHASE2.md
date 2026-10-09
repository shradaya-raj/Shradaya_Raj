# Phase 2 - AI Integration Guide

This document defines how AI is integrated into the portfolio CMS so non-technical admins can update content without editing code.

## Goal

Enable an admin to:
- Upload PDF/Word/image files.
- Let AI extract key content and suggest structured fields.
- Edit/review in a form.
- Publish safely (prefer PR-based workflow in production).

## Current Foundation in This Repo

- Admin content UI: `/admin/upload`
- AI editor UI: `/admin/ai`
- AI API routes:
  - `/api/ai-assist` (refine text/tags/importance)
  - `/api/ai-draft` (preview JSON edits from instruction)
  - `/api/ai-to-pr` (create PR from AI edits)
  - `/api/upload` (save/update item + optional AI summary)

## Phase 2 Scope

### 1) AI Document Intake (new enhancement)

When admin uploads a PDF or Word file, AI should:
- Extract raw text.
- Suggest category (`projects`, `achievements`, `eca`).
- Suggest title, short description, tags, and importance.
- Return editable suggestions to the admin form.

The admin remains in control and can adjust any field before final save.

### 2) Non-technical Admin Control

All section management should be possible from admin pages:
- Create, update, delete items.
- Manage content for Projects, Achievements, and ECA.
- Edit site copy through AI instructions and preview changes.

### 3) Safe Publish Workflow

- Local/dev: write files directly.
- Production: create GitHub PR automatically, then merge to publish.
- Avoid direct production filesystem writes.

## Data Model (Item JSON)

Items are stored under `data/<category>/<slug>.json`:
- `slug`
- `title`
- `description`
- `fullText` (optional extracted source text)
- `aiContent` (optional AI-generated rich summary)
- `date`
- `tags`
- `featured`
- `category`
- `images`
- `importance`

## AI Prompting Rules

- Return strict JSON only (no markdown fences).
- Keep output concise and portfolio-ready.
- Never auto-publish without user action.
- Treat AI output as draft, not final truth.

## Security and Governance

- Protect AI/admin APIs with admin auth.
- Validate file types and size before processing.
- Limit extracted text sent to model (token/cost control).
- Keep auditability via PR history in production.

## Environment

Required:
- `DEEPSEEK_API_KEY`

Production PR mode:
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`

## Implementation Checklist

- [x] Admin upload and edit UI exists
- [x] AI drafting and AI-to-PR endpoints exist
- [x] AI-assisted text refinement exists
- [ ] AI document intake autofill from uploaded PDF/Word
- [ ] Multi-file attachment improvements and image handling workflow
- [ ] Optional voice command workflow for admin instructions

## Next Steps

1. Add AI intake API for document-to-form autofill.
2. Connect upload UI button: "Auto-fill from file with AI".
3. Improve extraction quality and classification prompts.
4. Add optional voice-to-text command input for admin actions.
