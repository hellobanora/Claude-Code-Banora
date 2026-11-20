# /// script
# requires-python = ">=3.11"
# dependencies = ["beautifulsoup4>=4.12"]
# ///
"""Before/after site check for SEO changes.

Compares two built copies of the site (main vs. the branch) and reports what a change broke or
changed. Only regressions block: problems that already exist on main never fail the check.

    uv run scripts/seo-site-check.py <before_dir> <after_dir> [--markdown out.md]

<before_dir>/<after_dir> are build outputs (.vercel/output/static). Exit code 1 means a blocking
problem was found: fix the change or drop it. Warnings don't block but must be addressed in the PR body.

Blocking: invalid JSON-LD, wrong phone/address in schema or text, pages removed, a page losing its single
<title>/canonical/H1, canonical or new internal links without a trailing slash, new broken internal links,
new images without alt, added Palm Beach Chiropractic references, scripts/iframes/forms pointing at a new
external host, and new text containing "cure", "guarantee" or testimonial wording.
Warnings: titles over 60 characters, meta descriptions outside 150-160, and other AHPRA-sensitive words.
"""

from __future__ import annotations

import argparse
import difflib
import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import urldefrag, urlparse

from bs4 import BeautifulSoup

PHONE_DISPLAY = "(07) 5599 2322"
PHONE_E164 = "+61755992322"
STREET = "2/44 Greenway Drive"
PHONE_PATTERN = re.compile(r"\(07\)\s?5599\s?\d{4}|\+?61\s?7\s?5599\s?\d{4}")
# "via Leisure Drive" is fine (directions); a street number before it means a wrong clinic address.
WRONG_ADDRESS = re.compile(r"\b\d+[/\d]*\s+leisure\s+drive", re.IGNORECASE)
PALM_BEACH_BRAND = re.compile(r"palm\s*beach\s+chiropractic", re.IGNORECASE)
SKIP_LINK_PREFIXES = ("/api/", "/_astro/", "/forms/", "/images/", "/fonts/")
AHPRA_BLOCK = re.compile(r"\b(cures?|cured|guarantee[ds]?|our patients say|testimonial)\b|★", re.IGNORECASE)
AHPRA_WARN = re.compile(
    r"\b(fix(es|ed)?|heals?|eliminates?|best|leading|number one|#1|experts?|specialists?|safe|"
    r"world[- ]class|get rid of)\b",
    re.IGNORECASE,
)
SENTENCE = re.compile(r"(?<=[.!?])\s+")


@dataclass
class Page:
    path: str
    title: list[str]
    meta_description: list[str]
    canonical: list[str]
    h1: list[str]
    visible_text: str
    jsonld: list[str]
    internal_links: set[str]
    images_missing_alt: int
    head_html: str
    embed_hosts: set[str]


@dataclass
class Snapshot:
    pages: dict[str, Page]
    files: set[str]

    def resolves(self, href: str) -> bool:
        path = urldefrag(href)[0].split("?")[0]
        return path in self.files or (path.endswith("/") and f"{path}index.html" in self.files)


@dataclass
class Findings:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    changed_pages: list[str] = field(default_factory=list)


# ---- parsing ----------------------------------------------------------------------------------
def _site_path(rel: str) -> str:
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def _visible_text(soup: BeautifulSoup) -> str:
    clone = BeautifulSoup(str(soup.body or soup), "html.parser")
    for tag in clone(["script", "style", "noscript", "template", "svg"]):
        tag.decompose()
    return re.sub(r"\s+", " ", clone.get_text(" ")).strip()


def _embed_hosts(soup: BeautifulSoup) -> set[str]:
    hosts = set()
    for tag, attr in (("script", "src"), ("iframe", "src"), ("form", "action")):
        for el in soup.find_all(tag):
            netloc = urlparse(str(el.get(attr) or "")).netloc
            if netloc:
                hosts.add(netloc.lower())
    return hosts


def _links(soup: BeautifulSoup) -> set[str]:
    links = set()
    for a in soup.find_all("a", href=True):
        href = str(a["href"]).strip()
        parsed = urlparse(href)
        if parsed.scheme or parsed.netloc or not href.startswith("/") or href.startswith(SKIP_LINK_PREFIXES):
            continue
        links.add(href)
    return links


