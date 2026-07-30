export interface ApiLeagueSummary {
  idLeague?: string | null
  strLeague?: string | null
  strSport?: string | null
  strLeagueAlternate?: string | null
}
export interface ApiLeagueDetails extends ApiLeagueSummary {
  strCountry?: string | null
  strCurrentSeason?: string | null
  intFormedYear?: string | null
  strDescriptionEN?: string | null
  strFanart1?: string | null
  strFanart2?: string | null
  strFanart3?: string | null
  strFanart4?: string | null
  strBanner?: string | null
}
export interface ApiSeason {
  strSeason?: string | null
  strBadge?: string | null
}
export interface AllLeaguesResponse {
  leagues?: ApiLeagueSummary[] | null
}
export interface LeagueDetailsResponse {
  leagues?: ApiLeagueDetails[] | null
}
export interface SeasonsResponse {
  seasons?: ApiSeason[] | null
}
export interface LeagueSummary {
  id: string
  name: string
  sport: string
  alternateName?: string
}
export interface LeagueDetails extends LeagueSummary {
  country?: string
  currentSeason?: string
  formedYear?: string
  description?: string
  fanartUrl?: string
}
export interface Season {
  name?: string
  badgeUrl?: string
}
export interface SelectedSeasonBadge {
  season?: string
  url: string
}
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'
