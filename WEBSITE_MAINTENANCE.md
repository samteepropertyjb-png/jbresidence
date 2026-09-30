# Website Maintenance — The JB Residence

Last audited: 2026-09-30

## Current architecture

### Confirmed

- Static HTML, CSS and JavaScript site in `jbresidence-site/`.
- Public content is served from root pages plus `articles/` and `projects/`.
- Git remote is `https://github.com/samteepropertyjb-png/jbresidence.git`; `main` is the tracked production branch.
- Repository deployment files visible here are `_headers`, `_redirects`, `robots.txt` and `sitemap.xml`.
- Google Tag Manager is loaded on public pages. WhatsApp is the preferred conversion path. There is no public form in the current `main.js`.
- `robots.txt` allows crawling and references `https://thejbresidence.com/sitemap.xml`.

### Needs verification

- The hosting/deployment provider, DNS, SSL certificate and CDN configuration are not proven by this repository.
- Field Core Web Vitals, real-user performance data, crawl errors and Search Console coverage require external tools.
- Compression, server cache behaviour and HTTP-to-HTTPS redirects require a live deployment check.
- An older `js/main-v3.98.js` includes a Formspree form template. Confirm whether any live page still uses that older bundle before removing it.

## Baseline audit findings

### Measured in the repository

- 87 HTML files were scanned. Indexable page templates have title, description, canonical and one H1 checks; the exceptions are the intentional `404.html`, `project.html` template and `articles/_shared.html` partial.
- The sitemap contains 84 URLs and no sitemap URL pointed to a missing local HTML file at audit time.
- `robots.txt` does not block the site. `_headers` keeps `/project` and the article shared partial out of search.
- No API keys, tokens, passwords or HTTP subresources were found by a source scan. No public form exists in the current `main.js` bundle.
- The largest local image assets are Forest City files between roughly 4 MB and 15 MB. They are an optimisation opportunity, but were not bulk-converted because visual quality and live usage need review first.

### Code-level observations, not field measurements

- Multiple historic JavaScript cache-version query strings and the older `main-v3.98.js` remain in use across pages. Consolidate only after confirming each page&rsquo;s live behaviour.
- Many property pages use image-heavy layouts. Verify dimensions, lazy loading and LCP behaviour in a browser before changing image markup broadly.
- No Core Web Vitals pass/fail result is available from this repository.

## Technical SEO requirements

- Every indexable page needs one descriptive title, meta description, canonical URL and one H1.
- Keep canonical URLs, sitemap URLs and internal links consistent. Do not create trailing-slash or `.html` duplicates without an explicit redirect plan.
- Keep `robots.txt` open to important content and keep the sitemap current. Do not block search or AI crawlers casually.
- Add Article, BreadcrumbList or FAQPage schema only when the visible page content genuinely supports it. Never add fake reviews, prices or FAQs.
- Use HTTPS for third-party resources and descriptive alt text for meaningful images.

## Performance requirements

- Treat LCP, INP and CLS as **not measured** until field or lab data is collected.
- Keep the hero image relevant and reasonably sized. Use `loading="lazy"` for below-the-fold content images where it does not delay the visible hero.
- Avoid adding duplicate JavaScript bundles, unnecessary third-party scripts or large uncompressed images.
- Before bulk image conversion, measure file sizes and visually review a small representative set. Do not trade away property-photo quality blindly.

## Security requirements

- Browser-delivered HTML and JavaScript are public. Never put credentials, API keys, tokens or private configuration in them.
- Current safe response headers in `_headers`: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` and `X-Frame-Options`.
- Do not add HSTS, a Content-Security-Policy, DNS changes, SSL changes or hosting changes without live testing and explicit approval. A CSP must account for GTM, image providers, WhatsApp and any approved embedded media.
- Keep external scripts and resources on HTTPS. Review any new third-party script before adding it.
- If a public form is introduced, do not use a bare public POST endpoint. Require server-side validation, rate limiting, a honeypot and appropriate bot protection (such as Turnstile/CAPTCHA), plus abuse monitoring.

## Monthly checks

1. Pull `origin/main`; confirm a clean working tree before edits.
2. Check Search Console coverage, sitemap processing, Core Web Vitals and the top organic landing pages.
3. Test representative mobile and desktop pages: home, an article, an area hub and a project page.
4. Check broken internal links, accidental `noindex`, title/H1 duplicates and sitemap paths.
5. Check for exposed credentials, new HTTP resources, unexpected forms and unfamiliar third-party scripts.
6. Review the largest new image assets before publishing.

## Post-deployment checks

1. Confirm the expected commit is on `origin/main` and the working tree is clean.
2. Fresh-load the changed live URL and confirm the canonical, title, H1, links and images.
3. Confirm `robots.txt`, sitemap and relevant redirects still resolve.
4. Check browser console errors and mobile horizontal overflow on the changed pages.
5. Record material technical findings here or in `SEO_WORKLOG.md` without overwriting historical baselines.

## Do not change casually

- DNS, nameservers, hosting, deployment provider, SSL, routing architecture or analytics setup.
- Ranking URLs, sitemap URL patterns, canonical strategy or crawler policy.
- CSP, HSTS, cache-control policy, GTM or WhatsApp conversion configuration.
- Bulk image conversion or deletion of legacy JavaScript until live usage is verified.
