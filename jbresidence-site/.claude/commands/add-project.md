# Add New Project

Workflow for adding a new property project to The JB Residence website.

## Steps

1. **Read the PDF** — open it in Foxit PDF Reader via computer-use (screenshot each page to extract content, since brochures are image-based PDFs)

2. **Output a summary** in this table format before writing any code:

   | Field | Value |
   |-------|-------|
   | Project name | |
   | Developer | |
   | Area | JB Town / Iskandar Puteri / Forest City |
   | Tenure | Freehold / Leasehold 99yr |
   | Unit types | e.g. Studio 313sqft, 1BR 555sqft ... |
   | Price range | |
   | Status | New Launch / Now Selling / Completed |
   | Key amenities | bullet list |
   | Commute / connectivity | |
   | Tagline (1 line) | |

3. **Write the project description** — 4–5 paragraphs covering:
   - What makes this address unique (the hook)
   - Connectivity / commute facts
   - Facilities and amenities
   - Unit types and specs
   - Investment / rental case

4. **Add to Google Sheet** — add ONE new row to the "Project" tab of the Google Sheets CMS. Columns: `slug | project_name | area | tagline | price_range | tenure | commute_note | description | status | image_url | published`

5. **If sheet is not ready** — add to `EXTENDED_PROJECTS` AND `PLACEHOLDER_PROJECTS` in `js/main.js`. The slug must be kebab-case (e.g. `country-garden-danga-bay`).

6. **Commit and push**:
   ```
   git add -A
   git commit -m "Add [Project Name] — [Area]"
   git push origin main
   git push origin main:v2.1
   ```

## Rules
- Always push to BOTH `main` AND `main:v2.1` — Cloudflare deploys production from `main`, preview from `v2.1`
- Never create a separate HTML file per project — all projects use `project.html?slug=`
- Slug must be unique and match across BOTH arrays if adding to main.js
- Increment footer version number (v2.5 → v2.6) on every push
