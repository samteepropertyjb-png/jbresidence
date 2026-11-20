#!/usr/bin/env python3
"""Write the article cards into articles.html as plain HTML.

Why: the cards are built by js/main.js after the page loads. Pre-filling them
(1) stops the page jumping while it loads, and (2) lets Google / AI crawlers
see every article link without running JavaScript. main.js still re-renders
the same list on load, so a new article added only to main.js still appears.

Run after adding an article:  python3 tools/prerender-articles.py
Needs: pip install playwright && playwright install chromium (or a local Chrome).
"""
import os, re, subprocess, time, shutil, sys
from playwright.sync_api import sync_playwright
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'jbresidence-site')
os.chdir(SITE)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8799'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
try:
    with sync_playwright() as p:
        exe = shutil.which('google-chrome') or shutil.which('chromium')
        b = p.chromium.launch(executable_path=exe) if exe else p.chromium.launch()
        pg = b.new_page()
        pg.route('**/*', lambda r: r.abort() if 'googletagmanager' in r.request.url else r.continue_())
        pg.goto('http://localhost:8799/articles.html', wait_until='networkidle')
        pg.wait_for_selector('#all-articles .card')
        cards = pg.eval_on_selector('#all-articles', 'el => [...el.children].map(c => { c.classList.remove("in"); c.style.display=""; if(!c.getAttribute("style")) c.removeAttribute("style"); return c.outerHTML; }).join("\\n")')
        b.close()
finally:
    srv.terminate()
s = open('articles.html', encoding='utf-8').read()
END = '</div><!-- /all-articles -->'
start = s.index('<div class="grid-3" id="all-articles">')
open_end = s.index('>', start) + 1
close = s.index(END, open_end) if END in s else s.index('</div>', open_end)
close_len = len(END) if END in s else len('</div>')
s2 = s[:open_end] + '\n' + cards + '\n' + END + s[close + close_len:]
open('articles.html', 'w', encoding='utf-8').write(s2)
print('cards written:', cards.count('class="card'))
