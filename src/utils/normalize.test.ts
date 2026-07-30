import { describe, expect, it } from 'vitest'
import { pickFanart, selectSeasonBadge } from './normalize'

describe('detail normalization', () => {
  it('prefers the current season badge', () =>
    expect(
      selectSeasonBadge(
        [
          { name: '2024', badgeUrl: 'first.png' },
          { name: '2025', badgeUrl: 'current.png' },
        ],
        '2025',
      ),
    ).toEqual({ season: '2025', url: 'current.png' }))
  it('falls back to the first valid badge', () =>
    expect(
      selectSeasonBadge([{ name: '2025' }, { name: '2024', badgeUrl: 'fallback.png' }], '2025'),
    ).toEqual({ season: '2024', url: 'fallback.png' }))
  it('uses the required fanart priority', () =>
    expect(pickFanart({ strFanart2: 'second.jpg', strBanner: 'banner.jpg' })).toBe('second.jpg'))
})
