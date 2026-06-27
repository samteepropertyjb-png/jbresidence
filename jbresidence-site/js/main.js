// ============================================
// SAM TEE PROPERTY — shared site behavior
// ============================================

// ---- Config: fill these in once your Google Sheet is published ----
const SHEET_CONFIG = {
  articlesCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTa-aRyJ9WRiO0Y3pOOCSvVuOqerrp2Ul2S-WDb1II6ICJPkuzhufGwPaS2vJ341qumrBR6Fi3cBtyw/pub?gid=995398957&single=true&output=csv',
  projectsCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTa-aRyJ9WRiO0Y3pOOCSvVuOqerrp2Ul2S-WDb1II6ICJPkuzhufGwPaS2vJ341qumrBR6Fi3cBtyw/pub?gid=0&single=true&output=csv'
};

const WHATSAPP_NUMBER = '601156348518'; // update to your active WhatsApp number, digits only with country code

// ---- Nav scroll state ----
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
    });
    // Close menu when a link is tapped
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }
}

// ---- Scroll reveal ----
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ---- Minimal CSV parser (handles quoted fields with commas and newlines) ----
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else { field += c; }
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).filter(r => r.some(v => v.trim().length)).map(r => {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = (r[idx] || '').trim(); });
    return obj;
  });
}

async function fetchSheet(url) {
  if (!url) return null;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    const text = await res.text();
    return parseCsv(text);
  } catch (e) {
    console.warn('Sheet fetch failed, using placeholders.', e);
    return null;
  }
}

