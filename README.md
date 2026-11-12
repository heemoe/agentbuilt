# What AI Built

A catalog of systems software written mostly by AI coding agents and agent harnesses: kernels, compilers, operating systems, databases, emulators, browser engines, GPU kernels, and TPU kernels.

Each entry links to a first-party source (author README, official post, paper, or commit trailer). If the only source is a blog post or a paper and no public repository was found, the entry stays in the list and is marked unverified. To add or correct an entry, see [CONTRIBUTING.md](./CONTRIBUTING.md).

The site name, domain, and repository URL are in [`site/src/site.config.ts`](site/src/site.config.ts):

- Name: **What AI Built**
- Repo: [https://github.com/heemoe/agentbuilt](https://github.com/heemoe/agentbuilt)
- Site URL: [https://whataibuilt.com](https://whataibuilt.com) (Cloudflare Pages custom domain)

## Documents

- [`research.md`](./research.md): research notes (Chinese)
- [`seed-projects.yaml`](./seed-projects.yaml): seed catalog
- [`schema/project.schema.json`](./schema/project.schema.json): data schema
- [`CONTRIBUTING.md`](./CONTRIBUTING.md): how to submit an entry
- [`logo-preview.png`](./logo-preview.png): logo preview

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

The site is served from the root path. English is the default locale (no prefix). Simplified Chinese lives under `/zh/`. Local preview: `http://localhost:4321/` and `http://localhost:4321/zh/`.

Production canonical host is `https://whataibuilt.com`. `site/functions/_middleware.ts` returns a 301 to the same path and query on that host when the `Host` header is exactly `www.whataibuilt.com` or `agentbuilt.pages.dev`. Preview hostnames such as `feat.agentbuilt.pages.dev` and `<hash>.agentbuilt.pages.dev` are not redirected.

## Deploy (Cloudflare Pages)

Configuration lives in [`site/wrangler.toml`](site/wrangler.toml) (`name = "agentbuilt"`, `pages_build_output_dir = "dist"`).

If you connect the Git repository in the Cloudflare dashboard, use:

- **Root directory:** `site`
- **Build command:** `npm run build`
- **Build output directory:** `dist`

To publish a local production build:

```bash
cd site
npm run build
npx wrangler pages deploy dist --project-name=agentbuilt
```
