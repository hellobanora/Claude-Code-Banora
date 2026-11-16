# Claude SEO skill pack: Banora install notes

Source: https://github.com/AgriciDaniel/claude-seo (MIT, see `LICENSE-claude-seo`)
Pinned to: commit `468ed5b` (plugin v2.6.2), copied 2026-11-16.

## What is included

Only the parts relevant to a single-location clinic:

| Skill | Use |
|---|---|
| `seo` | Hub skill, shared references, Python runtime (`scripts/`), schema templates and data |
| `seo-audit` | Full-site audit |
| `seo-technical` | Crawl, indexing, rendering, Core Web Vitals |
| `seo-schema` | JSON-LD checks |
| `seo-local` | Local SEO, NAP, location pages, GBP signals |
| `seo-maps` | Map-pack and competitor radius checks (free tier only) |
| `seo-geo` | AI search visibility (AI Overviews, ChatGPT, Perplexity), llms.txt |
| `seo-content` | Content quality and E-E-A-T |

Matching sub-agents are in `.claude/agents/seo-*.md`.

Left out: e-commerce, Shopify, international/hreflang, backlinks, image generation,
and every paid extension (DataForSEO, Ahrefs, Firecrawl and others). The skills
mention these in passing but skip them when they aren't installed. Do not add
API keys for them without James's approval.

## Changes from upstream

- Every `${CLAUDE_PLUGIN_ROOT}` path was rewritten to point inside this repo, so the
  launcher is `"$(git rev-parse --show-toplevel)/.claude/skills/seo/scripts/claude-seo"`.
- No hooks were installed.

## One-time setup per computer

The scripts need Python 3.11–3.14. On a Mac without it:

```bash
uv python install 3.13
.claude/skills/seo/scripts/claude-seo setup
.claude/skills/seo/scripts/claude-seo doctor --json
```

`setup` builds its own Python environment (`.venv/`) and a headless Chromium
(`ms-playwright/`) inside this folder. Both are in this folder's `.gitignore`, so
each computer builds its own and nothing from them is committed.

## Banora rules still apply

Audit output is advice, not copy. Any change it suggests to patient-facing
text must still follow CLAUDE.md: AHPRA rules, the exact NAP, the brand
voice, and the booking, forms, tracking and chatbot guardrails.

## Updating

Re-copy the same folders from a newer upstream commit, re-apply the path
rewrite, and update the commit hash above.
