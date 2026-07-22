# Official options for displaying X posts

_Checked against first-party X documentation on July 21, 2026._

## Recommendation

Use **X for Websites embedded posts** for the three curated posts, not X API v2. Load X's official `https://platform.x.com/widgets.js` once, render each known post ID with the documented `twttr.widgets.createTweet()` factory, and retain an accessible “View on X” link when the widget cannot load. X explicitly recommends embedded posts for online display because they handle author attribution, actions, media, edits, and current X data without OAuth ([Embedded Posts](https://docs.x.com/x-for-websites/embedded-posts/overview), [Display requirements](https://docs.x.com/developer-terms/display-requirements)).

For this site, that is the smallest official integration: no developer account, bearer token, billing balance, or custom reproduction of X's post UI. It should replace the current hand-built link tiles in `components/sharing-nates-story.tsx`. The installed `react-tweet` package is not needed for this route.

Use `dnt=true`/the equivalent widget option and disclose the embed in the privacy notice. This reduces use for personalized suggestions and ads, but it does not make the widget first-party or stop all data from reaching X ([oEmbed parameters](https://docs.x.com/x-for-websites/oembed-api), [X for Websites privacy](https://help.x.com/en/x-for-websites-ads-info-and-privacy)).

## Comparison

| Consideration | X for Websites (`widgets.js`, factory, or oEmbed) | X API v2 plus custom cards |
| --- | --- | --- |
| Official status | X's first-party display product and its recommended online-display path ([docs](https://docs.x.com/x-for-websites/embedded-posts/overview)) | Official data API, but the site owns the rendering and must follow X's detailed display rules ([requirements](https://docs.x.com/developer-terms/display-requirements)) |
| Authentication | None. The official oEmbed endpoint requires no authentication and is documented as not rate limited ([oEmbed](https://docs.x.com/x-for-websites/oembed-api)) | Developer account/app plus a secret app-only Bearer Token for public read access; the token must stay server-side ([app-only auth](https://docs.x.com/fundamentals/authentication/oauth-2-0/application-only)) |
| Cost and limits | No API usage charge is documented for embeds/oEmbed | Pay-per-use credits. As of this check, a Post read is **$0.005 per resource**; pay-per-use access has a **2 million Post-read monthly cap** ([pricing](https://docs.x.com/x-api/getting-started/pricing), [usage and billing](https://docs.x.com/x-api/fundamentals/post-cap)). `GET /2/tweets` allows up to 100 IDs and is limited to 3,500 app requests per 15 minutes ([lookup](https://docs.x.com/x-api/posts/get-posts-by-ids), [rate limits](https://docs.x.com/x-api/fundamentals/rate-limits)). Pricing can change, so the Developer Console remains authoritative. |
| Visual control | Limited to supported theme, width/alignment, media/thread, language, and privacy options. The rendered post remains recognizably X. | Full layout control, but author, avatar, handle, timestamp, X logo, links, post actions or “View on X,” edits, and unmodified text must comply with X's requirements. Media/authors require fields and expansions. |
| Performance | Adds a third-party script and X-rendered frame/content; can cause layout shift unless space is reserved. Content blockers, CSP, or an X outage may prevent rendering. | Can be server-rendered and cached with no X script in the browser. Adds a server fetch, credential/billing failure modes, data normalization, and ongoing rendering maintenance. |
| Privacy | X may receive the visited page, IP address, browser/OS, and cookie information. `dnt=true` opts the embed out of uses including personalized suggestions and ads, but X still requires appropriate notice/consent where applicable ([privacy](https://help.x.com/en/x-for-websites-ads-info-and-privacy), [developer policy](https://docs.x.com/developer-terms/policy)). | Server-side API fetch avoids sending every visitor's page-view details to `widgets.js`; direct X media requests may still contact X domains. The site must protect the bearer token and govern cached X content. |
| Deleted/protected posts | X's widget fetches current X data. Keep a neutral link-only fallback, not a copied post body, so unavailable content is not preserved if rendering fails. This fallback recommendation is an inference from X's current-data and removal rules. | Single lookup returns 404; batch lookup omits an unavailable post and includes an error. The card must be removed, and X policy requires custom displays to remove unavailable content promptly ([lookup behavior](https://docs.x.com/x-api/posts/lookup/integrate), [developer policy](https://docs.x.com/developer-terms/policy)). |

## Suggested Next.js shape

1. Create a small client-side `XPostEmbed` component around the official factory function.
2. Load `https://platform.x.com/widgets.js` once with `next/script`, then call `twttr.widgets.createTweet(postId, container)` when ready ([official factory guidance](https://docs.x.com/x-for-websites/embedded-posts/overview)).
3. Apply supported dark/light styling and the do-not-track option; reserve an approximate minimum height to reduce layout shift.
4. Start with a skeleton, then show a plain post permalink if the script is blocked, times out, or the post is unavailable. Do not cache or reproduce post text in the fallback.
5. Update the site's privacy notice and cookie/consent handling as appropriate before production release.

`publish.x.com/oembed` is also official and useful when a CMS or server needs HTML from a post URL. It is unnecessary overhead for three post IDs already known in source; if used, request `omit_script=true` and load `widgets.js` only once ([oEmbed](https://docs.x.com/x-for-websites/oembed-api)).

## When API v2 would be worth it

Choose API v2 only if campaign-styled, server-rendered cards and avoiding client-side X tracking are more important than implementation cost. Batch the three IDs in one server request, request only the author/media fields needed, cache briefly, treat partial `errors` as removals, and fall back to links when credentials, credits, rate limits, or X availability fail. X strongly encourages embeds, so custom rendering should be treated as a maintained integration rather than a simpler official embed.
