#!/usr/bin/env python3
"""Add phone-sized srcset + lazy loading to <img> tags in static pages.
Uses img-r/variants.json from make-responsive-images.py. Safe to re-run."""
import os, re, json, glob, urllib.parse
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'jbresidence-site')
os.chdir(SITE)
V = json.load(open('img-r/variants.json'))
stats = dict(srcset=0, lazy=0, files=0)
def fix(tag, fdir):
    t = tag
    m = re.search(r'\ssrc="([^"]+)"', t)
    if not m: return t
    src = m.group(1)
    cls = (re.search(r'class="([^"]*)"', t) or [None, ''])[1]
    hero = ('hero' in cls or 'portrait' in cls or 'fetchpriority' in t)
    if not src.startswith(('http:', 'https:', 'data:')) and 'srcset=' not in t:
        p = urllib.parse.unquote(src.split('?')[0])
        key = os.path.normpath(p.lstrip('/') if p.startswith('/') else os.path.join(fdir, p)).replace(os.sep, '/')
        if key in V:
            sizes, w, h = V[key]
            base = '/img-r/' + os.path.splitext(key)[0]
            parts = [f"{urllib.parse.quote(base)}-{s}.webp {s}w" for s in sizes] + [f"{src} {w}w"]
            sz = '100vw' if hero else '(max-width: 860px) 100vw, 860px'
            t = t.replace(m.group(0), m.group(0) + f' srcset="{", ".join(parts)}" sizes="{sz}"', 1)
            stats['srcset'] += 1
    if not hero and 'loading=' not in t:
        t = t[:-1].rstrip('/').rstrip() + ' loading="lazy" decoding="async">'
        stats['lazy'] += 1
    return t
for f in glob.glob('*.html') + glob.glob('articles/*.html') + glob.glob('projects/*.html'):
    s = open(f, encoding='utf-8').read()
    n = re.sub(r'<img\b[^>]*>', lambda m: fix(m.group(0), os.path.dirname(f)), s)
    if n != s:
        open(f, 'w', encoding='utf-8').write(n); stats['files'] += 1
print(stats)
