// Contact API security + SMTP integration tests.
// Uses a local SMTP sink and a local Turnstile Siteverify mock. No real Cloudflare or external email.
const assert = require('node:assert/strict');
const http = require('node:http');
const net = require('node:net');
const { spawn } = require('node:child_process');

const messages = [];
const recipients = [];
let siteverifyHits = 0;
let siteverifyMode = 'token'; // 'token' | 'http-fail'

function resetMail() {
  messages.length = 0;
  recipients.length = 0;
}

const smtp = net.createServer(socket => {
  socket.setEncoding('utf8');
  socket.write('220 localhost QA SMTP\r\n');
  let buffer = '', data = false, message = [];
  socket.on('data', chunk => {
    buffer += chunk;
    while (buffer.includes('\n')) {
      const end = buffer.indexOf('\n');
      const line = buffer.slice(0, end).replace(/\r$/, '');
      buffer = buffer.slice(end + 1);
      if (data) {
        if (line === '.') {
          messages.push(message.join('\n'));
          message = [];
          data = false;
          socket.write('250 Queued locally\r\n');
        } else {
          message.push(line.replace(/^\.\./, '.'));
        }
      } else if (/^EHLO|^HELO/i.test(line)) {
        socket.write('250-localhost\r\n250 AUTH PLAIN\r\n');
      } else if (/^AUTH/i.test(line)) {
        socket.write('235 Authentication successful\r\n');
      } else if (/^DATA/i.test(line)) {
        data = true;
        socket.write('354 End with dot\r\n');
      } else if (/^QUIT/i.test(line)) {
        socket.end('221 Bye\r\n');
      } else {
        if (/^RCPT TO:/i.test(line)) recipients.push(line);
        socket.write('250 OK\r\n');
      }
    }
  });
});

const siteverify = http.createServer((req, res) => {
  siteverifyHits += 1;
  if (siteverifyMode === 'http-fail') {
    res.writeHead(502, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ success: false }));
    return;
  }
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const params = new URLSearchParams(body);
    const token = params.get('response') || '';
    const ok = token === 'valid-token';
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ success: ok }));
  });
});

function baseEnv(smtpPort, siteverifyPort, extras = {}) {
  return {
    ...process.env,
    NEXT_DIST_DIR: '.next-quality',
    NODE_ENV: 'production',
    SMTP_HOST: '127.0.0.1',
    SMTP_PORT: String(smtpPort),
    SMTP_SECURE: 'false',
    SMTP_USER: 'sender@example.test',
    SMTP_PASS: 'local-test-fixture',
    SMTP_FROM: 'sender@example.test',
    CONTACT_FORM_EMAIL: 'receiver@example.test',
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'test-site-key',
    TURNSTILE_SECRET_KEY: 'test-secret-key',
    TURNSTILE_SITEVERIFY_URL: `http://127.0.0.1:${siteverifyPort}/siteverify`,
    ...extras,
  };
}

async function waitReady(port, app) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (app.exitCode !== null) throw Error(`QA server on ${port} exited early`);
    try {
      const health = await fetch(`http://127.0.0.1:${port}/api/contact/health`);
      if (health.ok) return;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  throw Error(`QA server on ${port} did not become ready`);
}

