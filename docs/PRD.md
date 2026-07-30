# League Finder — Product Requirements Document

## Background and user problem

The assignment asks for a compact frontend demonstrating component architecture, state management, API integration, product logic, responsive UI, and request caching. Sports catalogues are difficult to scan when names, aliases, and sports are mixed together; users need a fast way to narrow the catalogue and confirm a competition’s season identity.

## Product hypothesis and target user

If a sports-platform visitor can combine forgiving name search with an API-derived sport filter and open a clear identity view, they can recognize the correct competition quickly. Session caching makes revisits immediate while limiting API traffic.

## Goals

- Load and normalize TheSportsDB’s league catalogue.
- Combine league/alternate-name search with API-derived sport filtering.
- Load season identity and lightweight context only after explicit selection.
- Remain useful during sparse data, image failure, and partial API failure.
- Provide responsive, keyboard-accessible desktop and mobile experiences.
- Avoid redundant successful or concurrent session requests.

## Non-goals

Odds, markets, betslip, matches, scores, standings, teams, authentication, profiles, favorites, payments, global sportsbook navigation, external league links, or actions without implemented destinations.

## User flow

1. Catalogue skeletons appear, then live API leagues load without auto-selection.
2. The user searches by league or alternate name and optionally filters by a dynamic sport.
3. The result count updates; selecting a row opens details immediately.
4. League details and badge-enabled seasons load concurrently and render independently.
5. Mobile back returns to the list and restores row focus.
6. Reselecting an enriched league uses cached data.

## Functional and data requirements

- Use only the configured TheSportsDB V1 catalogue, season-badge, and lookup endpoints.
- Normalize strings; omit invalid entities and missing enhancements without null text, broken punctuation, or empty shells.
- Derive unique sorted sports from non-empty API values and combine trimmed case-insensitive search with exact sport filtering.
- Clear selection when filtering removes it; implement real catalogue retry and clear-filters actions.
- Prefer a badge matching current season, then the first valid badge, and never substitute the details badge.
- Cache successful detail/season values, including empty values; deduplicate in-flight work and evict failures.

## Asset policy

League-specific sports assets and facts come from TheSportsDB. Detail background priority is `strFanart1` through `strFanart4`, then `strBanner`, then CSS gradient. The primary badge comes solely from season data. List initials avoid N+1 requests. A generic AI-generated multi-sport illustration is used only as catalogue interface artwork and does not represent a real team or league.

## State requirements

Catalogue states: skeleton loading, retryable error, populated, and no results. Detail states: deliberate empty, immediate loading, independent details/badge success or failure, badge unavailable, and remote image failure. Required assignment copy is used for the primary error and empty states.

## Responsive requirements

Desktop uses an approximately 40/60 independently scrollable catalogue/detail split. Mobile uses full-width controls and rows plus a dedicated full-viewport detail layer with back action, readable fanart overlay, prominent badge, scroll locking, and focus restoration. No mock bottom navigation is included.

## Accessibility

Semantic buttons, accessible control names, visible focus, `aria-pressed`, live counts, meaningful badge alt text, decorative fanart, strong contrast, comfortable touch targets, and reduced-motion support are required.

## Technical constraints

Vue 3 Composition API, `<script setup lang="ts">`, strict TypeScript, Vite, Tailwind Vite integration, native fetch, browser-native History API routing, and a compact dependency set. No Pinia, router package, Axios, query library, component framework, CSS-in-JS, or large animation framework. Browser-visible Vite configuration must be documented.

## Success and acceptance criteria

- Users can load, search, filter, select, identify, close, and revisit leagues without broken states.
- No hardcoded production league catalogue or sport list exists.
- Enrichment starts only on activation; current-season preference and fallback are deterministic.
- Partial success remains visible and missing media never breaks layout.
- Repeated, concurrent, empty, and failed caching scenarios match the contract.
- Desktop/mobile hierarchy matches the approved direction.
- Formatting, linting, type checking, tests, build, and npm audit pass.

## Risks and fallbacks

- **API outage/latency:** skeletons, independent state, and retries.
- **Sparse response:** retain catalogue identity and omit absent enhancements.
- **Image failure:** atmospheric CSS and explicit badge-unavailable copy.
- **Private key exposure:** server-side proxy.
- **Larger premium catalogue:** measure before adding virtualization.
