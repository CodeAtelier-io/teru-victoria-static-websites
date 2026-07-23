# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules — read before doing anything

1. **Never commit.** Do not run `git commit`, `cherry-pick`, `merge`, or `rebase`. Make edits and stop — the user reviews the diff and commits himself. "Add this change" / "apply the feature" is **not** commit authorization; only an explicit "commit this" is.
2. **Never add infra / CI / deploy files.** No GitHub Actions, Dockerfiles, k8s, Terraform, nginx configs, or deploy scripts unless explicitly asked. That is devops' job, not frontend's. Ask first if you think one is genuinely needed.
3. **Never hard-code brand values.** No literal brand names, hex colours, or brand asset paths in components or SCSS. Read brand data from `ConfigService`, brand display name from `I18nService.brandName()`, and style with the CSS custom properties `ConfigService.applyTheme()` sets on `:root`. Adding a third brand must require **zero** code changes.
4. **Don't scaffold speculatively.** No configs, lint rules, generators, or "phase N" plumbing that wasn't requested. Stay narrowly inside the asked change.
5. **Verify with a build.** There are no tests (see Testing below), so `npm run build:all` is the only real check. Run it before claiming something works.

## Project structure — read before changing code

This is **one Angular 22 build that ships two white-label brands** as static one-page marketing sites — **Victoria 111** and **Teru Credit** (Bulgarian non-bank lenders). Design modelled on itfgroupbg.com.