// ---- Placeholder data (shown until the Sheet is connected, or if a fetch fails) ----
const PLACEHOLDER_ARTICLES = {
  'JB Town': [
    { title: '3 things you need to watch out before buying in Johor Bahru Town', summary: '', body: '', image_url: '' },
    { title: 'Placeholder article 2 — Johor Bahru Town', summary: '', body: '', image_url: '' },
    { title: 'Placeholder article 3 — Johor Bahru Town', summary: '', body: '', image_url: '' },
    { title: 'Placeholder article 4 — Johor Bahru Town', summary: '', body: '', image_url: '' },
    { title: 'Placeholder article 5 — Johor Bahru Town', summary: '', body: '', image_url: '' }
  ],
  'Iskandar Puteri': [
    { title: 'Placeholder article 1 — Iskandar Puteri', summary: '', body: '', image_url: '' },
    { title: 'Placeholder article 2 — Iskandar Puteri', summary: '', body: '', image_url: '' },
    { title: 'Placeholder article 3 — Iskandar Puteri', summary: '', body: '', image_url: '' },
    { title: 'Placeholder article 4 — Iskandar Puteri', summary: '', body: '', image_url: '' },
    { title: 'Placeholder article 5 — Iskandar Puteri', summary: '', body: '', image_url: '' },
    { title: 'Placeholder article 6 — Iskandar Puteri', summary: '', body: '', image_url: '' },
    { title: 'Placeholder article 7 — Iskandar Puteri', summary: '', body: '', image_url: '' }
  ],
  'Forest City': [
    { title: 'Forest City Ghost Town or Opportunity? The Honest Answer in 2026', summary: 'The ghost town label followed Forest City for years. Here is what the current data actually shows — and what it means for buyers today.', body: 'exists', image_url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=800&auto=format&fit=crop', link: 'articles/forest-city-ghost-town-or-opportunity.html' },
    { title: 'Is Forest City Worth Buying in 2026? An Advisor\'s Honest Assessment', summary: 'Who Forest City suits, who it does not, and the honest case for and against buying there right now.', body: 'exists', image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop', link: 'articles/is-forest-city-worth-buying-2026.html' },
    { title: 'Can Forest City Qualify for MM2H? The SFZ Programme Explained', summary: 'Forest City is the only project in Malaysia with its own MM2H category — lower deposit, no minimum price. Here is exactly how it works.', body: 'exists', image_url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop', link: 'articles/forest-city-mm2h-sfz-guide.html' },
    { title: 'Forest City Golf Villa: What It Is, What You Get, and Who It Suits', summary: 'An inside look at the V120 Golf Villa — private garden, rooftop terrace, golf course view, and 5-year free membership. Real photos from an actual unit visit.', body: 'exists', image_url: 'photos/villa-garden-exterior.jpg', link: 'articles/forest-city-golf-villa-guide.html' },
    { title: 'Living in a Forest City Highrise: What to Expect in 2026', summary: 'Sea views, resort facilities, island air, and how the living environment compares to mainland Johor — an honest walkthrough for buyers considering a Forest City apartment.', body: 'exists', image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop', link: 'articles/forest-city-highrise-living-2026.html' },
    { title: 'Why Buyers Choose Forest City: The Island Lifestyle Nobody Talks About', summary: 'The mangrove corridor, two world-ranked golf courses, five-star resort facilities, beach access, and duty-free island living — the lifestyle case for Forest City, without the investment argument.', body: 'exists', image_url: 'fc-pool.jpg', link: 'articles/forest-city-island-lifestyle.html' }
  ]
};

// Each project row carries everything needed for both the card AND its own detail page.
const PLACEHOLDER_PROJECTS = [
  {
    slug: 'horizon-hills', area: 'Iskandar Puteri', project_name: 'Horizon Hills',
    tagline: 'Gated golf community, mature landscaping', price_range: 'RM 2.5M – RM 6M',
    tenure: 'Freehold', commute_note: '~15 min to Second Link',
    description: "Horizon Hills is one of Iskandar Puteri's most established landed townships, built around an 18-hole golf course with 24-hour guarded security across its precincts. It's a common shortlist entry for families relocating from Singapore and for retirees prioritising lifestyle infrastructure over proximity to the city centre.\n\n[Placeholder — Sam to add: specific precinct recommendations, comparable resale transactions, and any current promotions or new-launch phases worth flagging.]",
    status: 'Now selling',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    published: 'TRUE'
  },
  {
    slug: 'eco-botanic', area: 'Iskandar Puteri', project_name: 'Eco Botanic',
    tagline: 'Eco-themed township, strong family amenities', price_range: 'RM 1.8M – RM 4.5M',
    tenure: 'Freehold', commute_note: '~20 min to Second Link',
    description: "Eco Botanic is a nature-themed township with extensive parks, lakes, and family-oriented amenities. It draws buyers looking for a balance between greenery and connectivity, with schools and retail options developing steadily around it.\n\n[Placeholder — Sam to add: specific precinct recommendations, schools nearby, and current promotions.]",
    status: 'Now selling',
    image_url: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=1200&auto=format&fit=crop',
    published: 'TRUE'
  },
  {
    slug: 'east-ledang', area: 'Iskandar Puteri', project_name: 'East Ledang',
    tagline: 'Premium gated enclave, larger plot sizes', price_range: 'RM 2M – RM 5M',
    tenure: 'Freehold', commute_note: '~25 min to Second Link',
    description: "East Ledang is a premium gated enclave known for larger plot sizes and a quieter, more exclusive feel than some of its neighbouring townships. Popular with upgrading families wanting more space without moving further from the city.\n\n[Placeholder — Sam to add: specific precinct recommendations and current promotions.]",
    status: 'Now selling',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    published: 'TRUE'
  },
  {
    slug: 'rf-princess-cove', area: 'JB Town', project_name: 'R&F Princess Cove – Phase 3',
    tagline: 'Border-adjacent high-rise with direct RTS Link connectivity to Singapore',
    price_range: 'Enquire for pricing',
    tenure: 'Freehold',
    commute_note: '650m sheltered walk to JB CIQ · RTS Link (Bukit Chagar) to Woodlands North MRT',
    description: "R&F Princess Cove is Johor Bahru's highest-profile residential landmark — a mixed-use masterplan built immediately adjacent to the JB Customs, Immigration and Quarantine (CIQ) complex, the busiest land border crossing in the world with 350,000 travellers daily. Phase 3, known as New Casa Suites @ Mercu 3, is the latest tower in this development, carrying forward the same connectivity-first proposition with upgraded facilities and direct RTS access.\n\nThe single most important fact about this address is the 650-metre sheltered walkway connecting the development directly to JB CIQ. You walk from your lobby, covered, to immigration in under ten minutes — no vehicle needed. With the RTS Link (Rapid Transit System) — Bukit Chagar station, the Johor Bahru terminus — now operational, that walk continues on rail into Woodlands North MRT station in Singapore, where it connects to the Thomson-East Coast Line and the rest of the Singapore MRT network. The commute from lobby to Orchard Road is shorter from this address than from any other Malaysian property.\n\nPhase 3's Urban Sky Park occupies Level 6 — a full active floor with swimming pool, jacuzzi, kids' pool, covered BBQ lawn, leisure lawn, tennis court, basketball court, outdoor gym, gym room, yoga room, leisure track, sauna, childcare centre, and multipurpose room. Level 4 adds indoor badminton hall, snooker room, and table tennis room — plus the covered link bridge that connects directly into R&F Mall, with over 450 retail outlets within the same complex. The 450-metre Sky Lounge Jogging Track on Level 6 is the only elevated jogging track of its kind in Johor Bahru.\n\nThe wider R&F Princess Cove masterplan includes Johor Bahru's first opera house — the R&F Performing Arts Centre — a private marina yacht club on the International Marina Boulevard, and waterfront promenade access along the Strait of Johor. These are not future plans: they are operating today.\n\nThe investment case is direct: border-adjacent, RTS-connected, linked to a 450-outlet mall, with demonstrable rental demand driven by cross-border commuters who need a JB base within walking distance of Singapore. R&F Princess Cove has consistently ranked as Malaysia's most-viewed condominium rental listing across major property portals — a metric reflecting actual tenant interest, not developer marketing. Phase 3 offers a new-launch entry point into that established rental market.",
    unit_types: [
      { type: 'Studio', size: '313 sq ft' },
      { type: '1-Bedroom', size: '555 – 593 sq ft' },
      { type: '2-Bedroom', size: '781 – 894 sq ft' },
      { type: '3-Bedroom', size: '894 – 1,156 sq ft' },
      { type: '4-Bedroom', size: '1,555 sq ft' },
    ],
    features: [
      'Freehold title — rare for high-rise in JB Town',
      '650m sheltered walkway direct to JB CIQ — no car needed',
      'RTS Link (Bukit Chagar) to Woodlands North MRT — Singapore rail access',
      'Urban Sky Park (Level 6): pool, jacuzzi, kids pool, tennis, basketball, gym, yoga room, sauna, 450m jogging track',
      'Level 4: indoor badminton, snooker, table tennis + covered link bridge to R&F Mall (450+ outlets)',
      'R&F Performing Arts Centre & private marina yacht club within the masterplan',
      'Waterfront promenade along the Strait of Johor',
      'Unit finishes: timber main door, aluminium glazed windows, full-height tiles, glass balcony railings',
      "Malaysia's most-viewed condo rental listing — proven cross-border commuter demand",
    ],
    status: 'Launch 2025',
    image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=1200&auto=format&fit=crop',
    published: 'TRUE'
  },
  {
    slug: '', area: 'Forest City', project_name: 'Project placeholder — Forest City',
    tagline: '', price_range: 'RM —', tenure: '', commute_note: '',
    description: '', status: 'Coming soon', image_url: '', published: 'TRUE'
  }
];

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function slugify(text) {
  return (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function articleCardHtml(a) {
  const hasContent = a.body && a.body.trim().length > 0;
  const img = a.image_url ? `<img class="card-img" src="${a.image_url}" alt="${a.title}" style="object-fit:cover;">` : `<div class="card-img"></div>`;
  const href = a.link ? a.link : '#';
  const tag = href !== '#' ? 'a' : 'div';
  const linkAttr = href !== '#' ? `href="${href}"` : '';
  return `
    <${tag} ${linkAttr} class="card reveal ${hasContent ? '' : 'card-placeholder'}" style="text-decoration:none;">
      ${img}
      <div class="card-body">
        <div class="card-eyebrow">Market insight</div>
        <h3 class="card-title">${a.title}</h3>
        <p class="card-excerpt">${a.summary || ''}</p>
        <span class="card-link">${hasContent ? 'Read more' : 'Coming soon'}</span>
      </div>
    </${tag}>`;
}

function projectCardHtml(p) {
  const bg = p.image_url ? `background-image:url('${p.image_url}')` : '';
  const slug = p.slug || slugify(p.project_name);
  const href = slug ? `project.html?slug=${encodeURIComponent(slug)}` : '#';
  return `
    <a href="${href}" class="project-card reveal" style="${bg}">
      <span class="project-status">${p.status || 'Enquire'}</span>
      <div class="project-body">
        <div class="project-name">${p.project_name}</div>
        <div class="project-price">${p.price_range || ''}</div>
        <div class="project-desc">${p.tagline || p.description || ''}</div>
        <span class="project-cta">View project</span>
      </div>
    </a>`;
}

async function getProjects() {
  const rows = await fetchSheet(SHEET_CONFIG.projectsCsvUrl);
  if (rows && rows.length) return rows.filter(r => r.published === 'TRUE');
  return PLACEHOLDER_PROJECTS;
}

async function renderArticles(area, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  const rows = await fetchSheet(SHEET_CONFIG.articlesCsvUrl);
  let list;
  if (rows) {
    list = rows.filter(r => r.area === area && r.published === 'TRUE');
    if (!list.length) list = PLACEHOLDER_ARTICLES[area] || [];
  } else {
    list = PLACEHOLDER_ARTICLES[area] || [];
  }
  target.innerHTML = list.map(articleCardHtml).join('');
  initReveal();
}

async function renderProjects(area, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  const all = await getProjects();
  const list = all.filter(p => p.area === area);
  target.innerHTML = list.length
    ? list.map(p => projectCardHtml(p)).join('')
    : '<p style="color: var(--ink-muted);">More projects coming soon for this area.</p>';
  initReveal();
}

// ---- Dynamic project detail page (project.html?slug=...) ----
async function renderProjectPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const root = document.querySelector('#project-root');
  if (!root) return;

  const all = await getProjects();
  const p = all.find(row => (row.slug || slugify(row.project_name)) === slug);

  if (!p) {
    root.innerHTML = `
      <section class="on-white" style="padding: 140px 0 100px; text-align:center;">
        <div class="wrap">
          <div class="eyebrow" style="justify-content:center; display:flex;">Project not found</div>
          <h1 class="section-title" style="margin-top:8px;">We couldn't find that listing</h1>
          <p class="section-sub" style="margin: 14px auto 28px; text-align:center;">It may have been removed or the link is out of date.</p>
          <a href="index.html" class="btn btn-outline-dark">Back to home</a>
        </div>
      </section>`;
    return;
  }

  document.title = `${p.project_name}, ${p.area} — Price Guide | Sam Tee, Property Advisor`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', `${p.project_name}, ${p.area}: ${p.tagline || ''} ${p.price_range || ''} price guide and enquiry — Sam Tee, Property Advisor.`);

  const areaSlugMap = { 'Iskandar Puteri': 'iskandar-puteri.html', 'JB Town': 'jb-town.html', 'Forest City': 'forest-city.html' };
  const areaHref = areaSlugMap[p.area] || 'index.html';
  const descParagraphs = (p.description || '').split('\n\n').filter(Boolean).map(t => `<p style="color: var(--ink-muted); margin-bottom: 16px;">${t}</p>`).join('');
  const waMsg = encodeURIComponent(`Hi Sam, I'm interested in ${p.project_name}.`);

  root.innerHTML = `
    <header class="project-hero" style="background-image: url('${p.image_url || ''}');">
      <div class="project-hero-content">
        <div class="breadcrumb">
          <a href="index.html">Home</a> &nbsp;/&nbsp; <a href="${areaHref}">${p.area}</a> &nbsp;/&nbsp; ${p.project_name}
        </div>
        <div class="hero-tags">
          ${p.tagline ? `<span class="tag">${p.tagline}</span>` : ''}
        </div>
        <h1 class="project-hero-title">${p.project_name}</h1>
        <div class="project-hero-price">${p.price_range || ''}${p.status ? ' · ' + p.status : ''}</div>
      </div>
    </header>

    <section class="on-white">
      <div class="wrap">
        <div class="intro-grid">
          <div class="reveal">
            <div class="eyebrow">About this project</div>
            <h2 class="section-title" style="font-size: 28px; margin-top: 8px;">${p.tagline || ''}</h2>
            <div class="divider"></div>
            ${descParagraphs || '<p style="color: var(--ink-muted);">Details coming soon.</p>'}
          </div>
          <div class="reveal">
            <div class="fact-card">
              <h4>Price guide</h4>
              <div class="fact-row"><span>Range</span><span>${p.price_range || '—'}</span></div>
              <div class="fact-row"><span>Tenure</span><span>${p.tenure || '—'}</span></div>
              <div class="fact-row"><span>Commute</span><span>${p.commute_note || '—'}</span></div>
              <div class="fact-row"><span>Status</span><span>${p.status || '—'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${(p.unit_types && p.unit_types.length) || (p.features && p.features.length) ? `
    <section class="on-offwhite" style="padding: 60px 0;">
      <div class="wrap">
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;">
          ${p.unit_types && p.unit_types.length ? `
          <div class="reveal">
            <div class="eyebrow" style="margin-bottom:12px;">Unit Types</div>
            <table style="width:100%; border-collapse:collapse; font-family:var(--font-body); font-size:15px;">
              <thead>
                <tr style="border-bottom:2px solid var(--gold-500);">
                  <th style="text-align:left; padding:8px 0; color:var(--ink); font-weight:600;">Type</th>
                  <th style="text-align:right; padding:8px 0; color:var(--ink); font-weight:600;">Built-up</th>
                </tr>
              </thead>
              <tbody>
                ${p.unit_types.map(u => `
                <tr style="border-bottom:1px solid #e8e6e0;">
                  <td style="padding:10px 0; color:var(--ink);">${u.type}</td>
                  <td style="padding:10px 0; color:var(--ink-muted); text-align:right;">${u.size}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>` : ''}
          ${p.features && p.features.length ? `
          <div class="reveal">
            <div class="eyebrow" style="margin-bottom:12px;">Key Features</div>
            <ul style="list-style:none; padding:0; margin:0;">
              ${p.features.map(f => `
              <li style="display:flex; gap:10px; padding:9px 0; border-bottom:1px solid #e8e6e0; font-family:var(--font-body); font-size:15px; color:var(--ink-muted); line-height:1.5;">
                <span style="color:var(--gold-500); flex-shrink:0; margin-top:2px;">✓</span>
                <span>${f}</span>
              </li>`).join('')}
            </ul>
          </div>` : ''}
        </div>
      </div>
    </section>` : ''}

    ${p.images && p.images.length ? `
    <section class="on-navy" style="padding: 60px 0;">
      <div class="wrap">
        <div class="eyebrow reveal" style="justify-content:center; display:flex; margin-bottom:8px; color: var(--gold-400);">Project Photos</div>
        <h2 class="section-title reveal" style="text-align:center; margin-bottom:32px; color:#fff;">See the development</h2>
        <div class="project-gallery reveal">
          ${p.images.map(img => `
            <figure class="project-gallery-item">
              <img src="${img.url}" alt="${img.caption || p.project_name}" loading="lazy">
              ${img.caption ? `<figcaption>${img.caption}</figcaption>` : ''}
            </figure>`).join('')}
        </div>
      </div>
    </section>` : ''}

    <section class="on-offwhite">
      <div class="wrap">
        <div style="text-align: center; margin-bottom: 40px;">
          <div class="eyebrow reveal" style="justify-content:center; display:flex;">Interested in ${p.project_name}</div>
          <h2 class="section-title reveal" style="margin-top: 8px;">Send your details, I'll follow up directly</h2>
          <p class="section-sub reveal" style="margin: 14px auto 0; text-align: center;">A short note on your budget and timeline helps me bring you the right listings, not just any listings.</p>
        </div>
        <form class="enquiry-form reveal" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
          <input type="hidden" name="project" value="${p.project_name}">
          <div class="form-row">
            <div class="field">
              <label for="pf-name">Name</label>
              <input type="text" id="pf-name" name="name" required>
            </div>
            <div class="field">
              <label for="pf-phone">Phone / WhatsApp</label>
              <input type="tel" id="pf-phone" name="phone" required>
            </div>
          </div>
          <div class="field">
            <label for="pf-email">Email</label>
            <input type="email" id="pf-email" name="email" required>
          </div>
          <div class="field">
            <label for="pf-message">Message</label>
            <textarea id="pf-message" name="message" placeholder="Tell me about your budget, timeline, and what you're looking for..."></textarea>
          </div>
          <button type="submit" class="btn btn-gold form-submit">Send enquiry</button>
          <p class="form-note">Or skip the form — <a href="https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}" target="_blank" rel="noopener" style="color: var(--navy-900); font-weight: 600;">message me directly on WhatsApp</a>.</p>
        </form>
      </div>
    </section>`;

  initReveal();
}

// initNav and initReveal called via initLangToggle listener below

// ============================================
// BILINGUAL TOGGLE — EN / 中文
// ============================================

const TRANSLATIONS = {
  en: {
    // Nav
    'nav-home': 'Home',
    'nav-jbt': 'Johor Bahru Town',
    'nav-ip': 'Iskandar Puteri',
    'nav-fc': 'Forest City',

    // Hero
    'hero-title': 'Your property advisor for Johor, built on local ground truth.',
    'hero-sub': 'I help families and investors find the right properties across Iskandar Puteri, Johor Bahru Town, and Special Financial Zone, Forest City — with the trade-offs explained upfront, not after you\'ve signed.',

    // Profile split
    'profile-eyebrow': 'Your property advisor',
    'profile-role': 'Property Advisor · REN 80322',
    'profile-desc': 'Specialising in landed properties across Iskandar Puteri, Johor Bahru Town, and Special Financial Zone, Forest City. I help buyers understand their options before committing to any project.',
    'profile-btn-wa': 'Chat on WhatsApp',
    'profile-btn-explore': 'Explore properties',

    // About
    'about-eyebrow': 'About Sam',
    'about-headline': 'Understand first. Property later.',
    'about-p1': 'Most buyers in Johor get sold a project before anyone asks what they actually need. I work the other way — understanding your purpose first: family relocation, retirement, or investment, then matching that to the right community and price range.',
    'about-p2': 'I specialise in <strong>Johor Bahru Town and Iskandar Puteri properties from RM 1M to RM 10M</strong> across established communities, with deep familiarity in local market dynamics and the ownership rules that matter for both Malaysian and international buyers.',
    'why-eyebrow': 'Why work with me',
    'why-headline': 'Local ground truth, explained plainly.',
    'why-p1': 'I also create video content breaking down Johor property strategy — so by the time we speak, you\'ve likely already seen how I think about this market.',
    'why-p2': 'Every recommendation comes with the trade-offs, not just the highlights. If a project isn\'t right for your situation, I\'ll tell you before you waste a viewing trip.',
    'stat-range': 'Focus range',
    'stat-districts': 'Core districts',

    // Market snapshot
    'market-eyebrow': 'Market snapshot',
    'market-headline': 'Where the Johor market stands today.',
    'market-sub': 'A quick read on current conditions across the districts I cover — updated as the market moves.',
    'market-jbt-title': 'City-centre projects remain the accessible entry point',
    'market-jbt-excerpt': 'For buyers working with tighter budgets, select exemption projects in the city centre are still the most accessible way into the market.',
    'market-ip-title': 'Landed demand holding steady in established townships',
    'market-ip-excerpt': 'Eco Botanic, Horizon Hills, and East Ledang continue to see consistent interest from families and retirees seeking gated, mature communities.',
    'market-fc-title': 'Special Financial Zone status reshaping the investment conversation',
    'market-fc-excerpt': 'Special financial zone status has changed the calculus for investors weighing Forest City against other Iskandar districts.',

    // Explore
    'explore-eyebrow': 'Explore by district',
    'explore-headline': 'Three districts, three very different buyer profiles.',
    'explore-sub': 'Each has its own pricing, character, and lifestyle fit. Pick where your interest sits and I\'ll walk you through it in detail.',
    'area-jbt-eyebrow': 'Entry point',
    'area-jbt-title': 'Johor Bahru Town',
    'area-jbt-desc': 'City-centre living and accessible entry-level projects close to the Causeway.',
    'area-jbt-link': 'Explore Johor Bahru Town',
    'area-ip-eyebrow': 'Core focus',
    'area-ip-title': 'Iskandar Puteri',
    'area-ip-desc': 'Eco Botanic, Horizon Hills, East Ledang — landed family and retirement living.',
    'area-ip-link': 'Explore Iskandar Puteri',
    'area-fc-eyebrow': 'Special zone',
    'area-fc-title': 'Forest City',
    'area-fc-desc': 'Special Financial Zone with tax incentives and a distinct island lifestyle proposition.',
    'area-fc-link': 'Explore Forest City',

    // CTA
    'cta-eyebrow': 'Let\'s talk',
    'cta-headline': 'Not sure where to start? Send me your situation.',
    'cta-sub': 'A short WhatsApp message is enough — purpose, budget range, and timeline. I\'ll point you to the right district before we talk projects.',
    'cta-btn': 'Chat with Sam on WhatsApp',


    // New Phase 1 keys
    'hero-eyebrow': 'Independent Property Guide · Johor Bahru',
    'hero-btn-areas': 'Explore Areas',
    'hero-btn-guides': 'Buying Guides',
    'nav-areas': 'Areas',
    'nav-projects': 'Projects',
    'nav-guides': 'Guides',
    'projects-eyebrow': 'Featured Projects',
    'projects-headline': 'Communities worth a look right now.',
    'projects-sub': 'A shortlist, not a directory — the projects I would bring a qualified buyer to today.',
    'projects-all': 'View all projects',
    'guides-eyebrow': 'Buying Guides',
    'guides-headline': 'Everything you need to know before you buy.',
    'guides-sub': 'Topic clusters covering Forest City, MM2H, JS-SEZ, golf communities, retirement, and more.',
    'guides-all': 'All guides',
    'guide-fc': 'Forest City',
    'guide-fc-desc': 'SFZ status, island living, Golf Villa, MM2H — the complete Forest City picture.',
    'guide-mm2h': 'MM2H Programme',
    'guide-mm2h-desc': 'Eligibility, deposit requirements, Forest City SFZ track, and how to apply.',
    'guide-sez': 'JS-SEZ',
    'guide-sez-desc': 'The Johor-Singapore Special Economic Zone and what it means for property values.',
    'guide-golf': 'Golf Communities',
    'guide-golf-desc': 'Horizon Hills, Forest City Golf, Leisure Farm — golf-facing properties compared.',
    'guide-schools': 'International Schools',
    'guide-schools-desc': 'Which townships sit closest to Johor\'s best international schools.',
    'guide-retire': 'Retirement in JB',
    'guide-retire-desc': 'Cost of living, healthcare, lifestyle, and the best communities for retirees.',
    'articles-eyebrow': 'Latest Articles',
    'articles-headline': 'Recent guides and market analysis.',
    'articles-all': 'All articles',
    'about-eyebrow': 'About Sam Tee',
    'footer-areas': 'Areas',
    'footer-guides': 'Guides',

    // Footer
    'footer-tagline': 'The independent property knowledge base for Johor Bahru — Forest City, Iskandar Puteri, MM2H, JS-SEZ, and beyond.',
    'footer-districts': 'Districts',
    'footer-contact': 'Contact',
  },

  zh: {
    // Nav
    'nav-home': '主页',
    'nav-jbt': '新山市区',
    'nav-ip': '依斯干达公主城',
    'nav-fc': '森林城市',

    // Hero
    'hero-title': '您在柔佛置业的顾问，扎根本地，洞悉市场。',
    'hero-sub': '我帮助家庭及投资者在依斯干达公主城、新山市区及特别金融区森林城市找到合适的房产——让您在签约前就清楚了解所有利弊。',

    // Profile split
    'profile-eyebrow': '您的置业顾问',
    'profile-role': '置业顾问 · REN 80322',
    'profile-desc': '专注于依斯干达公主城、新山市区及特别金融区森林城市的房产。我帮助买家在做出决定之前充分了解所有选择。',
    'profile-btn-wa': 'WhatsApp联系Sam',
    'profile-btn-explore': '浏览房产',

    // About
    'about-eyebrow': '关于Sam',
    'about-headline': '先了解需求，再谈房产。',
    'about-p1': '大多数买家在柔佛还没说清楚自己的需求，就已经被推销了一个项目。我的方式恰恰相反——先了解您的目的：家庭搬迁、退休养老还是投资增值，再为您匹配合适的社区和价格范围。',
    'about-p2': '我专注于新山市区及依斯干达公主城 <strong>RM100万至RM1000万</strong> 的房产，深入了解本地市场动态，以及对马来西亚本地及海外买家均适用的置业规则。',
    'why-eyebrow': '为什么选择我',
    'why-headline': '本地实况，清晰呈现。',
    'why-p1': '我也制作视频内容，深入解析柔佛房产策略——所以当我们交流时，您很可能已经了解我对这个市场的看法。',
    'why-p2': '每一个推荐都附带利弊分析，而不仅仅是亮点。如果某个项目不适合您的情况，我会在您浪费一次看房行程之前告诉您。',
    'stat-range': '专注价格区间',
    'stat-districts': '核心片区',

    // Market snapshot
    'market-eyebrow': '市场快讯',
    'market-headline': '柔佛市场现况一览。',
    'market-sub': '涵盖我所服务片区的最新市场动态——随市场变化持续更新。',
    'market-jbt-title': '市中心项目仍是最易入场的选择',
    'market-jbt-excerpt': '对于预算较紧的买家，市中心部分豁免项目仍是进入市场最便捷的途径。',
    'market-ip-title': '成熟镇区有地房产需求保持稳定',
    'market-ip-excerpt': 'Eco Botanic、Horizon Hills及East Ledang持续受到寻求成熟围闸社区的家庭及退休人士青睐。',
    'market-fc-title': '特别金融区地位重塑投资格局',
    'market-fc-excerpt': '特别金融区身份改变了投资者在森林城市与其他依斯干达片区之间的选择考量。',

    // Explore
    'explore-eyebrow': '按片区探索',
    'explore-headline': '三大片区，三种截然不同的买家定位。',
    'explore-sub': '每个片区都有各自的价格、特点和生活方式。选择您感兴趣的片区，我将为您详细讲解。',
    'area-jbt-eyebrow': '入门之选',
    'area-jbt-title': '新山市区',
    'area-jbt-desc': '市中心生活，靠近关卡，提供易于入场的价格选择。',
    'area-jbt-link': '探索新山市区',
    'area-ip-eyebrow': '核心重点',
    'area-ip-title': '依斯干达公主城',
    'area-ip-desc': 'Eco Botanic、Horizon Hills、East Ledang——适合家庭及退休人士的有地房产。',
    'area-ip-link': '探索依斯干达公主城',
    'area-fc-eyebrow': '特别经济区',
    'area-fc-title': '森林城市',
    'area-fc-desc': '特别金融区，享有税务优惠，坐拥独特的海岛生活体验。',
    'area-fc-link': '探索森林城市',

    // CTA
    'cta-eyebrow': '开始咨询',
    'cta-headline': '不知从何开始？把您的情况告诉我。',
    'cta-sub': '一条简短的WhatsApp消息就够了——用途、预算范围和时间线。我会在推荐项目之前为您指引正确的片区。',
    'cta-btn': '与Sam在WhatsApp上交流',


    // New Phase 1 keys
    'hero-eyebrow': 'Independent Property Guide · Johor Bahru',
    'hero-btn-areas': 'Explore Areas',
    'hero-btn-guides': 'Buying Guides',
    'nav-areas': 'Areas',
    'nav-projects': 'Projects',
    'nav-guides': 'Guides',
    'projects-eyebrow': 'Featured Projects',
    'projects-headline': 'Communities worth a look right now.',
    'projects-sub': 'A shortlist, not a directory — the projects I would bring a qualified buyer to today.',
    'projects-all': 'View all projects',
    'guides-eyebrow': 'Buying Guides',
    'guides-headline': 'Everything you need to know before you buy.',
    'guides-sub': 'Topic clusters covering Forest City, MM2H, JS-SEZ, golf communities, retirement, and more.',
    'guides-all': 'All guides',
    'guide-fc': 'Forest City',
    'guide-fc-desc': 'SFZ status, island living, Golf Villa, MM2H — the complete Forest City picture.',
    'guide-mm2h': 'MM2H Programme',
    'guide-mm2h-desc': 'Eligibility, deposit requirements, Forest City SFZ track, and how to apply.',
    'guide-sez': 'JS-SEZ',
    'guide-sez-desc': 'The Johor-Singapore Special Economic Zone and what it means for property values.',
    'guide-golf': 'Golf Communities',
    'guide-golf-desc': 'Horizon Hills, Forest City Golf, Leisure Farm — golf-facing properties compared.',
    'guide-schools': 'International Schools',
    'guide-schools-desc': 'Which townships sit closest to Johor\'s best international schools.',
    'guide-retire': 'Retirement in JB',
    'guide-retire-desc': 'Cost of living, healthcare, lifestyle, and the best communities for retirees.',
    'articles-eyebrow': 'Latest Articles',
    'articles-headline': 'Recent guides and market analysis.',
    'articles-all': 'All articles',
    'about-eyebrow': 'About Sam Tee',
    'footer-areas': 'Areas',
    'footer-guides': 'Guides',


    // New Phase 1 keys
    'hero-eyebrow': '独立房产指南 · 柔佛新山',
    'hero-btn-areas': '探索片区',
    'hero-btn-guides': '置业指南',
    'nav-areas': '片区',
    'nav-projects': '项目',
    'nav-guides': '指南',
    'projects-eyebrow': '精选项目',
    'projects-headline': '值得关注的房产社区。',
    'projects-sub': '精选推荐，非全面目录——这些是我目前会带合格买家实地考察的项目。',
    'projects-all': '查看全部项目',
    'guides-eyebrow': '置业指南',
    'guides-headline': '购买前需了解的一切。',
    'guides-sub': '涵盖森林城市、MM2H、JS-SEZ、高尔夫社区、退休养老等专题。',
    'guides-all': '全部指南',
    'guide-fc': '森林城市',
    'guide-fc-desc': 'SFZ地位、海岛生活、高尔夫别墅、MM2H——完整森林城市指南。',
    'guide-mm2h': 'MM2H计划',
    'guide-mm2h-desc': '申请资格、存款要求、森林城市SFZ通道及申请流程。',
    'guide-sez': 'JS-SEZ',
    'guide-sez-desc': '柔新特别经济区及其对房产价值的影响。',
    'guide-golf': '高尔夫社区',
    'guide-golf-desc': 'Horizon Hills、森林城市高尔夫、Leisure Farm——高尔夫房产横向对比。',
    'guide-schools': '国际学校',
    'guide-schools-desc': '柔佛最优秀国际学校的周边房产购买指南。',
    'guide-retire': '新山退休生活',
    'guide-retire-desc': '生活成本、医疗资源、生活方式，以及最适合退休人士的社区。',
    'articles-eyebrow': '最新文章',
    'articles-headline': '近期指南与市场分析。',
    'articles-all': '全部文章',
    'about-eyebrow': '关于Sam Tee',
    'footer-areas': '片区',
    'footer-guides': '指南',

    // Footer
    'footer-tagline': '柔佛新山房产独立知识库——森林城市、依斯干达、MM2H、JS-SEZ及更多专题。',
    'footer-districts': '片区',
    'footer-contact': '联系方式',
  }
};

function applyLanguage(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;

  // Swap all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.getAttribute('data-i18n-html') === 'true') {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Update toggle button appearance
  const btn = document.querySelector('.lang-toggle');
  if (btn) {
    btn.textContent = lang === 'en' ? '中文' : 'EN';
    btn.setAttribute('data-current-lang', lang);
  }

  // Set html lang attribute for SEO
  document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';

  // Save preference
  try { localStorage.setItem('sam-lang', lang); } catch(e) {}
}

function initLangToggle() {
  const btn = document.querySelector('.lang-toggle');
  if (!btn) return;

  // Load saved preference, default to EN
  let current = 'en';
  try { current = localStorage.getItem('sam-lang') || 'en'; } catch(e) {}
  applyLanguage(current);

  btn.addEventListener('click', () => {
    const next = (btn.getAttribute('data-current-lang') || 'en') === 'en' ? 'zh' : 'en';
    applyLanguage(next);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initLangToggle();
});

// ============================================
// PHASE 1 ADDITIONS
// ============================================

// ---- Extended placeholder articles (all areas) ----
const ALL_ARTICLES = [
  // Forest City
  { title: 'Forest City Ghost Town or Opportunity? The Honest Answer in 2026', summary: 'The ghost town label followed Forest City for years. Here is what the current data actually shows — and what it means for buyers today.', body: 'exists', image_url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=800&auto=format&fit=crop', link: 'articles/forest-city-ghost-town-or-opportunity.html', area: 'Forest City', topics: 'forest-city' },
  { title: 'Is Forest City Worth Buying in 2026? An Advisor\'s Honest Assessment', summary: 'Who Forest City suits, who it does not, and the honest case for and against buying there right now.', body: 'exists', image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop', link: 'articles/is-forest-city-worth-buying-2026.html', area: 'Forest City', topics: 'forest-city' },
  { title: 'Can Forest City Qualify for MM2H? The SFZ Programme Explained', summary: 'Forest City is the only project in Malaysia with its own MM2H category — lower deposit, no minimum price. Here is exactly how it works.', body: 'exists', image_url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop', link: 'articles/forest-city-mm2h-sfz-guide.html', area: 'Forest City', topics: 'forest-city,mm2h' },
  { title: 'Forest City Golf Villa: What It Is, What You Get, and Who It Suits', summary: 'An inside look at the V120 Golf Villa — private garden, rooftop terrace, golf course view, and 5-year free membership. Real photos from an actual unit visit.', body: 'exists', image_url: 'photos/villa-garden-exterior.jpg', link: 'articles/forest-city-golf-villa-guide.html', area: 'Forest City', topics: 'forest-city,golf' },
  { title: 'Living in a Forest City Highrise: What to Expect in 2026', summary: 'Sea views, resort facilities, island air, and how the living environment compares to mainland Johor — an honest walkthrough for buyers considering a Forest City apartment.', body: 'exists', image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop', link: 'articles/forest-city-highrise-living-2026.html', area: 'Forest City', topics: 'forest-city' },
  { title: 'Why Buyers Choose Forest City: The Island Lifestyle Nobody Talks About', summary: 'The mangrove corridor, two world-ranked golf courses, five-star resort facilities, beach access, and duty-free island living — the lifestyle case for Forest City.', body: 'exists', image_url: 'fc-pool.jpg', link: 'articles/forest-city-island-lifestyle.html', area: 'Forest City', topics: 'forest-city,retirement' },
  // Iskandar Puteri placeholders
  { title: 'Iskandar Puteri Landed Property: Buyer\'s Guide 2026', summary: 'What to know before buying a gated landed home in Eco Botanic, Horizon Hills, or East Ledang.', body: '', image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop', link: '#', area: 'Iskandar Puteri', topics: 'iskandar-puteri,buying-guide' },
  { title: 'Horizon Hills vs Eco Botanic vs East Ledang: Which Should You Buy?', summary: 'A side-by-side comparison of the three most popular landed townships in Iskandar Puteri for families and retirees.', body: '', image_url: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=800&auto=format&fit=crop', link: '#', area: 'Iskandar Puteri', topics: 'iskandar-puteri,buying-guide' },
  { title: 'International Schools Near Iskandar Puteri: 2026 Guide', summary: 'Which established townships sit closest to Johor\'s best international schools — and how to plan your purchase around school zones.', body: '', image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop', link: '#', area: 'Iskandar Puteri', topics: 'iskandar-puteri,schools' },
  { title: 'Retiring in Iskandar Puteri: Golf, Healthcare, and Cost of Living', summary: 'Why retirees keep choosing Iskandar Puteri — and what you actually need to plan for.', body: '', image_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop', link: '#', area: 'Iskandar Puteri', topics: 'iskandar-puteri,retirement,golf' },
  // JB Town placeholders
  { title: '3 Things to Watch Before Buying in Johor Bahru Town', summary: 'The city-centre market has nuances most buyers miss. Here\'s what matters before you sign.', body: '', image_url: 'https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?q=80&w=800&auto=format&fit=crop', link: '#', area: 'JB Town', topics: 'jb-town,buying-guide' },
  // MM2H
  { title: 'MM2H Malaysia 2026: Full Application Guide', summary: 'Eligibility, deposit amounts, income requirements, and the step-by-step application process explained.', body: '', image_url: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800&auto=format&fit=crop', link: '#', area: 'General', topics: 'mm2h,buying-guide' },
  // JS-SEZ
  { title: 'JS-SEZ Explained: What the Johor-Singapore Special Economic Zone Means for Property', summary: 'How the JS-SEZ framework changes the investment case for Iskandar properties close to the checkpoints.', body: '', image_url: 'https://images.unsplash.com/photo-1518563172008-e56c5dfbaef6?q=80&w=800&auto=format&fit=crop', link: '#', area: 'General', topics: 'js-sez,buying-guide' },
];

// ---- Extended placeholder projects with data-area for filtering ----
const EXTENDED_PROJECTS = [
  {
    slug: 'horizon-hills', area: 'Iskandar Puteri', project_name: 'Horizon Hills',
    tagline: 'Gated golf community, mature landscaping', price_range: 'RM 2.5M – RM 6M',
    tenure: 'Freehold', commute_note: '~15 min to Second Link',
    description: "Horizon Hills is one of Iskandar Puteri's most established landed townships, built around an 18-hole golf course with 24-hour guarded security across its precincts.\n\n[Sam to add: specific precinct recommendations, comparable resale transactions, and any current promotions.]",
    status: 'Now selling',
    image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
    published: 'TRUE'
  },
  {
    slug: 'eco-botanic', area: 'Iskandar Puteri', project_name: 'Eco Botanic',
    tagline: 'Eco-themed township, strong family amenities', price_range: 'RM 1.8M – RM 4.5M',
    tenure: 'Freehold', commute_note: '~20 min to Second Link',
    description: "Eco Botanic is a nature-themed township with extensive parks, lakes, and family-oriented amenities. It draws buyers looking for a balance between greenery and connectivity.\n\n[Sam to add: specific precinct recommendations, schools nearby, and current promotions.]",
    status: 'Now selling',
    image_url: 'https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=1200&auto=format&fit=crop',
    published: 'TRUE'
  },
  {
    slug: 'east-ledang', area: 'Iskandar Puteri', project_name: 'East Ledang',
    tagline: 'Premium gated enclave, larger plot sizes', price_range: 'RM 2M – RM 5M',
    tenure: 'Freehold', commute_note: '~25 min to Second Link',
    description: "East Ledang is a premium gated enclave known for larger plot sizes and a quieter, more exclusive feel than neighbouring townships.\n\n[Sam to add: specific precinct recommendations and current promotions.]",
    status: 'Now selling',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    published: 'TRUE'
  },
  {
    slug: 'forest-city-golf-villa', area: 'Forest City', project_name: 'Forest City Golf Villa',
    tagline: 'Private landed villa on the golf course', price_range: 'RM 1.5M – RM 3.5M',
    tenure: 'Strata', commute_note: '~30 min to Second Link',
    description: "The Forest City Golf Villa (V120) is a two-storey landed strata property set directly on the golf course — with private garden, rooftop terrace, and a 5-year golf membership included.\n\n[Sam to add: current availability, pricing updates, and comparison with high-rise options.]",
    status: 'Now selling',
    image_url: 'photos/villa-garden-exterior.jpg',
    published: 'TRUE'
  },
  {
    slug: 'forest-city-high-rise', area: 'Forest City', project_name: 'Forest City High Rise',
    tagline: 'Sea-view apartments, resort facilities', price_range: 'RM 400K – RM 1.5M',
    tenure: 'Strata', commute_note: '~30 min to Second Link',
    description: "Forest City's high-rise apartments offer sea views, resort-style pools, and island living at price points that are hard to match this close to Singapore.\n\n[Sam to add: specific towers, floor comparison, and current promotions.]",
    status: 'Now selling',
    image_url: 'fc-pool.jpg',
    published: 'TRUE'
  },
  {
    slug: 'rf-princess-cove', area: 'JB Town', project_name: 'R&F Princess Cove – Phase 3',
    tagline: 'Border-adjacent high-rise with direct RTS Link connectivity to Singapore',
    price_range: 'Enquire for pricing',
    tenure: 'Freehold',
    commute_note: '650m sheltered walk to JB CIQ · RTS Link (Bukit Chagar) to Woodlands North MRT',
    description: "R&F Princess Cove is Johor Bahru's highest-profile residential landmark — a mixed-use masterplan built immediately adjacent to the JB Customs, Immigration and Quarantine (CIQ) complex, the busiest land border crossing in the world with 350,000 travellers daily. Phase 3, known as New Casa Suites @ Mercu 3, is the latest tower in this development, carrying forward the same connectivity-first proposition with upgraded facilities and direct RTS access.\n\nThe single most important fact about this address is the 650-metre sheltered walkway connecting the development directly to JB CIQ. You walk from your lobby, covered, to immigration in under ten minutes — no vehicle needed. With the RTS Link (Rapid Transit System) — Bukit Chagar station, the Johor Bahru terminus — now operational, that walk continues on rail into Woodlands North MRT station in Singapore, where it connects to the Thomson-East Coast Line and the rest of the Singapore MRT network. The commute from lobby to Orchard Road is shorter from this address than from any other Malaysian property.\n\nPhase 3's Urban Sky Park occupies Level 6 — a full active floor with swimming pool, jacuzzi, kids' pool, covered BBQ lawn, leisure lawn, tennis court, basketball court, outdoor gym, gym room, yoga room, leisure track, sauna, childcare centre, and multipurpose room. Level 4 adds indoor badminton hall, snooker room, and table tennis room — plus the covered link bridge that connects directly into R&F Mall, with over 450 retail outlets within the same complex. The 450-metre Sky Lounge Jogging Track on Level 6 is the only elevated jogging track of its kind in Johor Bahru.\n\nThe wider R&F Princess Cove masterplan includes Johor Bahru's first opera house — the R&F Performing Arts Centre — a private marina yacht club on the International Marina Boulevard, and waterfront promenade access along the Strait of Johor. These are not future plans: they are operating today.\n\nThe investment case is direct: border-adjacent, RTS-connected, linked to a 450-outlet mall, with demonstrable rental demand driven by cross-border commuters who need a JB base within walking distance of Singapore. R&F Princess Cove has consistently ranked as Malaysia's most-viewed condominium rental listing across major property portals — a metric reflecting actual tenant interest. Phase 3 offers a new-launch entry point into that established rental market.",
    unit_types: [
      { type: 'Studio', size: '313 sq ft' },
      { type: '1-Bedroom', size: '555 – 593 sq ft' },
      { type: '2-Bedroom', size: '781 – 894 sq ft' },
      { type: '3-Bedroom', size: '894 – 1,156 sq ft' },
      { type: '4-Bedroom', size: '1,555 sq ft' },
    ],
    features: [
      'Freehold title — rare for high-rise in JB Town',
      '650m sheltered walkway direct to JB CIQ — no car needed',
      'RTS Link (Bukit Chagar) to Woodlands North MRT — Singapore rail access',
      'Urban Sky Park (Level 6): pool, jacuzzi, kids pool, tennis, basketball, gym, yoga room, sauna, 450m jogging track',
      'Level 4: indoor badminton, snooker, table tennis + covered link bridge to R&F Mall (450+ outlets)',
      'R&F Performing Arts Centre & private marina yacht club within the masterplan',
      'Waterfront promenade along the Strait of Johor',
      'Unit finishes: timber main door, aluminium glazed windows, full-height tiles, glass balcony railings',
      "Malaysia's most-viewed condo rental listing — proven cross-border commuter demand",
    ],
    status: 'Launch 2025',
    image_url: 'https://rfmalaysia.com/wp-content/uploads/2026/01/3.jpg',
    images: [
      { url: 'https://rfmalaysia.com/wp-content/uploads/2025/11/project03_02_img01.jpg', caption: 'New Casa Suites exterior' },
      { url: 'https://rfmalaysia.com/wp-content/uploads/2025/11/project03_02_img02.jpg', caption: 'Waterfront and city view' },
      { url: 'https://rfmalaysia.com/wp-content/uploads/2025/11/project03_02_img03.jpg', caption: 'Development overview' },
      { url: 'https://rfmalaysia.com/wp-content/uploads/2025/11/project03_03_img01-1-1024x755.png', caption: 'RTS Link connectivity' },
      { url: 'https://rfmalaysia.com/wp-content/uploads/2025/11/project03_04_img01.jpg', caption: 'Urban Sky Leisure Park — swimming pool' },
      { url: 'https://rfmalaysia.com/wp-content/uploads/2025/11/project03_04_img02.jpg', caption: 'Gym and fitness facilities' },
    ],
    published: 'TRUE'
  },
];

// Merge with PLACEHOLDER_PROJECTS (sheet data takes priority)
async function getProjectsExtended() {
  const rows = await fetchSheet(SHEET_CONFIG.projectsCsvUrl);
  if (rows && rows.length) return rows.filter(r => r.published === 'TRUE');
  return EXTENDED_PROJECTS;
}

// Updated renderProjects to accept optional limit and work for all areas or specific area
async function renderProjects(area, targetSelector, limit) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  const all = await getProjectsExtended();
  let list = area ? all.filter(p => p.area === area) : all;
  if (limit) list = list.slice(0, limit);
  if (!list.length) {
    target.innerHTML = '<p style="color:var(--ink-muted); padding: 40px 0;">More projects coming soon.</p>';
    return;
  }
  target.innerHTML = list.map(p => projectCardHtmlExtended(p)).join('');
  initReveal();
}

function projectCardHtmlExtended(p) {
  const bg = p.image_url ? `background-image:url('${p.image_url}')` : '';
  const slug = p.slug || slugify(p.project_name);
  const href = slug ? `project.html?slug=${encodeURIComponent(slug)}` : '#';
  return `
    <a href="${href}" class="project-card reveal" style="${bg}" data-area="${p.area || ''}">
      <span class="project-status">${p.status || 'Enquire'}</span>
      <div class="project-body">
        <div class="project-name">${p.project_name}</div>
        <div class="project-price">${p.price_range || ''}</div>
        <div class="project-desc">${p.tagline || ''}</div>
        <span class="project-cta">View project</span>
      </div>
    </a>`;
}

// Render all articles across all areas
async function renderAllArticles(targetSelector, limit) {
  const target = document.querySelector(targetSelector);
  if (!target) return;
  const rows = await fetchSheet(SHEET_CONFIG.articlesCsvUrl);
  let list = rows && rows.length ? rows.filter(r => r.published === 'TRUE') : ALL_ARTICLES;
  if (limit) list = list.slice(0, limit);
  target.innerHTML = list.map(a => articleCardHtmlExtended(a)).join('');
  initReveal();
}

function articleCardHtmlExtended(a) {
  const hasContent = a.body && a.body.trim().length > 0;
  const img = a.image_url
    ? `<div class="card-img" style="background-image:url('${a.image_url}'); background-size:cover;"></div>`
    : `<div class="card-img"></div>`;
  const href = a.link && a.link !== '#' ? a.link : '#';
  const tag = href !== '#' ? 'a' : 'div';
  const linkAttr = href !== '#' ? `href="${href}"` : '';
  const topics = a.topics || '';
  return `
    <${tag} ${linkAttr} class="card reveal ${hasContent ? '' : 'card-placeholder'}" style="text-decoration:none;" data-topics="${topics}">
      ${img}
      <div class="card-body">
        <div class="card-eyebrow">${a.area || 'Market insight'}</div>
        <h3 class="card-title">${a.title}</h3>
        <p class="card-excerpt">${a.summary || ''}</p>
        <span class="card-link">${hasContent ? 'Read more' : 'Coming soon'}</span>
      </div>
    </${tag}>`;
}

// ---- Mobile nav dropdown toggle ----
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  const dropdownToggle = document.querySelector('.nav-dropdown-toggle');
  const dropdownMenu = document.querySelector('.nav-dropdown-menu');

  const megaPanel = document.querySelector('.nav-mega-panel');
  if (dropdownToggle && megaPanel) {
    dropdownToggle.addEventListener('click', (e) => {
      if (window.innerWidth <= 860) {
        e.preventDefault();
        megaPanel.classList.toggle('mobile-open');
      }
    });
  }
});

// Updated getProjects to use extended data
const _originalGetProjects = getProjects;
async function getProjects() {
  return getProjectsExtended();
}
