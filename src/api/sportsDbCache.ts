const resolved = new Map<string, unknown>()
const inFlight = new Map<string, Promise<unknown>>()

export function cachedRequest<T>(key: string, request: () => Promise<T>): Promise<T> {
  if (resolved.has(key)) return Promise.resolve(resolved.get(key) as T)
  const pending = inFlight.get(key)
  if (pending) return pending as Promise<T>

  const promise = request()
    .then((value) => {
      resolved.set(key, value)
      inFlight.delete(key)
      return value
    })
    .catch((error: unknown) => {
      inFlight.delete(key)
      throw error
    })

  inFlight.set(key, promise)
  return promise
}

export function clearSportsDbCache(): void {
  resolved.clear()
  inFlight.clear()
}
