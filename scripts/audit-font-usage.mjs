import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
const root = process.argv[2] ?? process.cwd()
const require = createRequire(path.join(root, 'package.json'))
const ts = require('typescript')
const sourceFiles = []
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) { if (entry.name !== 'emails') walk(full) }
    else if (/\.(tsx?|css)$/.test(entry.name) && !['app/fonts.css','lib/font-preloads.ts'].includes(path.relative(root,full))) sourceFiles.push(full)
  }
}
for (const folder of ['app', 'components', 'lib', 'hooks']) walk(path.join(root, folder))
const characters = new Set()
const declarations = []
const weights = new Set([400])
const weightClasses = { thin:100, extralight:200, light:300, normal:400, medium:500, semibold:600, bold:700, extrabold:800, black:900 }
for (const file of sourceFiles.sort()) {
  if (['app/fonts.css', 'lib/font-preloads.ts'].includes(path.relative(root, file))) continue
  const text = fs.readFileSync(file, 'utf8')
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true)
  function visit(node) {
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && ['b', 'strong'].includes(node.tagName.getText(source))) weights.add(700)
    if (ts.isStringLiteralLike(node) || ts.isJsxText(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) {
      const decoded = node.text.replace(/&(?:#(x[0-9a-f]+|\d+)|([a-z]+));/gi, (entity, numeric, named) => numeric ? String.fromCodePoint(numeric[0].toLowerCase() === 'x' ? parseInt(numeric.slice(1),16) : Number(numeric)) : ({apos:"'", quot:'"', amp:'&', lt:'<', gt:'>', nbsp:'\u00a0', ndash:'\u2013', mdash:'\u2014', hellip:'\u2026', copy:'\u00a9', reg:'\u00ae', trade:'\u2122', bull:'\u2022', lsquo:'\u2018', rsquo:'\u2019', ldquo:'\u201c', rdquo:'\u201d'}[named] ?? entity))
      for (const ch of decoded) characters.add(ch.codePointAt(0))
      for (const match of decoded.matchAll(/\bfont-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b/g)) weights.add(weightClasses[match[1]])
    }
    ts.forEachChild(node, visit)
  }
  if (!file.endsWith('.css')) visit(source)
  else {
    for (const match of text.matchAll(/content\s*:\s*(["'])(.*?)\1/g)) {
      const value = match[2].replace(/\\([0-9a-f]{1,6})\s?/gi, (_, hex) => String.fromCodePoint(parseInt(hex,16)))
      for (const ch of value) characters.add(ch.codePointAt(0))
    }
  }
  text.split('\n').forEach((line, index) => {
    if (/(?:font(?:Family|Weight|Style|VariationSettings|FeatureSettings|Variant)|font-(?:family|weight|style|variation|feature|variant)|hyphens|hyphens-auto|tabular-nums|proportional-nums|<strong|<b[ >]|<em[ >]|\bitalic\b|font-\[)/.test(line)) declarations.push({ file:path.relative(root, file), line:index+1, text:line.trim() })
    const inline = line.match(/fontWeight\s*:\s*["']?(\d+)/)
    if (inline) weights.add(Number(inline[1]))
    const css = line.match(/font-weight\s*:\s*(\d+)/)
    if (css) weights.add(Number(css[1]))
  })
}
// CSS may insert a hyphen even though it is absent from textContent. Keep it if
// the original face supports it. Source-only marks used in generated CSS count too.
// U+2010 is reported separately: it is a possible CSS side effect, not source text.
const result = { sideEffectCodepoints: [0x2010], sourceFiles:sourceFiles.map(x=>path.relative(root,x)), weights:[...weights].sort((a,b)=>a-b), codepoints:[...characters].sort((a,b)=>a-b), nonAscii:[...characters].filter(x=>x>127).sort((a,b)=>a-b).map(x=>({codepoint:`U+${x.toString(16).toUpperCase().padStart(4,'0')}`, character:String.fromCodePoint(x)})), declarations }
console.log(JSON.stringify(result,null,2))
