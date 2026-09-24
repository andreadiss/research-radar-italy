"""Check crawlability of the actual static export, without launching a browser."""
import json
import re
import sys
from collections import deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote, quote
from datetime import datetime
from zoneinfo import ZoneInfo
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.h1, self.title = [], [], ""
        self.back_links = []
        self.canonical = None
        self.in_title = self.in_h1 = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
            if "back-link" in attrs.get("class", "").split():
                self.back_links.append(attrs["href"])
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
sitemap_items = sitemap.findall(".//s:url", ns)
urls = [item.find("s:loc", ns).text for item in sitemap_items]
sitemap_lastmod = {
    item.find("s:loc", ns).text: item.find("s:lastmod", ns).text
    for item in sitemap_items if item.find("s:lastmod", ns) is not None
}
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
records = json.loads(Path("lib/generated/mur-positions.json").read_text())
positions = [page for route, page in pages.items() if route.startswith("/positions/")]
today = datetime.now(ZoneInfo("Europe/Rome")).strftime("%Y-%m-%d")
recent_records = sorted(
    (
        record for record in records
        if not record.get("archivedAt")
        and not (bool(re.fullmatch(r"\d{4}-\d{2}-\d{2}", record["deadline"])) and record["deadline"] < today)
        and record["publishedAt"] <= today
    ),
    key=lambda record: record["publishedAt"],
    reverse=True,
)[:6]
recent_urls = {f"/positions/{quote(record['id'], safe='')}/" for record in recent_records}
home_position_links = {unquote(urlsplit(link).path) for link in pages["/"].links if urlsplit(link).path.startswith("/positions/")}
if not recent_urls.issubset(home_position_links):
    errors.append(f"Homepage recent opportunities mismatch: expected {sorted(recent_urls)}, found {sorted(home_position_links)}")
expected_lastmod = {}
for record in records:
    deadline = record["deadline"]
    is_past = bool(re.fullmatch(r"\d{4}-\d{2}-\d{2}", deadline)) and deadline < today
    if not record.get("archivedAt") and not is_past:
        if not record.get("updatedAt"):
            errors.append(f"Open position lacks content modification provenance: {record['id']}")
        else:
            expected_lastmod[f"https://rritaly.com/positions/{quote(record['id'], safe='')}/"] = record["updatedAt"]
if sitemap_lastmod != expected_lastmod:
    errors.append(
        f"Sitemap lastmod mismatch: expected {len(expected_lastmod)} exact position timestamps, found {len(sitemap_lastmod)}"
    )
# Check the final category CTA even on archived pages outside the sitemap.
category_paths = {
    "PhD": "/posizioni/dottorati/",
    "Postdoc": "/posizioni/postdoc/",
    "RTT": "/posizioni/ricercatori-tempo-determinato/",
    "Contratto di ricerca": "/posizioni/contratti-di-ricerca/",
}
category_counts = {"category": 0, "directory_fallback": 0}
for record in records:
    route = f"/positions/{record['id']}/"
    target = category_paths.get(record["positionType"], "/posizioni/indice/")
    page = pages.get(route)
    if page is None or not page.back_links or page.back_links[-1] != target:
        errors.append(f"Incorrect final category link: {route} -> expected {target}")
    if target not in pages:
        errors.append(f"Category link target has no exported HTML: {target}")
    category_counts["category" if record["positionType"] in category_paths else "directory_fallback"] += 1

# Check discipline paths rendered in the two SEO landing pages.
discipline_paths = {}
for position_type, route in (("Postdoc", "/posizioni/postdoc/"), ("PhD", "/posizioni/dottorati/")):
    disciplines = {
        record["discipline"] for record in records
        if record["positionType"] == position_type
        and not record.get("archivedAt")
        and record["deadline"] >= today
        and (position_type != "PhD" or record["discipline"] != "Altro / interdisciplinare")
    }
    expected = {
        f"/posizioni/?type={position_type}&discipline={quote(discipline, safe='')}"
        for discipline in disciplines
    }
    actual = {
        link for link in pages[route].links
        if link.startswith(f"/posizioni/?type={position_type}&discipline=")
    }
    if actual != expected:
        errors.append(f"Incorrect discipline links on {route}: expected {sorted(expected)}, found {sorted(actual)}")
    discipline_paths[position_type] = len(actual)

# Check geographic paths rendered in the Dottorati and Postdoc landing pages.
region_paths = {}
for position_type, route in (("PhD", "/posizioni/dottorati/"), ("Postdoc", "/posizioni/postdoc/")):
    regions = {
        record["region"] for record in records
        if record["positionType"] == position_type
        and not record.get("archivedAt")
        and record["deadline"] >= today
        and record.get("region")
        and record["region"] != "Italia"
    }
    expected = {
        f"/posizioni/?type={position_type}&region={quote(region, safe='')}"
        for region in regions
    }
    actual = {
        link for link in pages[route].links
        if link.startswith(f"/posizioni/?type={position_type}&region=")
    }
    if actual != expected:
        errors.append(f"Incorrect region links on {route}: expected {sorted(expected)}, found {sorted(actual)}")
    region_paths[position_type] = len(actual)
titles = [page.title for page in positions]
report = {"html_pages": len(pages), "sitemap_urls": len(urls), "reachable_pages": len(seen), "orphan_sitemap_urls": len(orphans), "broken_internal_links": len(broken), "duplicate_position_titles": len(titles) - len(set(titles)), "initial_html": {route: {"h1": pages[route].h1, "links": len(pages[route].links)} for route in ("/", "/posizioni/", "/funding/")}, "errors": errors}
report["category_cta_checks"] = category_counts
report["discipline_path_checks"] = discipline_paths
report["region_path_checks"] = region_paths
report["position_lastmod_checks"] = len(sitemap_lastmod)
report["homepage_recent_position_links"] = len(recent_urls)
print(json.dumps(report, ensure_ascii=False, indent=2))
if errors: sys.exit(1)
