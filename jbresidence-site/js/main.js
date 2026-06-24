// ============================================
// SAM TEE PROPERTY — shared site behavior
// ============================================

// ---- Config: fill these in once your Google Sheet is published ----
const SHEET_CONFIG = {
  // Publish your Sheet as CSV: File > Share > Publish to web > select tab > CSV
  // Paste the resulting link for each tab below.
  articlesCsvUrl: '', // e.g. 'https://docs.google.com/spreadsheets/d/e/XXXX/pub?gid=0&single=true&output=csv'
  projectsCsvUrl: ''  // second tab's published CSV link
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
    slug: '', area: 'JB Town', project_name: 'Project placeholder — Johor Bahru Town',
    tagline: '', price_range: 'RM —', tenure: '', commute_note: '',
    description: '', status: 'Coming soon', image_url: '', published: 'TRUE'
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

    // Footer
    'footer-tagline': 'Independent guidance for buyers across Iskandar Puteri, Johor Bahru Town, and Forest City.',
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

    // Footer
    'footer-tagline': '为依斯干达公主城、新山市区及森林城市的买家提供独立专业指导。',
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
