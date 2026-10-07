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
        self.discovery_links = []
        self.canonical = None
        self.current_discovery_link = None
        self.in_title = self.in_h1 = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
            if "back-link" in attrs.get("class", "").split():
                self.back_links.append(attrs["href"])
            if any(name in attrs.get("class", "").split() for name in ("seo-result-link", "home-recent-card")):
                self.current_discovery_link = {"href": attrs["href"], "text": ""}
        if tag == "h1":
            self.in_h1 = True
        if tag == "title":
            self.in_title = True
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")

    def handle_endtag(self, tag):
        if tag == "a" and self.current_discovery_link is not None:
            self.discovery_links.append((self.current_discovery_link["href"], " ".join(self.current_discovery_link["text"].split())))
            self.current_discovery_link = None
        if tag == "h1": self.in_h1 = False
        if tag == "title": self.in_title = False

    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.in_h1: self.h1.append(data)
        if self.current_discovery_link is not None: self.current_discovery_link["text"] += data


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
open_records = []
for record in records:
    deadline = record["deadline"]
    is_past = bool(re.fullmatch(r"\d{4}-\d{2}-\d{2}", deadline)) and deadline < today
    if not record.get("archivedAt") and not is_past:
        open_records.append(record)
        if not record.get("updatedAt"):
            errors.append(f"Open position lacks content modification provenance: {record['id']}")
        else:
            expected_lastmod[f"https://rritaly.com/positions/{quote(record['id'], safe='')}/"] = record["updatedAt"]
if sitemap_lastmod != expected_lastmod:
    errors.append(
        f"Sitemap lastmod mismatch: expected {len(expected_lastmod)} exact position timestamps, found {len(sitemap_lastmod)}"
    )

# Repeated official titles must expose their source SSD on crawlable discovery links.
def normalized_title(value):
    return " ".join(value.split()).casefold()

title_counts = {}
for record in open_records:
    key = normalized_title(record["title"])
    title_counts[key] = title_counts.get(key, 0) + 1
contextual_titles = {
    record["id"]: f'{record["title"]} — {" ".join(record["ssd"].split())}'
    for record in open_records
    if title_counts[normalized_title(record["title"])] > 1
    and record.get("ssd", "").strip() not in ("", "-")
}
contextual_discovery_checks = 0
for route, page in pages.items():
    for href, text in page.discovery_links:
        match = re.fullmatch(r"/positions/([^/]+)/?", unquote(urlsplit(href).path))
        if not match or match.group(1) not in contextual_titles:
            continue
        contextual_discovery_checks += 1
        expected = contextual_titles[match.group(1)]
        if expected not in text:
            errors.append(f"Repeated title lacks SSD context on {route}: {href}")
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

# Check discipline paths rendered in the relevant SEO landing pages.
discipline_paths = {}
for position_type, route in (
    ("Postdoc", "/posizioni/postdoc/"),
    ("PhD", "/posizioni/dottorati/"),
    ("Contratto di ricerca", "/posizioni/contratti-di-ricerca/"),
):
    disciplines = {
        record["discipline"] for record in records
        if record["positionType"] == position_type
        and not record.get("archivedAt")
        and record["deadline"] >= today
        and (position_type == "Postdoc" or record["discipline"] != "Altro / interdisciplinare")
    }
    expected = {
        f"/posizioni/?type={quote(position_type, safe='')}&discipline={quote(discipline, safe='')}"
        for discipline in disciplines
    }
    actual = {
        link for link in pages[route].links
        if link.startswith(f"/posizioni/?type={quote(position_type, safe='')}&discipline=")
    }
    if actual != expected:
        errors.append(f"Incorrect discipline links on {route}: expected {sorted(expected)}, found {sorted(actual)}")
    discipline_paths[position_type] = len(actual)

