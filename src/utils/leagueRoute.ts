export const cataloguePath = '/'

export function leaguePath(id: string): string {
  return `/leagues/${encodeURIComponent(id)}`
}

export function isCataloguePath(pathname: string): boolean {
  return pathname === '/'
}

export function leagueIdFromPath(pathname: string): string | undefined {
  const match = /^\/leagues\/([^/?#]+)\/?$/.exec(pathname)
  if (!match?.[1]) return undefined

  try {
    const id = decodeURIComponent(match[1])
    return id && id !== 'all' ? id : undefined
  } catch {
    return undefined
  }
}
