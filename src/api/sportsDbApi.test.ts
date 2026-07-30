import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearSportsDbCache } from './sportsDbCache'
import { fetchLeagueDetails } from './sportsDbApi'

describe('sportsDbApi caching integration', () => {
  beforeEach(() => {
    clearSportsDbCache()
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

  it('does not repeat the detail network request after reselection', async () => {
    await fetchLeagueDetails('77')
    await fetchLeagueDetails('77')
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})
