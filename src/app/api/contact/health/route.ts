import { NextResponse } from 'next/server'

function hasValue(name: string): boolean {
  return Boolean(process.env[name]?.trim())
}

export async function GET() {
  const smtp = {
    host: hasValue('SMTP_HOST'),
    port: hasValue('SMTP_PORT'),
    user: hasValue('SMTP_USER'),
    pass: hasValue('SMTP_PASS'),
    from: hasValue('SMTP_FROM'),
    to: hasValue('CONTACT_FORM_EMAIL') || hasValue('SMTP_TO'),
  }

  const turnstile = {
    siteKey: hasValue('NEXT_PUBLIC_TURNSTILE_SITE_KEY'),
    secretKey: hasValue('TURNSTILE_SECRET_KEY'),
  }

  const smtpConfigured =
    smtp.host && smtp.port && smtp.user && smtp.pass && smtp.from && smtp.to
  const turnstileConfigured = turnstile.siteKey && turnstile.secretKey

  let message = 'Missing required SMTP env values.'
  if (smtpConfigured && turnstileConfigured) {
    message = 'Contact mail and Turnstile are configured.'
  } else if (smtpConfigured) {
    message = 'Contact mail is configured. Turnstile keys are not both set.'
  }

  return NextResponse.json({
    ok: smtpConfigured,
    smtpConfigured,
    turnstileConfigured,
    checks: {
      smtp,
      turnstile,
    },
    message,
  })
}
