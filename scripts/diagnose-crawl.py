"""Read-only public crawl diagnostics. Does not establish Google indexing state."""
import concurrent.futures
import json
import subprocess
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit

BASE = "https://rritaly.com"
PATHS = ["/", "/posizioni/", "/posizioni/indice/", "/posizioni/dottorati/", "/posizioni/postdoc/", "/robots.txt", "/sitemap.xml", "/favicon.ico"]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = None
        self.robots = []
        self.links = set()
        self.headings = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if tag == "meta" and attrs.get("name", "").lower() in ("robots", "googlebot"):
            self.robots.append(attrs.get("content", ""))
        if tag == "h1":
            self.headings += 1
        if tag == "a" and attrs.get("href"):
            self.links.add(urljoin(BASE, attrs["href"]))


def check(path):
    # curl respects the execution environment's configured HTTPS proxy.
    result = subprocess.run(["curl", "--silent", "--show-error", "--location", "--max-time", "25", "--write-out", "\n%{http_code}", BASE + path], capture_output=True)
    if result.returncode:
        return {"path": path, "error": result.stderr.decode(errors="replace").strip()}
    body, status = result.stdout.rsplit(b"\n", 1)
    report = {"path": path, "status": int(status), "bytes": len(body)}
    if path.endswith("/"):
        page = Page()
        page.feed(body.decode(errors="replace"))
        report.update(canonical=page.canonical, robots=page.robots, h1=page.headings,
                      internal_links=sorted(link for link in page.links if urlsplit(link).netloc == "rritaly.com"))
    elif path == "/robots.txt":
        report["body"] = body.decode(errors="replace")
    elif path == "/sitemap.xml":
        import xml.etree.ElementTree as ET
        urls = [node.text for node in ET.fromstring(body).findall("{*}url/{*}loc")]
        report.update(urls=len(urls), unique_urls=len(set(urls)),
                      core_present={p: BASE + p in urls for p in PATHS if p.endswith("/")})
    return report


if __name__ == "__main__":
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(check, PATHS))
    print(json.dumps({"note": "Public HTTP/HTML evidence only; not Google URL Inspection.", "checks": results}, ensure_ascii=False, indent=2))
    if any(row.get("status") != 200 for row in results):
        raise SystemExit(1)
