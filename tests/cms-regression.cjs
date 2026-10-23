// Run against localhost after npm run dev. Uses only uniquely named disposable records.
const fs = require('fs');
const assert = require('node:assert/strict');
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw Error('Local test server required');
const slug = 'qa-regression-' + Date.now();
const targets = ['projects', 'eca'].map(category => `data/${category}/${slug}.json`);
const seed = {slug, title:'QA regression', description:'Disposable fixture', date:'2026-10-18', tags:[], featured:false, category:'projects', images:['existing.jpg'], attachments:[], fullText:'Original source', aiContent:'Original body', importance:0};
async function save(overrides = {}, attachment) {
  const form = new FormData();
  for (const [key, value] of Object.entries({...seed, tags:'', editSlug:slug, oldCategory:'projects', ...overrides})) form.set(key, String(value));
  if (attachment) form.append('files', new Blob(['new attachment']), attachment);
  const response = await fetch(base + '/api/upload', {method:'POST', body:form});
  return {status:response.status, data:await response.json()};
}
(async () => {
  try {
    fs.writeFileSync(targets[0], JSON.stringify(seed));
    assert.equal((await save({title:'Renamed'})).data.slug, slug);
    let result = await save({}, 'new.txt'); assert.equal(result.status, 200);
    let stored = JSON.parse(fs.readFileSync(targets[0]));
    assert.equal(stored.images.length, 1); assert.equal(stored.attachments.length, 1); assert.equal(stored.aiContent, seed.aiContent);
    assert.equal((await save({}, 'new.txt')).status, 409);
    result = await save({category:'eca'}); assert.equal(result.status, 200);
    stored = JSON.parse(fs.readFileSync(targets[1]));
    assert.equal(stored.images[0], `/images/projects/${slug}/existing.jpg`);
    assert.equal(stored.attachments.length, 1); assert.equal(stored.fullText.includes('Original source'), true);
    assert.equal((await save({category:'eca',oldCategory:'eca',title:''})).status, 400);
    assert.equal((await save({category:'invalid'})).status, 400);
    assert.equal((await fetch(base+'/api/items/site/home')).status, 400);
    const deleted=await fetch(base+`/api/items/eca/${slug}`,{method:'DELETE'}); assert.equal(deleted.status,200);
    assert.equal(fs.existsSync(`public/images/projects/${slug}/new.txt`),true);
    console.log('PASS: stable URL, appended media/body, collision protection, category move, validation, delete retains media');
  } finally {
    for (const file of targets) if(fs.existsSync(file))fs.unlinkSync(file);
    const media = `public/images/projects/${slug}/new.txt`;
    if(fs.existsSync(media))fs.unlinkSync(media);
    for (const category of ['projects','eca']) { const dir=`public/images/${category}/${slug}`; if(fs.existsSync(dir)&&fs.readdirSync(dir).length===0)fs.rmdirSync(dir); }
  }
})().catch(error => {console.error(error);process.exitCode=1;});
