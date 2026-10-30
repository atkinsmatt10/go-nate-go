/* eslint-disable @typescript-eslint/no-unused-expressions -- Playwright CLI evaluates this function expression. */
async (page) => {
  // Run through Playwright CLI. Both URLs must be production builds from the
  // same source/content/dependencies; only the font patch may differ.
  const builds = { before: 'http://localhost:3211', after: 'http://localhost:3215' }
  const output = 'output/playwright/font-optimization/final'
  const specimen = "<main id=\"font-specimen\" style=\"background:white;color:#223b54;padding:32px;max-width:none;width:100%;box-sizing:border-box\">\n<h1 style=\"font-size:44px;font-weight:400\">Nate\u2019s story \u2014 \u201cHope\u201d \u2026 May 9, 2026</h1>\n<p>Work Sans regular \u00b7 AVATAR To WA fi ffi fl ff 0123456789 $7,543.00</p>\n<p><em>Italics are synthesized <strong>and bold inside italics stays bold</strong></em></p>\n<code>const caf\u00e9 = &quot;Hello, world&quot;; [0, 1, 2] // system monospace</code>\n<pre>const total = 7543;\nconsole.log(total);</pre>\n<p style=\"font-family:var(--font-lilita-one);font-size:26px;font-weight:400\">Component override \u00b7 Merci, caf\u00e9, No\u00ebl \u2014 \u00c1V\u00c9, T\u00f3, W\u00e9, \u010ca, \u0141\u00f3d\u017a</p>\n<p style=\"font-family:var(--font-lilita-one);font-size:26px;font-weight:700\"><em>Display italic <b>synthetic bold 700</b></em> \u00c1\u00c9\u0130\u0106\u014c</p>\n<p style=\"font-weight:400;font-size:14px;line-height:1.5;margin:12px 0\">400/14px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:400;font-size:18px;line-height:1.5;margin:12px 0\">400/18px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:400;font-size:28px;line-height:1.5;margin:12px 0\">400/28px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:500;font-size:14px;line-height:1.5;margin:12px 0\">500/14px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:500;font-size:18px;line-height:1.5;margin:12px 0\">500/18px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:500;font-size:28px;line-height:1.5;margin:12px 0\">500/28px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:600;font-size:14px;line-height:1.5;margin:12px 0\">600/14px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:600;font-size:18px;line-height:1.5;margin:12px 0\">600/18px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:600;font-size:28px;line-height:1.5;margin:12px 0\">600/28px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:700;font-size:14px;line-height:1.5;margin:12px 0\">700/14px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:700;font-size:18px;line-height:1.5;margin:12px 0\">700/18px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p style=\"font-weight:700;font-size:28px;line-height:1.5;margin:12px 0\">700/28px: AV\u00c9 To\u00f1 W\u00e9 \u017b\u00f3\u0142\u0107 \u0100\u0101 \u010c\u010d \u0141\u0142 \u0152\u0153 \u015e\u015f \u017f \u2153 caf\u00e9 na\u00efve r\u00e9sum\u00e9 fi ff ffi 888 85%</p><p>\u4e2d\u6587 \u65e5\u672c\u8a9e \ud55c\uad6d\uc5b4 \u2014 system fallback remains unchanged</p>\n<p>Common punctuation: \u201ccurly\u201d \u2018quotes\u2019 \u2013 dash \u2014 em dash \u2026 ellipsis \u00b7 \u00a9</p>\n<p style=\"width:140px;hyphens:auto;line-height:1.5\">antidisestablishmentarianism extraordinary representation</p>\n<p>Explicit U+2010: well\u2010being; soft hyphen: extra&shy;ordinary; combining: e\u0301 C\u030c a\u0308</p>\n<p style=\"font-family:Work Sans,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;font-weight:600\">Inline component font settings \u00b7 Label 600</p><p style=\"font-weight:600;font-size:18px\"><em>Semibold italics <strong>with nested bolder at 900</strong></em></p></main>"
  const browser = page.context().browser()
  const cases = [
    { id: 'home', path: '/' },
    { id: 'birthday', path: '/birthday' },
    { id: 'donate', path: '/donate' },
    { id: 'return-missing', path: '/donate/return' },
    { id: 'return-session-error', path: '/donate/return?session_id=font-test' },
    { id: 'return-intent-error', path: '/donate/return?payment_intent=font-test' },
    { id: 'not-found', path: '/missing-font-test' },
    { id: 'specimen', path: '/birthday', html: specimen },
    { id: 'latin1', path: '/birthday', html: '<main style="padding:32px;background:white;color:#223b54"><h1>Merci, café, Noël</h1><p>À bientôt — naïve résumé. <em>Italics <strong>and bold</strong></em></p></main>' },
    { id: 'extended-display', path: '/birthday', html: '<main style="padding:32px;background:white;color:#223b54"><h1>Łódź — Šimon</h1><p>ASCII body</p></main>' },
    { id: 'extended-work', path: '/birthday', html: '<main style="padding:32px;background:white;color:#223b54"><h1>Extended body</h1><p>Āā Čč Łł Żółć Œœ Şş ſ</p></main>' },
    { id: 'cjk', path: '/birthday', html: '<main style="padding:32px;background:white;color:#223b54"><h1>中文 日本語 한국어</h1><p>中文 日本語 한국어</p><code>const n = 123;</code></main>' },
  ]
  const viewports = [
    { id: 'desktop', viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 },
    { id: 'mobile', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 },
  ]
  const result = { builds, browser: browser.version(), cases: [] }
  for (const viewport of viewports) {
    for (const entry of cases) {
      for (const [version, base] of Object.entries(builds)) {
        const context = await browser.newContext({ viewport: viewport.viewport,
          deviceScaleFactor: viewport.deviceScaleFactor, reducedMotion: 'reduce',
          locale: 'en-US', timezoneId: 'America/New_York', colorScheme: 'light' })
        const target = await context.newPage()
        // Freeze optional social providers in their existing first-party fallback
        // state; their asynchronous iframes are not controlled by these fonts.
        await target.addInitScript(() => {
          const NativeObserver=window.IntersectionObserver
          window.IntersectionObserver=class extends NativeObserver {
            constructor(callback,options){super((entries,observer)=>callback(entries.filter(e=>e.target.id!=='social-media'),observer),options)}
          }
        })
        await context.route('**/api/stripe/**', route => route.fulfill({status:400,json:{error:'Font verification: no payment'}}))
        await context.route('**/api/birthday-photos', route => route.fulfill({json:{photos:[]}}))
        await context.route('**/api/donations', route => route.fulfill({json:{total:7543,goal:30000,numDonations:66,stale:false,lastUpdated:'2026-10-29T12:00:00Z'}}))
        // Providers are not part of the font comparison. The site already defers
        // its video/social embeds. No real checkout or third-party messages.
        await context.route(/https:\/\/(?:js\.stripe\.com|r\.stripe\.com|m\.stripe\.network)\//, route => route.abort())
        const cdp = await context.newCDPSession(target)
        const networkFonts=[]
        cdp.on('Network.responseReceived',event=>{if(event.type==='Font'){const headers=event.response.headers;networkFonts.push({file:new URL(event.response.url).pathname,bytes:Number(headers['Content-Length']??headers['content-length']??0),status:event.response.status,fromDiskCache:!!event.response.fromDiskCache})}})
        await cdp.send('Network.enable')
        await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
        await target.goto(base + entry.path, { waitUntil: 'load' })
        await target.evaluate(()=>document.fonts.ready)
        await target.waitForTimeout(300)
        if (entry.html) {
          await target.evaluate(html => {document.body.innerHTML=html;document.body.style.margin='0'}, entry.html)
        } else {
          if(entry.id==='home'){await target.locator('footer img').evaluateAll(images=>images.forEach(img=>{const candidates=img.srcset.split(',').map(s=>s.trim()).filter(Boolean);if(candidates.length)img.srcset=candidates[candidates.length-1]}));await target.locator('#donate').scrollIntoViewIfNeeded();await target.getByLabel('$7,543 raised',{exact:true}).waitFor({state:'visible',timeout:15000})}
          // Trigger lazy images and reveal interactions throughout the page.
          await target.evaluate(async()=>{
            for(let y=0;y<document.body.scrollHeight;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}
            window.scrollTo(0,0)
            await Promise.race([Promise.all([...document.images].filter(img=>img.getBoundingClientRect().width>0).map(img=>img.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,4000))])
          })
        }
        await target.evaluate(()=>document.fonts.ready)
        await target.waitForTimeout(1800)
        const screenshot = `${output}/${entry.id}-${viewport.id}-${version}.png`
        await target.screenshot({path:screenshot,fullPage:true,animations:'disabled'})
        const metrics = await target.evaluate(()=>({
          text:document.body.innerText,
          preloads:[...document.querySelectorAll('link[as="font"]')].map(x=>new URL(x.href).pathname),
          fontFaces:[...document.fonts].map(f=>({family:f.family,weight:f.weight,style:f.style,display:f.display,status:f.status,range:f.unicodeRange})),
          images:[...document.images].map(i=>({src:i.currentSrc,srcset:i.srcset,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight})),
          dimensions:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},
          textStyles:[...document.querySelectorAll('h1,h2,h3,p,code,pre,strong,em,button,a')].filter(e=>e.textContent.trim()).map(e=>{
            const s=getComputedStyle(e);const r=e.getBoundingClientRect();return {text:e.textContent,tag:e.tagName,font:s.fontFamily,weight:s.fontWeight,style:s.fontStyle,features:s.fontFeatureSettings,variation:s.fontVariationSettings,hyphens:s.hyphens,x:r.x,y:r.y,w:r.width,h:r.height}
          })
        }))
        result.cases.push({id:entry.id,viewport:viewport.id,deviceScaleFactor:viewport.deviceScaleFactor,version,screenshot,...metrics,fonts:networkFonts})
        await context.close()
      }
    }
  }
  return result
}
