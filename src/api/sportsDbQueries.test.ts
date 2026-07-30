import { QueryClient } from '@tanstack/vue-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SportsDbRequestError } from './sportsDbApi'
import {
  leagueDetailsQueryOptions,
  leaguesQueryOptions,
  shouldRetrySportsDbRequest,
  sportsDbCacheMaxAge,
} from './sportsDbQueries'

describe('sportsDbQueries', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            leagues: [
              { idLeague: '77', strLeague: 'Synthetic Test League', strSport: 'Test Sport' },
            ],
          }),
      }),
    )
  })

  it('reuses fresh detail data by query key', async () => {
    const queryClient = new QueryClient()
    await queryClient.fetchQuery(leagueDetailsQueryOptions('77'))
    await queryClient.fetchQuery(leagueDetailsQueryOptions('77'))
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('defines explicit freshness and retention policies', () => {
    expect(leaguesQueryOptions().staleTime).toBe(15 * 60 * 1000)
    expect(leagueDetailsQueryOptions('77').staleTime).toBe(30 * 60 * 1000)
    expect(leagueDetailsQueryOptions('77').gcTime).toBe(sportsDbCacheMaxAge)
  })

  it('retries only transient failures and only once', () => {
    expect(shouldRetrySportsDbRequest(0, new TypeError('network unavailable'))).toBe(true)
    expect(shouldRetrySportsDbRequest(0, new SportsDbRequestError(429))).toBe(true)
    expect(shouldRetrySportsDbRequest(0, new SportsDbRequestError(503))).toBe(true)
    expect(shouldRetrySportsDbRequest(0, new SportsDbRequestError(404))).toBe(false)
    expect(shouldRetrySportsDbRequest(1, new SportsDbRequestError(503))).toBe(false)
  })
})
