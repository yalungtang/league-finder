import { describe, expect, it } from 'vitest'
import { cataloguePath, isCataloguePath, leagueIdFromPath, leaguePath } from './leagueRoute'

describe('league routes', () => {
  it('builds and parses a league route', () => {
    expect(leaguePath('4328')).toBe('/leagues/4328')
    expect(leagueIdFromPath('/leagues/4328')).toBe('4328')
  })

  it('encodes route values safely', () => {
    const path = leaguePath('league id')
    expect(path).toBe('/leagues/league%20id')
    expect(leagueIdFromPath(path)).toBe('league id')
  })

  it('treats the catalogue and malformed paths as no selection', () => {
    expect(cataloguePath).toBe('/')
    expect(isCataloguePath(cataloguePath)).toBe(true)
    expect(leagueIdFromPath(cataloguePath)).toBeUndefined()
    expect(leagueIdFromPath('/teams/4328')).toBeUndefined()
    expect(leagueIdFromPath('/leagues/%')).toBeUndefined()
  })
})
