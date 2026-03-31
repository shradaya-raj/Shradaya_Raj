import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

type ContactPayload = {
  name?: string
  email?: string
  message?: string
  company?: string
  turnstileToken?: string
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BLOCKED_DOMAINS = new Set([
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'tempmail.com',
  'yopmail.com',
  'trashmail.com',
  'dispostable.com',
  'fakeinbox.com',
  'temp-mail.org',
  'sharklasers.com',
  'maildrop.cc',
])

const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 8

type RateState = { count: number; resetAt: number }

declare global {
  // eslint-disable-next-line no-var
  var __contactRateLimitStore: Map<string, RateState> | undefined
}

const rateLimitStore = globalThis.__contactRateLimitStore ?? new Map<string, RateState>()
globalThis.__contactRateLimitStore = rateLimitStore

function extractClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return req.ip || 'unknown'
}

function isRateLimited(key: string): boolean {
  // Keep local development friction-free while testing the form.
  if (process.env.NODE_ENV !== 'production') return false

  const now = Date.now()
  const state = rateLimitStore.get(key)

  if (!state || now > state.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (state.count >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }

  state.count += 1
  rateLimitStore.set(key, state)
  return false
}

function validatePayload(payload: ContactPayload) {
  const name = (payload.name || '').trim()
  const email = (payload.email || '').trim().toLowerCase()
  const message = (payload.message || '').trim()
  const company = (payload.company || '').trim()

  if (company) {
    return { ok: false, reason: 'Blocked by spam filter.' }
  }

  if (name.length < 2 || name.length > 80) {
    return { ok: false, reason: 'Please enter a valid name.' }
  }

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return { ok: false, reason: 'Please enter a valid email address.' }
  }

  const domain = email.split('@')[1] || ''
  if (BLOCKED_DOMAINS.has(domain)) {
    return { ok: false, reason: 'Please use a permanent email address.' }
  }

  if (message.length < 10 || message.length > 2000) {
    return { ok: false, reason: 'Message must be between 10 and 2000 characters.' }
  }

  return { ok: true, name, email, message }
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false

  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)
  body.set('remoteip', ip)

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    cache: 'no-store',
  })

  if (!response.ok) return false
  const result = (await response.json()) as { success?: boolean }
  return Boolean(result.success)
}

async function sendViaSmtp({
  name,
  email,
  message,
}: {
  name: string
  email: string
  message: string
}) {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const secure = String(process.env.SMTP_SECURE || 'false') === 'true'
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const to = process.env.CONTACT_FORM_EMAIL || process.env.SMTP_TO
  const from = process.env.SMTP_FROM || user

  if (!host || !user || !pass || !to || !from) {
    return {
      ok: false as const,
      message:
        'Email is not configured yet. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and CONTACT_FORM_EMAIL.',
    }
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  })

  await transporter.sendMail({
    from,
    to,
    replyTo: email,
    subject: `New Contact Form Submission - ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br/>')}</p>`,
  })

  return { ok: true as const }
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as ContactPayload
    const validation = validatePayload(payload)

    if (!validation.ok) {
      return NextResponse.json({ success: false, message: validation.reason }, { status: 400 })
    }

    const ip = extractClientIp(req)
    const rateKey = `${ip}:${validation.email}`
    if (isRateLimited(rateKey)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const turnstileOk = await verifyTurnstile(payload.turnstileToken || '', ip)
    if (!turnstileOk) {
      return NextResponse.json(
        { success: false, message: 'Security verification failed. Please try again.' },
        { status: 400 }
      )
    }

    const smtpResult = await sendViaSmtp({
      name: validation.name,
      email: validation.email,
      message: validation.message,
    })

    if (smtpResult.ok) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      {
        success: false,
        message: smtpResult.message,
      },
      { status: 500 }
    )
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Unexpected error while sending message. Check server logs for details.',
      },
      { status: 500 }
    )
  }
}