def parse_page(path: str, html: str) -> Page:
    soup = BeautifulSoup(html, "html.parser")
    return Page(
        path=path,
        title=[t.get_text(strip=True) for t in soup.find_all("title")],
        meta_description=[str(m.get("content", "")) for m in soup.find_all("meta", attrs={"name": "description"})],
        canonical=[str(c.get("href", "")) for c in soup.find_all("link", rel="canonical")],
        h1=[h.get_text(" ", strip=True) for h in soup.find_all("h1")],
        visible_text=_visible_text(soup),
        jsonld=[s.string or "" for s in soup.find_all("script", type="application/ld+json")],
        internal_links=_links(soup),
        images_missing_alt=sum(1 for img in soup.find_all("img") if img.get("alt") is None),
        head_html=str(soup.head or ""),
        embed_hosts=_embed_hosts(soup),
    )


def snapshot(out_dir: Path) -> Snapshot:
    pages, files = {}, set()
    for file in sorted(out_dir.rglob("*")):
        if not file.is_file():
            continue
        rel = file.relative_to(out_dir).as_posix()
        files.add("/" + rel)
        if rel.endswith(".html"):
            path = _site_path(rel)
            pages[path] = parse_page(path, file.read_text(encoding="utf-8", errors="replace"))
    return Snapshot(pages=pages, files=files)


# ---- checks -----------------------------------------------------------------------------------
def _walk(data: object):
    if isinstance(data, dict):
        yield data
        for value in data.values():
            yield from _walk(value)
    elif isinstance(data, list):
        for item in data:
            yield from _walk(item)


def _jsonld_issues(page: Page) -> list[str]:
    issues = []
    for raw in page.jsonld:
        try:
            data = json.loads(raw)
        except json.JSONDecodeError as exc:
            issues.append(f"invalid JSON-LD ({exc.msg})")
            continue
        for node in _walk(data):
            phone = node.get("telephone")
            if phone and phone not in (PHONE_DISPLAY, PHONE_E164):
                issues.append(f"JSON-LD telephone '{phone}' is not the clinic number")
            address = node.get("address")
            if isinstance(address, dict) and address.get("streetAddress") not in (None, STREET):
                issues.append(f"JSON-LD streetAddress '{address.get('streetAddress')}' is wrong")
    return issues


def _nap_issues(page: Page) -> list[str]:
    issues = []
    for number in PHONE_PATTERN.findall(page.visible_text):
        if re.sub(r"\D", "", number)[-4:] != "2322":
            issues.append(f"phone number '{number}' does not match {PHONE_DISPLAY}")
    if WRONG_ADDRESS.search(page.visible_text):
        issues.append("gives a Leisure Drive street address (the clinic is 2/44 Greenway Drive)")
    return issues


def _new_only(page: Page, old: Page | None, f: Findings, check) -> None:
    existing = set(check(old)) if old else set()
    f.errors += [f"{page.path}: {issue}" for issue in check(page) if issue not in existing]


def _check_head(page: Page, old: Page | None, f: Findings) -> None:
    for attr, label in (("title", "<title>"), ("canonical", "canonical link"), ("h1", "H1")):
        now, was = len(getattr(page, attr)), len(getattr(old, attr)) if old else 1
        if now != 1 and was == 1:
            f.errors.append(f"{page.path}: now has {now} {label} elements (expected 1)")
    for href in page.canonical:
        if href and not href.endswith("/") and "." not in href.rsplit("/", 1)[-1]:
            if old is None or href not in old.canonical:
                f.errors.append(f"{page.path}: canonical '{href}' lacks the trailing slash")


def _check_links(page: Page, old: Page | None, after: Snapshot, f: Findings) -> None:
    for href in sorted(page.internal_links - (old.internal_links if old else set())):
        path = urldefrag(href)[0].split("?")[0]
        if after.resolves(href):
            continue
        if path and not path.endswith("/") and after.resolves(path + "/"):
            f.errors.append(f"{page.path}: new internal link '{href}' lacks the trailing slash")
        else:
            f.errors.append(f"{page.path}: new internal link '{href}' is broken")


def _added_sentences(old: Page | None, new: Page) -> list[str]:
    if old is None:
        return SENTENCE.split(new.visible_text)
    a, b = SENTENCE.split(old.visible_text), SENTENCE.split(new.visible_text)
    return [ln[2:] for ln in difflib.ndiff(a, b) if ln.startswith("+ ")]


