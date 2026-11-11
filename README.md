# AgentBuilt

A catalog of systems software built with AI agent harnesses — compilers, kernels, operating systems, databases, emulators, browser engines, and GPU/TPU kernels — with an emphasis on verifiable evidence and open contribution.

The site name, domain, and repository URL are centralized in [`site/src/site.config.ts`](site/src/site.config.ts). They are provisional:

- Name: **AgentBuilt**
- Repo: [https://github.com/heemoe/agentbuilt](https://github.com/heemoe/agentbuilt)
- Default site URL: `https://heemoe.github.io/agentbuilt`

## Documents

- [`research.md`](./research.md) — research notes (Chinese)
- [`seed-projects.yaml`](./seed-projects.yaml) — seed catalog
- [`schema/project.schema.json`](./schema/project.schema.json) — data schema
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to submit an entry
- [`logo-preview.png`](./logo-preview.png) — logo preview

## Run the site

```bash
cd site
npm install
npm run dev
```

Other commands:

```bash
npm run build       # production build
npm run preview     # serve the build
npm run check:data  # validate the YAML catalog
```

Because the configured `base` is `/agentbuilt`, local pages live under `http://localhost:4321/agentbuilt/` and `http://localhost:4321/agentbuilt/zh/`.

English is the default locale (no prefix). Simplified Chinese lives under `/zh/`.