# Check the dedicated Psychology path against the verified catalog taxonomy.
psychology_route = "/posizioni/psicologia/"
psychology_records = sorted(
    (record for record in open_records if record["discipline"] == "Psicologia"),
    key=lambda record: record["publishedAt"],
    reverse=True,
)
if psychology_route not in pages:
    errors.append("Missing Psychology landing page")
else:
    expected_psychology_results = [
        f"/positions/{quote(record['id'], safe='')}" for record in psychology_records[:8]
    ]
    actual_psychology_results = [
        unquote(urlsplit(href).path).rstrip("/")
        for href, _ in pages[psychology_route].discovery_links
    ]
    if actual_psychology_results != expected_psychology_results:
        errors.append(
            f"Psychology landing results mismatch: expected {expected_psychology_results}, found {actual_psychology_results}"
        )

    expected_psychology_types = {
        f"/posizioni/?type={quote(record['positionType'], safe='')}&discipline=Psicologia"
        for record in psychology_records
    }
    actual_psychology_types = {
        link for link in pages[psychology_route].links
        if link.startswith("/posizioni/?type=") and link.endswith("&discipline=Psicologia")
    }
    if actual_psychology_types != expected_psychology_types:
        errors.append(
            f"Psychology type paths mismatch: expected {sorted(expected_psychology_types)}, found {sorted(actual_psychology_types)}"
        )

    result_text = {
        unquote(urlsplit(href).path).rstrip("/"): text
        for href, text in pages[psychology_route].discovery_links
    }
    for record in psychology_records[:8]:
        if record.get("ssd", "").strip() in ("", "-"):
            continue
        href = f"/positions/{quote(record['id'], safe='')}"
        if " ".join(record["ssd"].split()) not in result_text.get(href, ""):
            errors.append(f"Psychology landing result lacks SSD context: {href}")

if psychology_route not in pages["/"].links:
    errors.append("Homepage does not link to the Psychology landing page")
if f"https://rritaly.com{psychology_route}" not in urls:
    errors.append("Psychology landing page is missing from the sitemap")

# Check geographic paths rendered in the relevant position landing pages.
region_paths = {}
for position_type, route in (
    ("PhD", "/posizioni/dottorati/"),
    ("Postdoc", "/posizioni/postdoc/"),
    ("Contratto di ricerca", "/posizioni/contratti-di-ricerca/"),
):
    regions = {
        record["region"] for record in records
        if record["positionType"] == position_type
        and not record.get("archivedAt")
        and record["deadline"] >= today
        and record.get("region")
        and record["region"] != "Italia"
    }
    expected = {
        f"/posizioni/?type={quote(position_type, safe='')}&region={quote(region, safe='')}"
        for region in regions
    }
    actual = {
        link for link in pages[route].links
        if link.startswith(f"/posizioni/?type={quote(position_type, safe='')}&region=")
    }
    if actual != expected:
        errors.append(f"Incorrect region links on {route}: expected {sorted(expected)}, found {sorted(actual)}")
    region_paths[position_type] = len(actual)
titles = [page.title for page in positions]
report = {"html_pages": len(pages), "sitemap_urls": len(urls), "reachable_pages": len(seen), "orphan_sitemap_urls": len(orphans), "broken_internal_links": len(broken), "duplicate_position_titles": len(titles) - len(set(titles)), "initial_html": {route: {"h1": pages[route].h1, "links": len(pages[route].links)} for route in ("/", "/posizioni/", "/funding/")}, "errors": errors}
report["category_cta_checks"] = category_counts
report["discipline_path_checks"] = discipline_paths
report["psychology_path_checks"] = {
    "open_positions": len(psychology_records),
    "listed_positions": min(8, len(psychology_records)),
    "type_paths": len({record["positionType"] for record in psychology_records}),
}
report["region_path_checks"] = region_paths
report["position_lastmod_checks"] = len(sitemap_lastmod)
report["homepage_recent_position_links"] = len(recent_urls)
report["contextual_discovery_title_checks"] = contextual_discovery_checks
print(json.dumps(report, ensure_ascii=False, indent=2))
if errors: sys.exit(1)
