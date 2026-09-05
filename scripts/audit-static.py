"""Check crawlability of the actual static export, without launching a browser."""
import json
import sys
from collections import deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.h1, self.title = [], [], ""
        self.canonical = None
        self.in_title = self.in_h1 = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "h1":
            self.in_h1 = True
        if tag == "title":
            self.in_title = True
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")

    def handle_endtag(self, tag):
        if tag == "h1": self.in_h1 = False
        if tag == "title": self.in_title = False

    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.in_h1: self.h1.append(data)


root = Path("out")
pages = {}
for path in root.rglob("index.html"):
    route = "/" + str(path.relative_to(root).parent).strip(".").strip("/")
    route = route.rstrip("/") + "/"
    parsed = Page()
    parsed.feed(path.read_text())
    pages[route] = parsed

errors = []
for route in ("/", "/posizioni/", "/funding/"):
    if not pages[route].h1 or not pages[route].links:
        errors.append(f"Missing initial HTML content: {route}")
    if pages[route].title.count("Research Radar Italy") != 1:
        errors.append(f"Repeated or missing brand in title: {route}")

ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
sitemap = ET.parse(root / "sitemap.xml")
urls = [item.text for item in sitemap.findall(".//s:loc", ns)]
for url in urls:
    route = unquote(urlsplit(url).path) or "/"
    if route not in pages:
        errors.append(f"Sitemap URL has no exported HTML: {url}")
    elif pages[route].canonical != url:
        errors.append(f"Canonical differs from sitemap: {url} -> {pages[route].canonical}")

seen, queue, broken = set(), deque(["/"]), set()
while queue:
    route = queue.popleft()
    if route in seen: continue
    seen.add(route)
    for link in pages[route].links:
        url = urlsplit(link)
        if url.netloc and url.netloc != "rritaly.com": continue
        if url.scheme and url.scheme not in ("http", "https"): continue
        if not url.path.startswith("/"): continue
        target = unquote(url.path).rstrip("/") + "/"
        if target in pages:
            queue.append(target)
        else:
            broken.add((route, link))
orphans = [url for url in urls if (urlsplit(url).path or "/") not in seen]
errors.extend(f"Unreachable from homepage through HTML links: {url}" for url in orphans)
errors.extend(f"Broken internal link: {source} -> {target}" for source, target in sorted(broken))
positions = [page for route, page in pages.items() if route.startswith("/positions/")]
titles = [page.title for page in positions]
report = {"html_pages": len(pages), "sitemap_urls": len(urls), "reachable_pages": len(seen), "orphan_sitemap_urls": len(orphans), "broken_internal_links": len(broken), "duplicate_position_titles": len(titles) - len(set(titles)), "initial_html": {route: {"h1": pages[route].h1, "links": len(pages[route].links)} for route in ("/", "/posizioni/", "/funding/")}, "errors": errors}
print(json.dumps(report, ensure_ascii=False, indent=2))
if errors: sys.exit(1)
