// Manual verification helper. Copies current content and restores only the old
// Google font integration, using pinned original bytes instead of the network.
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const sourceRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
const destination = process.argv[2] && path.resolve(process.argv[2])
if (!destination || fs.existsSync(destination) || destination.startsWith(sourceRoot + path.sep)) {
  throw new Error('Provide a new directory outside the repository, e.g. /private/tmp/nate-font-baseline')
}
const skip = new Set(['.git', 'node_modules', '.next', '.entire', '.codex', '.claude', '.vercel',
  'output', 'video-sources', 'test-results', 'playwright-report', '.playwright-cli'])
fs.cpSync(sourceRoot, destination, { recursive: true, filter: entry => {
  const relative = path.relative(sourceRoot, entry)
  return !relative.split(path.sep).some(part => skip.has(part) || part.startsWith('.env'))
}})
const layoutFile = path.join(destination, 'app/layout.tsx')
let layout = fs.readFileSync(layoutFile, 'utf8')
if (!layout.includes('className="campaign-fonts"')) throw new Error('Layout changed; review baseline transformation.')
layout = layout.replace('import { fontPreloads } from "@/lib/font-preloads"', 'import { Lilita_One, Work_Sans } from "next/font/google"')
  .replace('import "./fonts.css"\n', '')
const headStart = layout.indexOf('      <head>\n        {fontPreloads.map(')
const headEnd = layout.indexOf('      </head>\n', headStart)
if (headStart < 0 || headEnd < 0) throw new Error('Font preload block changed; review baseline transformation.')
layout = layout.slice(0, headStart) + layout.slice(headEnd + '      </head>\n'.length)
layout = layout.replace('className="campaign-fonts"', 'className={`${lilitaOne.variable} ${workSans.variable}`}')
layout = layout.replace('/* ---------- Viewport', `const lilitaOne = Lilita_One({ subsets: ["latin"], weight: "400", variable: "--font-lilita-one" })
const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-work-sans" })

/* ---------- Viewport`)
fs.writeFileSync(layoutFile, layout)
const sourceDir = path.join(destination, 'scripts/font-sources')
const manifest = JSON.parse(fs.readFileSync(path.join(sourceDir, 'manifest.json'), 'utf8'))
const originals = Object.fromEntries(Object.entries(manifest.files).map(([file, item]) => [item.originalFile, path.join(sourceDir, file)]))
const css = fs.readFileSync(path.join(sourceDir, 'original.css'), 'utf8')
const mock = {}
for (const [family, query, subsets] of [
  ['Lilita One', 'Lilita+One:wght@400', ['latin-ext', 'latin']],
  ['Work Sans', 'Work+Sans:wght@100..900', ['vietnamese', 'latin-ext', 'latin']],
]) {
  const faces = [...css.matchAll(/@font-face\{[^}]+\}/g)].map(match => match[0])
    .filter(face => face.includes(`font-family:${family};`))
  if (faces.length !== subsets.length) throw new Error('Original font source CSS changed.')
  mock[`https://fonts.googleapis.com/css2?family=${query}&display=swap`] = faces.map((face, i) =>
    `/* ${subsets[i]} */\n` + face.replace(/url\(\/_next\/static\/media\/([^)]*)\)/g, (_, name) => `url(${originals[name]})`)
      .replace('{', '{\n  ').replaceAll(';', ';\n  ').replace('src:', 'src: ')).join('\n')
}
const mockFile = path.join(destination, '.font-baseline-google.cjs')
fs.writeFileSync(mockFile, 'module.exports = ' + JSON.stringify(mock, null, 2) + '\n')
console.log(JSON.stringify({ destination, mockFile, next: 'Install locked dependencies, build with NEXT_FONT_GOOGLE_MOCKED_RESPONSES set to mockFile, then start on port 3211.' }, null, 2))
