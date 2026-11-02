const assert = require('node:assert/strict');
const base = process.env.QA_BASE_URL || 'http://localhost:3010';
(async () => {
  const response = await fetch(base + '/projects/webgis-utility-management-system-unified-june-1-2024');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert(!html.includes('<title></title>'), 'SVG titles must not lose their text during server rendering');
  const tooltips = [...html.matchAll(/<g><title>(.*?)<\/title>/g)].map(match => match[1]);
  assert(tooltips.length > 0 && tooltips.every(text => text.trim().length > 0), 'Bar tooltips render as single text values');
  assert(html.includes('aria-label="Survey charts"'), 'Survey data is included in the server HTML');
  console.log('PASS: survey charts and nonempty SVG tooltip titles are server-rendered');
})().catch(error => { console.error(error); process.exitCode = 1; });
