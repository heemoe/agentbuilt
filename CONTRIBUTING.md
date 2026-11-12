# Contributing to AgentBuilt

AgentBuilt lists systems software that an LLM or a coding-agent harness wrote most of: kernels, compilers, databases, emulators, browser engines, GPU/TPU kernels, and similar projects.

English is the default. Simplified Chinese summaries are welcome. A pull request can merge without one.

## What belongs here

Include a project when all of these are true:

- A repository, paper, or official announcement can be opened.
- An agent harness wrote most of the implementation, more than a helper function or two.
- The work is a mid-to-high difficulty systems project.
- There is at least one first-party source: the author's README or blog, an official company or lab post, a paper, or a commit trailer such as `Co-Authored-By`.

Consumer apps, games, and portfolio sites are out of scope. Directories such as MissumAI and vibecodedapps.dev already list those.

## How entries are marked

`verified` requires both a first-party source and a public artifact you can open (repository, kernel files, or benchmark notes).

These three are shown with an **Unverified** badge:

- `official_claim_no_source`: an official blog or announcement describes the work, and no public repository was found. Blog-only projects use this.
- `paper_claimed_release_not_found`: a paper says the code will be released, and the repository cannot be found.
- `unverified`: a second-hand mention only, with no first-party source. Skip these. If you keep one, `notes` has to say why it is still useful.

`author_claimed` means the author's README or blog states the claim and the repository opens. `commit_attribution` means a commit trailer names the agent as well.

If you do not know a field, use `unknown` or `null` and say why in `notes`. Copy URLs, star counts, model names, and quotes from the source. If a value is not in the source, leave the field empty.

## How to add or fix a project

1. Fork the repository and create a branch.
2. Edit [`seed-projects.yaml`](./seed-projects.yaml).
3. Follow [`schema/project.schema.json`](./schema/project.schema.json).
4. `summary.en` is required. `summary.zh` is optional. The site shows English when Chinese is missing.
5. Add at least one `evidence` item with a working `url`. A short verbatim `quote` helps when you have one.
6. Set `verified` from the rules above. If you are unsure, use the weaker level.
7. Open a pull request. The template below can go in the body.

A typo fix or a stale-link fix is enough for a pull request on its own.

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

`check:data` validates `seed-projects.yaml` against the JSON Schema. The production build fails if the catalog cannot be parsed.

## Star counts

Nothing in the repo refreshes `stars` or re-checks URLs yet. If you add a star count, set `stars_checked_at` to the day you read it on GitHub. If you did not read it, omit `stars`.

## Code and site changes

UI strings are in `site/src/i18n/en.ts` and `site/src/i18n/zh.ts`. The site name, origin, base path, and repository URL are in `site/src/site.config.ts`.

Keep the site static. Filters and the compare page should work without a backend.