def _check_copy(page: Page, old: Page | None, f: Findings) -> None:
    new_text = list(_added_sentences(old, page))
    if old is None or old.title != page.title:
        new_text += page.title
        for t in page.title:
            if len(t) > 60:
                f.warnings.append(f"{page.path}: title is {len(t)} characters (aim for 60 or fewer)")
    if old is None or old.meta_description != page.meta_description:
        new_text += page.meta_description
        for d in page.meta_description:
            if not 150 <= len(d) <= 160:
                f.warnings.append(f"{page.path}: meta description is {len(d)} characters (aim for 150-160)")
    if old is None or old.h1 != page.h1:
        new_text += page.h1
    for sentence in dict.fromkeys(new_text):
        if AHPRA_BLOCK.search(sentence):
            f.errors.append(f"{page.path}: AHPRA, new text makes an outcome claim or testimonial: '{sentence[:160]}'")
        elif AHPRA_WARN.search(sentence):
            f.warnings.append(f"{page.path}: AHPRA, check wording in new text: '{sentence[:160]}'")


def compare(before: Snapshot, after: Snapshot) -> Findings:
    f = Findings()
    missing = sorted(set(before.pages) - set(after.pages))
    if missing:
        f.errors.append(f"pages removed by the change: {', '.join(missing[:10])}")
    for path, page in after.pages.items():
        old = before.pages.get(path)
        changed = old is None or (old.visible_text, old.head_html, old.jsonld) != (
            page.visible_text, page.head_html, page.jsonld)
        if not changed:
            continue
        f.changed_pages.append(path)
        _new_only(page, old, f, _jsonld_issues)
        _new_only(page, old, f, _nap_issues)
        _check_head(page, old, f)
        _check_links(page, old, after, f)
        _check_copy(page, old, f)
        if old is not None and page.images_missing_alt > old.images_missing_alt:
            f.errors.append(f"{path}: {page.images_missing_alt - old.images_missing_alt} new image(s) without alt")
    _check_site_wide(before, after, f)
    return f


def _check_site_wide(before: Snapshot, after: Snapshot, f: Findings) -> None:
    def brand_count(s: Snapshot) -> int:
        return sum(len(PALM_BEACH_BRAND.findall(p.visible_text + p.head_html)) for p in s.pages.values())

    if brand_count(after) > brand_count(before):
        f.errors.append("adds Palm Beach Chiropractic references (only the existing header link is allowed)")
    known = set().union(*(p.embed_hosts for p in before.pages.values()))
    for path, page in after.pages.items():
        for host in sorted(page.embed_hosts - known):
            f.errors.append(f"{path}: adds a script/iframe/form pointing at a new external host '{host}'")


# ---- report -----------------------------------------------------------------------------------
def _field(label: str, old: list[str], new: list[str]) -> list[str]:
    if old == new:
        return []
    return [f"- **{label}**", f"  - before: {' | '.join(old) or '(none)'}", f"  - after: {' | '.join(new) or '(none)'}"]


def markdown(before: Snapshot, after: Snapshot, f: Findings) -> str:
    status = "❌ Blocking problems found" if f.errors else "✅ No blocking problems"
    out = [f"## Site check: {status}", "", f"{len(f.changed_pages)} page(s) changed."]
    if f.errors:
        out += ["", "### Blocking (fix or drop the change)", *[f"- {e}" for e in f.errors]]
    if f.warnings:
        out += ["", "### Warnings (address in the PR body)", *[f"- {w}" for w in f.warnings]]
    out += ["", "### What changed"]
    for path in f.changed_pages[:15]:
        old, new = before.pages.get(path), after.pages[path]
        out.append(f"\n**{path}**" + (" (new page)" if old is None else ""))
        if old is None:
            continue
        out += _field("Title", old.title, new.title)
        out += _field("Meta description", old.meta_description, new.meta_description)
        out += _field("H1", old.h1, new.h1)
        added = _added_sentences(old, new)
        if added:
            out.append(f"- **Copy:** {len(added)} new or changed sentence(s), e.g. \"{added[0][:200]}\"")
        if old.jsonld != new.jsonld:
            out.append("- **Schema (JSON-LD) changed**")
    if len(f.changed_pages) > 15:
        out.append(f"\n…and {len(f.changed_pages) - 15} more pages (template change).")
    return "\n".join(out)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("before", type=Path, help="build output from main")
    parser.add_argument("after", type=Path, help="build output from the branch")
    parser.add_argument("--markdown", type=Path, help="also write the report to this file for the PR body")
    args = parser.parse_args()
    for d in (args.before, args.after):
        if not any(d.rglob("*.html")):
            print(f"No built HTML in {d}. Run `npm run build` first.", file=sys.stderr)
            return 2
    before, after = snapshot(args.before), snapshot(args.after)
    findings = compare(before, after)
    report = markdown(before, after, findings)
    print(report)
    if args.markdown:
        args.markdown.write_text(report + "\n", encoding="utf-8")
    return 1 if findings.errors else 0


if __name__ == "__main__":
    sys.exit(main())
