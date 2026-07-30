# League Finder

League Finder is a focused Vue 3 SPA for finding, filtering, and visually identifying sports competitions. Production contains no hardcoded league catalogue. League-specific content and imagery come from TheSportsDB at runtime; the generic catalogue illustration was generated with ChatGPT Image and is documented in `AI_USAGE.md`.

**Live demo:** [league-finder-six.vercel.app](https://league-finder-six.vercel.app)

## Requirements and setup

- Node.js 20.19+ or 22.12+
- npm 10+
- Network access to `www.thesportsdb.com`

```bash
npm install
copy .env.example .env
npm run dev
```

The environment copy is optional because the assignment’s public key (`3`) and V1 base URL are defaults.

```env
VITE_SPORTSDB_API_KEY=3
VITE_SPORTSDB_API_BASE_URL=https://www.thesportsdb.com/api/v1/json
```

A premium V1 key can replace `3` without code changes. Every `VITE_` variable is embedded into browser-delivered code and is visible to users. A private production key requires a server-side proxy.

## Commands

| Command                | Purpose                            |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start Vite                         |
| `npm run build`        | Type-check and create `dist/`      |
| `npm run test`         | Run Vitest                         |
| `npm run typecheck`    | Run strict Vue/TypeScript checking |
| `npm run lint`         | Run ESLint with zero warnings      |
| `npm run format`       | Format with Prettier               |
| `npm run format:check` | Verify formatting                  |

## Deployment

The production site is deployed on Vercel and connected to this GitHub repository. Pushes to `main` trigger production deployments. `vercel.json` rewrites application routes to `index.html`, allowing direct visits to league detail URLs such as `/leagues/<idLeague>`.

To create a production deployment manually:

```bash
vercel --prod
```

## API and enrichment

The centralized native-fetch layer uses `all_leagues.php`, `search_all_seasons.php?badge=1&id=<idLeague>`, and `lookupleague.php?id=<idLeague>`. Details and seasons begin in parallel only after explicit selection. Current-season badge match is preferred, followed by the first valid season badge; the details badge is never substituted. Either enrichment request may fail without hiding the successful half.

## Caching

TanStack Vue Query owns server state with stable keys for the catalogue, league details, and seasons. The catalogue remains fresh for 15 minutes, details for 30 minutes, and seasons for 6 hours. Stale data stays visible while Vue Query refreshes it in the background; concurrent consumers share requests automatically.

Successful normalized responses—including `null` and empty arrays—are persisted to `sessionStorage` for up to 24 hours with a schema-version buster. This allows refreshes and direct detail routes to hydrate immediately without carrying data across browser sessions. Rate limits, server errors, and network failures receive one retry with backoff; other client errors are surfaced immediately. Failed responses are never persisted.

## Frontend routing

The catalogue uses `/` and selected leagues use `/leagues/<idLeague>`. Vue Router provides clean URLs, dynamic league parameters, history navigation, and initial-navigation readiness. A direct detail visit renders its skeleton from the route state while the catalogue resolves, then uses the normal cached selection flow. Production hosting must rewrite unknown frontend routes to `index.html`; Vite development and preview already provide this SPA fallback.

## Responsive and accessible behavior

Desktop uses a fixed 520px catalogue sidebar and a fluid detail panel. Mobile opens a dedicated full-viewport detail layer with a back action and focus restoration. Rows are semantic buttons, focus is visible, counts are live, badge alternatives are meaningful, fanart is decorative beneath contrast overlays, touch targets are comfortable, and reduced motion is respected.

## Technical decisions and tradeoffs

- Vue 3 Composition API, `<script setup lang="ts">`, strict TypeScript, Vite, and Tailwind through `@tailwindcss/vite`.
- Composables own catalogue and selection state; nullable API wire models are normalized before rendering.
- Neutral initials avoid N+1 detail requests for list artwork.
- Vue Router owns URL matching and navigation, while TanStack Vue Query owns remote server state and session-scoped persistence; no client-state store, component framework, or list virtualization is required.
- Descriptions are clamped because no secondary reading workflow is in scope.

## Known API limitations

The free API can be slow, rate-limited, unavailable, CORS-restricted, or sparse. Remote images can fail independently. The UI includes catalogue retry, partial detail success, badge-unavailable, CSS-only fanart fallback, and omission of missing metadata. Private premium-key production should use a monitored server-side proxy and explicit cache policy.

See the [AI usage disclosure](AI_USAGE.md).
