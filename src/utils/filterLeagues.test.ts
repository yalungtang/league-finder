import { describe, expect, it } from 'vitest'
import type { LeagueSummary } from '../types/sports'
import { deriveSportOptions, filterLeagues } from './filterLeagues'

const leagues: LeagueSummary[] = [
  { id: '1', name: 'Northern Stars', alternateName: 'The Aurora', sport: 'Soccer' },
  { id: '2', name: 'Metro Hoops', sport: 'Basketball' },
  { id: '3', name: 'Coastal Cup', alternateName: 'Ocean Series', sport: 'Soccer' },
  { id: '4', name: 'Rapid Circuit', sport: 'Motorsport' },
]

describe('league filters', () => {
  it('matches league names case-insensitively and trims the query', () =>
    expect(filterLeagues(leagues, '  NORTHERN  ', '')).toEqual([leagues[0]]))
  it('matches alternate names case-insensitively', () =>
    expect(filterLeagues(leagues, 'oCeAn', '')).toEqual([leagues[2]]))
  it('combines sport and search filters', () => {
    expect(filterLeagues(leagues, 'cup', 'Soccer')).toEqual([leagues[2]])
    expect(filterLeagues(leagues, 'cup', 'Basketball')).toEqual([])
  })
  it('derives unique alphabetized sport options from API models', () =>
    expect(deriveSportOptions(leagues)).toEqual(['Basketball', 'Motorsport', 'Soccer']))
})
