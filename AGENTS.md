# Repository Guidelines

## Project Structure & Module Organization
- `index.html` loads the application shell and wires the CSS/JS bundles.
- `css/styles.css` hosts the primary theme; keep component-specific overrides colocated.
- `js/main.js` bootstraps the app, delegating logic to feature modules.
- `js/core/` handles file ingestion, parsing, and data orchestration.
- `js/ui/` contains DOM helpers, modal/table renderers, and filter wiring.
- `js/features/` groups optional capabilities such as downloads; mirror this pattern for new features.
- `js/utils/` is reserved for shared helpers; prefer pure functions.
- Store sample assets or large fixtures outside the repo; reference them in docs instead.

## Build, Test, and Development Commands
- `python -m http.server 8080` serve the site locally with ES module support.
- `npx serve` quick static host without adding dependencies.
- `npm exec live-server` (or VS Code’s Live Server) for auto-reload while iterating.
- Use `ctrl+shift+r` in the browser to hard-reload when tweaking module exports.

## Coding Style & Naming Conventions
- Use 4-space indentation in JS and CSS; keep lines under 120 chars.
- Prefer ES modules with named exports; default exports only for single-purpose entry points.
- Name files in `camelCase.js`; folders use lowercase.
- Favor descriptive function names (`processFiles`, `initLiveFilters`) and keep side effects grouped near UI modules.
- Comment sparingly; document non-obvious parsing logic and regex boundaries inline.

## Testing Guidelines
- No automated suite is present yet; add unit coverage under a future `tests/` directory mirroring `js/`.
- When adding parsing logic, validate with representative TXT snippets and capture console outputs.
- Document manual QA steps in PRs (browser, file size, filters exercised).
- Aim for deterministic modules that can be unit-tested with Node + `vitest` or similar when introduced.

## Commit & Pull Request Guidelines
- Follow the existing short, imperative style (`Improve TXT upload validation`).
- Scope commits by feature or fix; avoid bundling unrelated refactors.
- PRs should outline intent, impacted modules, manual verification, and any follow-up tasks.
- Link GitHub Issues when available; include screenshots/gifs for UI tweaks.

## Configuration Tips
- Keep sensitive environment data out of `settings.local.json`; commit only redacted examples.
- Note parsing assumptions in `PARSING_STRUCTURE.md` when they evolve to keep docs aligned with logic.