async function postContact(port, body) {
  const response = await fetch(`http://127.0.0.1:${port}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  let json = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }
  return { status: response.status, json };
}

function validPayload(overrides = {}) {
  return {
    name: 'QA Visitor',
    email: 'visitor@example.test',
    message: 'Local delivery check for contact security.',
    company: '',
    turnstileToken: 'valid-token',
    ...overrides,
  };
}

let app;
let appMissing;
(async () => {
  await new Promise(resolve => smtp.listen(0, '127.0.0.1', resolve));
  await new Promise(resolve => siteverify.listen(0, '127.0.0.1', resolve));
  const smtpPort = smtp.address().port;
  const siteverifyPort = siteverify.address().port;

  app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3011', '-H', '127.0.0.1'], {
    stdio: 'ignore',
    env: baseEnv(smtpPort, siteverifyPort),
  });
  await waitReady(3011, app);

  // 1) Successful SMTP + valid mocked Turnstile
  resetMail();
  siteverifyHits = 0;
  siteverifyMode = 'token';
  {
    const { status, json } = await postContact(3011, validPayload({ name: 'QA <verify>', message: 'Local delivery check & <test> ok.' }));
    assert.equal(status, 200);
    assert.equal(json.success, true);
    assert.equal(messages.length, 1);
    assert.ok(siteverifyHits >= 1, 'Siteverify called');
    assert.ok(recipients.some(line => line.includes('receiver@example.test')));
    assert.match(messages[0], /Reply-To: visitor@example\.test/i);
    assert.match(messages[0], /&lt;test&gt;/);
  }

  // 2) Missing Turnstile token — no mail
  resetMail();
  {
    const { status, json } = await postContact(3011, validPayload({ turnstileToken: '' }));
    assert.equal(status, 400);
    assert.equal(json.success, false);
    assert.equal(messages.length, 0);
  }

  // 3) Invalid Turnstile token — no mail
  resetMail();
  {
    const { status, json } = await postContact(3011, validPayload({ turnstileToken: 'bogus-token' }));
    assert.equal(status, 400);
    assert.equal(json.success, false);
    assert.equal(messages.length, 0);
  }

  // 4) Failed Siteverify HTTP — no mail
  resetMail();
  siteverifyMode = 'http-fail';
  {
    const { status, json } = await postContact(3011, validPayload());
    assert.equal(status, 400);
    assert.equal(json.success, false);
    assert.equal(messages.length, 0);
  }
  siteverifyMode = 'token';

  // 5) Filled honeypot — no mail
  resetMail();
  {
    const { status, json } = await postContact(3011, validPayload({ company: 'Acme Bot Ltd' }));
    assert.equal(status, 400);
    assert.match(String(json.message || ''), /spam/i);
    assert.equal(messages.length, 0);
  }

  // 6) Invalid email — no mail
  resetMail();
  {
    const { status, json } = await postContact(3011, validPayload({ email: 'not-an-email' }));
    assert.equal(status, 400);
    assert.equal(messages.length, 0);
  }

  // 7) Too-short message — no mail
  resetMail();
  {
    const { status, json } = await postContact(3011, validPayload({ message: 'short' }));
    assert.equal(status, 400);
    assert.equal(messages.length, 0);
  }

  // 8) SMTP failure (bad host) with valid Turnstile — no successful delivery
  app.kill();
  await new Promise(resolve => setTimeout(resolve, 500));
  app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3011', '-H', '127.0.0.1'], {
    stdio: 'ignore',
    env: baseEnv(smtpPort, siteverifyPort, { SMTP_HOST: '127.0.0.1', SMTP_PORT: '1' }),
  });
  await waitReady(3011, app);
  resetMail();
  {
    const { status, json } = await postContact(3011, validPayload({ email: 'smtp-fail@example.test' }));
    assert.ok(status === 500 || status === 400, `expected SMTP failure status, got ${status}`);
    assert.equal(json.success, false);
    assert.equal(messages.length, 0);
  }

  // 9) Missing production Turnstile configuration — fail closed, no mail
  app.kill();
  await new Promise(resolve => setTimeout(resolve, 500));
  appMissing = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3012', '-H', '127.0.0.1'], {
    stdio: 'ignore',
    env: baseEnv(smtpPort, siteverifyPort, {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: '',
      TURNSTILE_SECRET_KEY: '',
      TURNSTILE_SITEVERIFY_URL: '',
    }),
  });
  await waitReady(3012, appMissing);
  resetMail();
  {
    const { status, json } = await postContact(3012, validPayload());
    assert.equal(status, 503);
    assert.equal(json.success, false);
    assert.equal(messages.length, 0);
  }

  console.log('PASS: contact security tests — Turnstile fail-closed, Siteverify mock, honeypot/validation rejects, SMTP success/failure. No external email or Cloudflare credentials used.');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => {
  app?.kill();
  appMissing?.kill();
  smtp.close();
  siteverify.close();
});
