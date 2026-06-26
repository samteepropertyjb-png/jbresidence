# The JB Residence — Project Brief for Claude Code

## Overview
- **Site:** https://thejbresidence.com
- **Repo:** https://github.com/samteepropertyjb-png/jbresidence.git
- **Branch:** v2.1
- **Hosting:** Cloudflare Pages (auto-deploys on push)
- **Stack:** Pure HTML, CSS, JavaScript — NO frameworks, NO WordPress
- **Repo path:** `C:\Users\jiaji\Documents\Git\thejbresidence\jbresidence-site`

## Brand
- **Name:** THE JB RESIDENCE | Property Guide
- **Tagline:** The independent property knowledge base for Johor Bahru
- **Advisor:** Sam Tee · REN 80322
- **WhatsApp:** 601156348518
- **YouTube:** https://www.youtube.com/@SamTeeJBProperty
- **Facebook:** https://www.facebook.com/samteejb/

## Purpose
This is NOT a property listing website.
It is an **authority knowledge website** about:
- Forest City & SFZ
- Iskandar Puteri
- Johor Bahru Town
- MM2H Programme
- JS-SEZ (Johor-Singapore Special Economic Zone)
- Golf Communities
- International Schools
- Retirement in JB
- Buying Guides

Property listings are secondary. Authority content comes first.

## Target Audience
- Malaysians, Foreigners, Singapore residents
- MM2H applicants, Investors, Retirees, Families
- Do NOT position for Singaporeans only

## Design System
```
Colors:
--navy-900: #0A1B2E
--navy-800: #102A43
--navy-700: #1A3A5C
--gold-500: #C9933A
--gold-400: #D4A656
--gold-300: #E0BC7E
--white: #FFFFFF
--off-white: #F7F5F1
--ink: #1C1C1A
--ink-muted: #5C5B57

Fonts:
--font-display: 'Cormorant Garamond' (headings)
--font-body: 'Jost' (body text)

Container: 1180px
```

## File Structure
```
jbresidence-site/
├── index.html              # Homepage
├── forest-city.html        # Forest City area page
├── iskandar-puteri.html    # Iskandar Puteri area page
├── jb-town.html            # JB Town area page
├── project.html            # Dynamic project detail (uses ?slug=)
├── projects.html           # Projects hub
├── articles.html           # Articles/guides hub
├── style.css               # Main stylesheet
├── CLAUDE.md               # This file
├── js/
│   └── main.js             # All JS — nav, rendering, i18n, CSV
├── articles/
│   ├── article-style.css
│   ├── _shared.html
│   └── [article-slug].html
├── projects/
│   └── [project-slug].html
└── photos/
    └── [villa photos]
```

## Architecture Rules
- Dynamic project pages use `project.html?slug=` — do NOT create separate HTML per project
- All rendering done via `js/main.js`
- Bilingual EN/ZH via `data-i18n` attributes + `TRANSLATIONS` object in main.js
- Google Sheets CSV will replace placeholder data in Phase 2
- No jQuery, no React, no build tools

## Navigation (all pages)
```html
<nav class="nav">
  Brand: THE JB RESIDENCE | Property Guide
  Links: Home | Areas ▾ (dropdown: JB Town, Iskandar Puteri, Forest City) | Projects | Guides
  Buttons: 中文 (lang toggle) | ☰ (mobile)
</nav>
```

## Footer (all pages)
```
3 columns: Areas | Guides | Contact
Copyright: © The JB Residence. Sam Tee, Property Advisor. · [version]
Tagline: The independent property knowledge base for Johor Bahru.
```

## Homepage Sections (index.html)
1. Hero — authority positioning, dual CTAs
2. Topic Band — scrollable pills (Forest City, Iskandar Puteri, JB Town, MM2H, JS-SEZ, Golf, Schools, Retirement, Buying Guides)
3. Market Insights — 3 cards (on-navy)
4. Explore Areas — 3 area cards
5. Featured Projects — 3 projects from JS
6. Buying Guides — 6 topic clusters
7. Latest Articles — 3 articles
8. About Sam — photo + bio + stats
9. CTA — WhatsApp
10. Footer

## Development Phases

### ✅ Phase 1 — COMPLETE (v2.2)
- Homepage redesign
- Navigation with dropdown
- Projects hub (projects.html)
- Articles/guides hub (articles.html)
- Area pages updated (forest-city, iskandar-puteri, jb-town)
- project.html updated
- All article pages nav updated
- style.css extended with Phase 1 components
- main.js extended with renderProjects, renderAllArticles, ALL_ARTICLES, EXTENDED_PROJECTS
- JSON-LD structured data on homepage
- Bilingual EN/ZH i18n

### 🔲 Phase 2 — Google Sheets CMS
- Connect Google Sheets as CMS
- Replace PLACEHOLDER_ARTICLES with live Sheet data
- Replace PLACEHOLDER_PROJECTS with live Sheet data
- Sheets tabs: Articles, Projects, Areas, FAQ
- Config in main.js: SHEET_CONFIG.articlesCsvUrl + projectsCsvUrl
- Fallback to placeholder data if Sheet unavailable

### 🔲 Phase 3 — SEO & AI Search
- Related Articles section on article pages
- Related Projects section
- Breadcrumbs on all inner pages
- Full structured data (Article, BreadcrumbList schemas)
- Automatic sitemap.xml
- Automatic RSS feed
- AI search optimisation

## Key Projects (EXTENDED_PROJECTS in main.js)
| Slug | Name | Area | Price |
|------|------|------|-------|
| horizon-hills | Horizon Hills | Iskandar Puteri | RM 2.5M–6M |
| eco-botanic | Eco Botanic | Iskandar Puteri | RM 1.8M–4.5M |
| east-ledang | East Ledang | Iskandar Puteri | RM 2M–5M |
| forest-city-golf-villa | Forest City Golf Villa | Forest City | RM 1.5M–3.5M |
| forest-city-high-rise | Forest City High Rise | Forest City | RM 400K–1.5M |
| rf-princess-cove | R&F Princess Cove | JB Town | RM 500K–1.5M |

## Key Articles (ALL_ARTICLES in main.js)
All 6 Forest City articles are live in articles/ folder:
- forest-city-ghost-town-or-opportunity.html
- is-forest-city-worth-buying-2026.html
- forest-city-mm2h-sfz-guide.html
- forest-city-golf-villa-guide.html
- forest-city-highrise-living-2026.html
- forest-city-island-lifestyle.html

Placeholders (coming soon): Iskandar Puteri, JB Town, MM2H, JS-SEZ articles

## Git Workflow
After every change:
```bash
git add -A
git commit -m "Phase X vX.X — description"
git push origin v2.1
```

## Rules
1. Always work from the latest files in the repo — run `git pull` first
2. Never migrate to WordPress
3. Never create separate HTML files for each project — use project.html?slug=
4. Always update ALL pages when changing nav or footer
5. Always maintain EN/ZH bilingual support
6. Return complete working files — no code snippets
7. Test that all internal links are correct before pushing
8. Increment version number in footer on every push (v2.2, v2.3, etc.)
