# Receive portfolio enquiries in Gmail

The form sends through SMTP on the server. Setting the recipient alone does not provide a sender login. No Gmail password or app password belongs in chat, source code, screenshots or Git.

## Required SMTP (Production)

Open the existing [Vercel project's environment settings](https://vercel.com/shradaya-rajs-projects/shradaya-raj/settings/environment-variables). Add these for **Production**:

| Name | Value |
| --- | --- |
| CONTACT_FORM_EMAIL | shradayarajpoudel@gmail.com |
| SMTP_HOST | smtp.gmail.com |
| SMTP_PORT | 587 |
| SMTP_SECURE | false |
| SMTP_USER | shradayarajpoudel@gmail.com |
| SMTP_FROM | shradayarajpoudel@gmail.com |
| SMTP_PASS | Enter a Gmail app password privately in Vercel, never your regular account password. |

Verified on Vercel Production (2026-11-23): port **587** with `SMTP_SECURE=false` (STARTTLS) delivered successfully. Port **465** with `SMTP_SECURE=true` produced ~10s connection timeouts (`POST /api/contact` 500) before the switch. Prefer 587 on this host unless a later test proves otherwise.

For an eligible Gmail account, create an app password in [Google Account settings](https://myaccount.google.com/apppasswords). Google requires 2-Step Verification and some managed/protected accounts do not offer app passwords. Complete account/security steps yourself. If unavailable, use a supported transactional email provider instead; the recipient can stay the same. [Google's instructions](https://support.google.com/accounts/answer/185833), [SMTP settings](https://developers.google.com/workspace/gmail/imap/imap-smtp).

## Required Turnstile (Production) — fail closed

Production **rejects** contact submissions if either Turnstile key is missing. Configure **both** keys together. Do not set only one.

1. In [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile), create a **Managed** widget.
2. Add hostname(s) the form actually uses, for example:
   - `shradaya-raj.vercel.app`
   - your custom domain later (when live)
3. In Vercel **Production** environment variables, set:

| Name | Value |
| --- | --- |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Turnstile **site** key (public) |
| TURNSTILE_SECRET_KEY | Turnstile **secret** key (private; never commit or paste into chat) |

4. Redeploy Production after saving. New env values do not apply to an old deployment. [Vercel environment documentation](https://vercel.com/docs/environment-variables).
5. Confirm `/api/contact/health`:
   - `smtpConfigured: true`
   - `turnstileConfigured: true` (both site and secret presence checks true)
6. Submit one clearly marked test enquiry, complete the Turnstile widget, check Inbox/Spam, and confirm Reply targets the visitor address.

Optional test-only override (local automated tests only): `TURNSTILE_SITEVERIFY_URL` may point at a mock Siteverify server. **Do not set this in Vercel Production.**

## Local development and automated tests

- Local `next dev` without Turnstile keys: SMTP can still be tested; Siteverify is skipped when the secret is unset and `NODE_ENV` is not enforcing production fail-closed the same way as a Production deploy with missing keys.
- Production-mode servers (including Vercel and `next start` with `NODE_ENV=production`) **fail closed** when either key is missing: `POST /api/contact` returns 503 and sends no mail.
- Automated tests use fixture keys plus a local Siteverify mock. They never call Cloudflare with real credentials and never send external email.

## Rate limiting

Production uses a best-effort in-memory limit (about 8 requests per 10 minutes per IP+email). On Vercel serverless this is **not** a shared hard quota across instances. Turnstile is the primary automated spam control.

## Origin allowlist

A strict Origin/Referer allowlist was **not** enabled. Preview URLs and localhost vary, and a brittle allowlist would reject legitimate visitors. Prefer Turnstile Siteverify. Revisit Origin checks only if spam persists after Turnstile is on.

## Spam protection vs email ownership

| Control | What it proves |
| --- | --- |
| Turnstile + honeypot + validation + rate limit | Likely human / not a naive bot script |
| Email ownership (double opt-in / OTP) | Visitor can read the typed mailbox |

This site implements **automated spam protection**. It does **not** verify that the visitor owns the email address they entered. Confirmed ownership would need a separate confirmation-email flow.

## Health endpoint

`GET /api/contact/health` returns only boolean configuration status for SMTP and Turnstile (and a short message). It does not reveal secret values or prove that Gmail accepted a message.

Current SMTP note (2026-11-23): Production Gmail delivery verified by owner receipt after the 587 / `false` settings and redeploy. Keep the App Password private in Vercel only.