- **The app lives in `frontend/`**, not the repo root (moved 2026-07-23, PR #2). All npm commands run from `frontend/`. A `backend/` sibling is anticipated but does not exist yet.
- **`.gitignore` is at the repo root and uses un-anchored patterns** (`.angular/`, `dist/`, `node_modules/`) so they match inside `frontend/`. A middle slash like `.angular/cache` anchors to the repo root only and silently fails to ignore `frontend/.angular/cache` — this already caused 8 MB of build cache to be committed once. Never re-anchor them.
- **Brand is runtime config, not a build flag.** Active brand = `public/config.json`, fetched by `ConfigService` in a `provideAppInitializer` **before** first render. `node scripts/set-brand.mjs <brand>` copies `public/brands/config.<brand>.json` → `public/config.json`.
- **i18n is custom** (`I18nService`, no ngx-translate). Base `public/i18n/{en,bg}.json` deep-merged with a per-brand overlay `public/i18n/<brand>/{en,bg}.json`. EN + BG. Brand display name is localized — templates use `i18n.brandName()`, never `config.brand.name`.
- **Theme:** `ThemeService` toggles `data-theme` on `<html>` (localStorage `app.theme`, defaults to OS preference). An inline script in `index.html` applies it before first paint. Brand config owns **only accents**; neutrals are theme-owned in `styles.scss`.
- **Layout:** `AppComponent` = header + `HomeComponent` + footer. `HomeComponent` assembles `sections/*` according to the `features` flags in the brand config. Shared code in `src/app/core/` (services, directives, models).
- **`app.routes.ts` is currently empty** (`routes: Routes = []`) — it's a single-page scroll site. That file is where routing goes when it's needed.

## Frontend conventions

Follow `/frontend-engineer` (`.claude/skills/frontend-engineer/SKILL.md`). The essentials as they apply here:

- **Zoneless + signals.** No zone.js. Component state is `signal()`, derived state is `computed()`, and `effect()` is only for true side effects (DOM, storage, logging) — never to derive state.
- **Translations are read via method calls in templates** (`i18n.t('key')`, `i18n.brandName()`). This is deliberate: the calls read signals internally, so they stay reactive. A pure pipe would go stale under zoneless.
- **Do not add `changeDetection:` to components.** In Angular 22 `OnPush` is the framework default (`Default` is now a deprecated alias for `Eager`). The v22 `ng update` migration adds `ChangeDetectionStrategy.Eager` everywhere for back-compat — that was deliberately reverted here. Leave it off.
- **Before ever putting a component back on `Eager`,** know why: OnPush is safe here only because every template-bound value is signal-backed. Keep it that way — if you add plain mutable state that a template reads, it will silently go stale with no error.
- **No RxJS in the app today.** If you add it for a real stream problem (HTTP orchestration, debouncing, cancellation, combining async sources), bridge to templates with `toSignal()` and use `takeUntilDestroyed()` rather than manual `ngOnDestroy` unsubscribes. Don't rewrite a working pipeline into signal-only code.
- **Directives** (`reveal`, `count-up`, `tilt`, `scroll`, `scene`) write the DOM directly and clean up in `ngOnDestroy`. They don't participate in change detection — keep it that way.
- SCSS only, with CSS custom properties. **No Tailwind.**

## Commands

All from `frontend/`.

| Command | Does |
|---|---|
| `npm run start:victoria` / `start:teru` | Dev server for one brand |
| `npm run build:victoria` / `build:teru` | Production build → `dist/<brand>/` |
| `npm run build:all` | Both brands |
| `npm run config:victoria` / `config:teru` | Swap active brand without building |

**Gotcha:** every build/start script runs `set-brand.mjs` first, so `build:all` leaves `public/config.json` flipped to **teru** as a working-tree change. Run `git checkout -- public/config.json` afterwards or it lands in the diff.

## Testing

There are **no spec files**. `npx vitest run` exits code 1 with "No test files found" — vitest and jsdom are installed but unused, so the suite verifies nothing. Don't cite a passing test run as evidence. Use `npm run build:all`, and say plainly when something is unverified.

## Growing the app: backend data and admin panel

Neither exists yet. When that work starts, follow these conventions rather than inventing new ones:

- **HTTP layer.** The app currently uses raw `fetch()` in `ConfigService` and `I18nService` for static JSON, and does **not** call `provideHttpClient()`. Real API work should add `provideHttpClient()` in `app.config.ts` and use `HttpClient` — don't spread `fetch` calls through feature services.
- **API base URL belongs in the brand config** (`BrandConfig`), not a hard-coded constant or an `environment.ts` — the same build serves both brands. Public content requests should carry the active `brand` and `lang`.
- **Keep the two halves separate if an admin panel arrives.** Public marketing code under `src/app/sections/` + `pages/`; admin code under its own folder with its own shell component and guarded routes in `app.routes.ts`. Never import admin features into the public site or vice-versa. Shared code goes in `src/app/core/`.
- **Auth.** Nothing is authenticated today. If an admin panel needs JWT, centralise attach/refresh and HTTP error handling in one interceptor — don't duplicate it per service. Pull in `/security` before implementing auth flows.
- **Backend is C#/Clean Architecture** per `/backend-engineer` — but do not write server-side domain logic from the frontend side. Agree the contract first (`/engineering` or `/system-architect`).

## Skills

Invoke with `/skill-name` or by describing the task. Definitions live in `.claude/skills/`.

| Skill | Use when |
|---|---|
| `/frontend-engineer` | Angular components, forms, services, routing, UI bugs, state, API integration |
| `/backend-engineer` | C# endpoints, application services, validation, domain logic, persistence |
| `/qa` | Test cases, edge cases, bug reproduction, regression coverage |
| `/system-architect` | Module boundaries, restructuring, major technical decisions |
| `/security` | Auth, authorization, tokens, secrets, sensitive data, security review |
| `/devops` | CI/CD, environments, deployments, release workflows |
| `/engineering` | Turning ready requirements into a technical plan across layers |
| `/orchestrator` | Work spanning multiple skills, or when the owner is unclear |
| `/product` | Vague features, unclear business rules, scope and acceptance criteria |
| `/analytics` | Event design, measurement plans, funnels, tracking consistency |
| `/data-ai` | Data models, transformations, contract consistency, AI-assisted workflows |

Preferred sequences: `product → engineering → implementation → qa` for new features; `engineering → frontend-engineer + backend-engineer → qa` for application work; add `security` whenever auth, tokens, or sensitive data are involved.

## MCP Servers

- **Context7** — library/framework documentation. Use when the task involves Angular, Leaflet, or other third-party API details, or when the user explicitly asks. Prefer it over web search for library docs.
- **Memory** — project-scoped. Use when the user asks to load, search, remember, or update memory. Don't write to it automatically; only on explicit request or an end-of-session summary. Keep entries short — no secrets, tokens, or large file contents.
