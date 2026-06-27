# Project Posting Skill

Add a new property project to The JB Residence website.

## Step 1 — Read the PDF
Open the brochure in Foxit PDF Reader via computer-use. Screenshot each page to extract content (brochures are image-based PDFs, text extraction won't work).

## Step 2 — Output a summary table before writing any code

| Field | Value |
|-------|-------|
| Project name | |
| Developer | |
| Area | JB Town / Iskandar Puteri / Forest City |
| Tenure | Freehold / Leasehold 99yr |
| Unit types + sizes | e.g. Studio 313sqft, 1BR 555–593sqft |
| Price range | |
| Status | New Launch / Launch [year] / Now Selling |
| Key amenities | |
| Commute / connectivity | |
| Tagline (1 line) | |

Wait for Sam to confirm or correct the summary before writing any code.

## Step 3 — Write the project entry

Add to both PLACEHOLDER_PROJECTS (~line 121) and EXTENDED_PROJECTS (~line 676) in js/main.js.
EXTENDED_PROJECTS gets the images[] array. PLACEHOLDER_PROJECTS does not.

Fields: slug, area, project_name, tagline, price_range, tenure, commute_note, description, unit_types, features, status, image_url, images (EXTENDED only), published

Description format: 4 paragraphs separated by \n\n
- Para 1: unique hook / what makes this address special
- Para 2: connectivity and commute facts
- Para 3: amenities and facilities
- Para 4: investment and rental case

## Step 4 — Bump the cache-bust version

Every push must increment the ?v= on all HTML files or browsers serve stale JS.
Check current version with: grep -r "main.js?v=" jbresidence-site/index.html
Then replace OLD with NEW across all files:
find jbresidence-site -name "*.html" -not -path "*/.claude/*" | xargs sed -i 's|main.js?v=OLD|main.js?v=NEW|g'

## Step 5 — Commit and push to BOTH branches

git add -A
git commit -m "Add [Project Name] — [Area] · vX.X"
git push origin main
git push origin main:v2.1

Always push to both main AND main:v2.1 in the same session.

## Rules
- Never create a separate HTML file per project — all use project.html?slug=
- Slug must be kebab-case and unique (e.g. country-garden-danga-bay)
- Always bump ?v= version or users will see cached old data
- Always confirm the summary table with Sam before writing code
- Description: 4 paragraphs — hook, connectivity, amenities, investment case
