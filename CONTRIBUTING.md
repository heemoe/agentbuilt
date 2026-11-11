# Contributing to AgentBuilt

AgentBuilt is a catalog of **systems software** (kernels, compilers, databases, emulators, browser engines, GPU/TPU kernels, and similar work) that was **primarily produced by an LLM or agent harness**. We care more about verifiable evidence than about hype.

English is the default language of the project. 简体中文译文欢迎补充，但不是合并的前提。

## What belongs here

A good entry is:

- Publicly inspectable (a repository, paper, or official announcement you can open);
- Primarily written or optimized by an agent / harness, not merely “AI was used for a few functions”;
- In a mid-to-high difficulty systems domain;
- Backed by at least one **first-party** source: the author’s README or blog, an official company/lab post, a paper, or machine-readable commit attribution.

We generally do **not** list consumer SaaS, games, or portfolio sites. Those are already covered by directories such as MissumAI and vibecodedapps.dev.

## How to add or fix a project

1. Fork the repository and create a branch.
2. Edit [`seed-projects.yaml`](./seed-projects.yaml). Do not invent URLs, star counts, model names, or quotes. If you do not know a field, use `unknown` or `null` and explain in `notes`.
3. Follow the schema in [`schema/project.schema.json`](./schema/project.schema.json).
4. Provide `summary.en` (required). `summary.zh` is optional; the site falls back to English.
5. Include at least one `evidence` item with a working `url` and, when possible, a short verbatim `quote`.
6. Set `verified` conservatively. Use `verified` only when a first-party source and a public artifact both exist. Use `official_claim_no_source` when an official post describes work that has no public repository. Use `paper_claimed_release_not_found` when a paper promises a release you cannot find.
7. Open a pull request with the template below.

Please also update a typo or a stale link if you see one. Those PRs are welcome.

## Pull request template

Copy this into the PR body:

```markdown
## Project
- Name:
- id (slug):
- Repo or announcement URL:

## Classification
- Harness(es):
- Model(s) (or `unknown`):
- Category:
- Difficulty (medium / high / very-high):
- Human involvement (autonomous_multi_agent / steered_agent / pair / unknown):
- Suggested verified level:

## Evidence
- First-party URL:
- Short quote (verbatim):
- HTTP status you observed:

## Checklist
- [ ] I did not invent any URL, metric, or model name
- [ ] `summary.en` is present
- [ ] Evidence URL opens (not 404)
- [ ] `stars` is either omitted/null or copied from GitHub with a `stars_checked_at` date
```

## Local checks

```bash
cd site
npm install
npm run check:data
npm run build
```

`check:data` validates `seed-projects.yaml` against the JSON Schema. The production build will fail if the catalog cannot be parsed.

## Optional automation

A GitHub Action that refreshes `stars` and re-checks URLs is planned but not required for the first version. Until that exists, leave `stars_checked_at` next to any star count you add, and do not guess a number.

## Code and site changes

UI strings live in `site/src/i18n/en.ts` and `site/src/i18n/zh.ts`. Site name, origin, base path, and repository URL live in `site/src/site.config.ts` — change those in one place if the project is renamed.

Please keep the site static. Filters and the compare view should work without a backend.
