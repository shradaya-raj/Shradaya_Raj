// Integration test: production contact API -> local SMTP sink. No external email.
const assert = require('node:assert/strict');
const net = require('node:net');
const { spawn } = require('node:child_process');
const messages = [];
const recipients = [];
const smtp = net.createServer(socket => {
  socket.setEncoding('utf8');
  socket.write('220 localhost QA SMTP\r\n');
  let buffer = '', data = false, message = [];
  socket.on('data', chunk => {
    buffer += chunk;
    while (buffer.includes('\n')) {
      const end = buffer.indexOf('\n'), line = buffer.slice(0, end).replace(/\r$/, '');
      buffer = buffer.slice(end + 1);
      if (data) {
        if (line === '.') { messages.push(message.join('\n')); message = []; data = false; socket.write('250 Queued locally\r\n'); }
        else message.push(line.replace(/^\.\./, '.'));
      } else if (/^EHLO|^HELO/i.test(line)) socket.write('250-localhost\r\n250 AUTH PLAIN\r\n');
      else if (/^AUTH/i.test(line)) socket.write('235 Authentication successful\r\n');
      else if (/^DATA/i.test(line)) { data = true; socket.write('354 End with dot\r\n'); }
      else if (/^QUIT/i.test(line)) { socket.end('221 Bye\r\n'); }
      else { if (/^RCPT TO:/i.test(line)) recipients.push(line); socket.write('250 OK\r\n'); }
    }
  });
});
let app;
(async () => {
  await new Promise(resolve => smtp.listen(0, '127.0.0.1', resolve));
  app = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', '3011', '-H', '127.0.0.1'], {
    stdio: 'ignore', env: { ...process.env, NEXT_DIST_DIR: '.next-quality', NODE_ENV: 'production', SMTP_HOST: '127.0.0.1', SMTP_PORT: String(smtp.address().port), SMTP_SECURE: 'false', SMTP_USER: 'sender@example.test', SMTP_PASS: 'local-test-fixture', SMTP_FROM: 'sender@example.test', CONTACT_FORM_EMAIL: 'receiver@example.test', TURNSTILE_SECRET_KEY: '' }
  });
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (app.exitCode !== null) throw Error('QA production server exited; check port 3011 is free.');
    try { ready = (await fetch('http://127.0.0.1:3011/api/contact/health')).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert(ready, 'QA production server became ready');
  const response = await fetch('http://127.0.0.1:3011/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'QA <verify>', email: 'visitor@example.test', message: 'Local delivery check & <test>', company: '' }) });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(messages.length, 1);
  assert(recipients.some(line => line.includes('receiver@example.test')), 'Uses configured recipient');
  assert.match(messages[0], /Reply-To: visitor@example\.test/i);
  assert.match(messages[0], /&lt;test&gt;/);
  console.log('PASS: production contact API delivers to local SMTP, uses configured recipient/Reply-To, and escapes HTML. No external email sent.');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => {
  app?.kill();
  smtp.close();
});
