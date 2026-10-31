// Run: node tests/backdrop-hydration.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const code = ts.transpileModule(fs.readFileSync('src/components/CinematicBackdrop.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function render(math) {
  const exports = {};
  vm.runInNewContext(code, { exports, require, Math: math });
  return renderToStaticMarkup(React.createElement(exports.default));
}

const slightlyDifferentMath = Object.create(Math);
slightlyDifferentMath.sin = value => Math.sin(value) * (1 + 1e-15);
slightlyDifferentMath.exp = value => Math.exp(value) * (1 - 1e-15);
const server = render(Math);
const browser = render(slightlyDifferentMath);
assert.equal(server, browser, 'Tiny cross-runtime math differences must not change SVG markup');
assert.equal((server.match(/<polygon /g) || []).length, 128);
assert.match(server, /fill-opacity="0\.0434"/);
assert.ok(!server.includes('0.043413423666285'), 'Full-precision opacity must not leak into markup');
console.log('PASS: 128 terrain faces and point-cloud markup remain identical with simulated floating-point drift.');
