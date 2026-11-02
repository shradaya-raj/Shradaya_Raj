# Receive portfolio enquiries in Gmail

The form sends through SMTP on the server. Setting the recipient alone does not provide a sender login. No Gmail password or app password belongs in chat, source code, screenshots or Git.

Open the existing [Vercel project's environment settings](https://vercel.com/shradaya-rajs-projects/shradaya-raj/settings/environment-variables). Add these for **Production**:

| Name | Value |
| --- | --- |
| CONTACT_FORM_EMAIL | shradayarajpoudel@gmail.com |
| SMTP_HOST | smtp.gmail.com |
| SMTP_PORT | 465 |
| SMTP_SECURE | true |
| SMTP_USER | shradayarajpoudel@gmail.com |
| SMTP_FROM | shradayarajpoudel@gmail.com |
| SMTP_PASS | Enter a Gmail app password privately in Vercel, never your regular account password. |

For an eligible Gmail account, create an app password in [Google Account settings](https://myaccount.google.com/apppasswords). Google requires 2-Step Verification and some managed/protected accounts do not offer app passwords. Complete account/security steps yourself. If unavailable, use a supported transactional email provider instead; the recipient can stay the same. [Google's instructions](https://support.google.com/accounts/answer/185833), [SMTP settings](https://developers.google.com/workspace/gmail/imap/imap-smtp).

Redeploy the latest production deployment after saving the values; new environment values do not alter an existing deployment. [Vercel environment documentation](https://vercel.com/docs/environment-variables).

Check `/api/contact/health`: `smtpConfigured: true` confirms the required settings exist, not that Gmail accepted the login or a message arrived. Submit one clearly marked test enquiry, check Inbox/Spam and confirm Reply targets the visitor's address. Only receipt confirms end-to-end delivery. Never share the SMTP_PASS value while reporting results.

Optional Turnstile: configure both NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY for the actual site hostname. Do not set only one. SMTP delivery does not require a custom domain; the current vercel.app site can use this Gmail sender.

Current state: delivery code exists and is being locally verified; production SMTP credentials remain owner configuration. Do not mark Gmail delivery complete until the real inbox receives a test.
