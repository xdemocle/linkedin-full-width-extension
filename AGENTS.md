## Project Context

A TypeScript project with 31 files across 11 directories. Uses monorepo.

## Stack

**Languages:**
- TypeScript (67%)
- JavaScript (19%)
- YAML (10%)
- CSS (5%)

**Frameworks & Tools:**
- Jest (testing)

## Commands

```bash
pnpm dev  # dev
pnpm build  # build
pnpm build:firefox  # build:firefox
pnpm build:chrome  # build:chrome
pnpm build:opera  # build:opera
pnpm test  # test
pnpm test:watch  # test:watch
```

## Conventions

- **Naming**: mixed
- **File organization**: flat
- **Monorepo**: Yes
- **Config files**: tsconfig.json, eslint.config.mjs, .prettierrc

## Architecture

**Key directories:**
- `__tests__/` - Test files
- `assets/` - Project assets
- `docs/` - Documentation
- `entrypoints/`
- `mocks/`
- `public/` - Static public assets
- `types/` - Type definitions

## Boundaries

**Always:**
- Run `pnpm test` before committing changes
- Follow mixed naming convention
- Follow flat file organization

**Ask first:**
- Adding new dependencies
- Changing project configuration files
- Adding new packages/workspaces

**Never:**
- Commit secrets, API keys, or .env files
- Delete or overwrite test files without understanding them
- Force push to main/master branch
- Make cross-package changes without checking downstream effects

<!-- agentseed:meta {"sha":"81844aebffb59e1b21ca62ea084cbd01758a2dbe","timestamp":"2026-07-03T18:35:34.188Z","format":"agentseed-v1"} -->
