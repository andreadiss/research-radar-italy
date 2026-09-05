"""Check the actual RR Italy export, including routes a docs/Jekyll deploy lacks."""
import concurrent.futures
from html.parser import HTMLParser
import json
import time
import urllib.request
import xml.etree.ElementTree as ET

BASE = "https://rritaly.com"
ROUTES = ("/", "/posizioni/", "/posizioni/indice/", "/funding/")


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = False
        self.canonical = None
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "h1":
            self.h1 = True
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")
        if tag == "a":
            self.links.append(attrs.get("href", ""))


def fetch(url):
    with urllib.request.urlopen(url, timeout=12) as response:
        if response.status != 200:
            raise ValueError(f"HTTP {response.status}")
        return response.read().decode("utf-8")


def check(path):
    try:
        page = Page()
        page.feed(fetch(BASE + path))
        assert page.h1, "H1 missing"
        assert page.canonical == BASE + path, "canonical mismatch"
        if path == "/posizioni/indice/":
            assert any("/positions/" in link for link in page.links), "opportunity links missing"
        return {"path": path, "ok": True}
    except Exception as error:
        return {"path": path, "ok": False, "error": str(error)}


def verify():
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        results = list(pool.map(check, ROUTES))
    try:
        root = ET.fromstring(fetch(BASE + "/sitemap.xml"))
        urls = [node.text for node in root.findall("{*}url/{*}loc")]
        # Both opportunity families must be published and addressable.
        for family in ("/positions/", "/grants/"):
            sample = next(url for url in urls if url and url.startswith(BASE + family))
            results.append(check(sample.removeprefix(BASE)))
        results.append({"path": "/sitemap.xml", "ok": True, "urls": len(urls)})
    except Exception as error:
        results.append({"path": "/sitemap.xml", "ok": False, "error": str(error)})
    return results


if __name__ == "__main__":
    for attempt in range(3):
        results = verify()
        print(json.dumps({"attempt": attempt + 1, "checks": results}), flush=True)
        if all(result["ok"] for result in results):
            break
        if attempt < 2:
            time.sleep(10)
    else:
        raise SystemExit("Live site verification failed; check Pages publishing source and deployment.")
