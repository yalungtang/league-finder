import { beforeEach, describe, expect, it, vi } from 'vitest'
import { cachedRequest, clearSportsDbCache } from './sportsDbCache'

describe('sportsDbCache', () => {
  beforeEach(clearSportsDbCache)

  it('uses a cached response when the same league is selected again', async () => {
    const request = vi.fn().mockResolvedValue({ id: '42' })
    await cachedRequest('details:42', request)
    await cachedRequest('details:42', request)
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('deduplicates concurrent detail requests', async () => {
    let resolveRequest!: (value: string) => void
    const request = vi.fn(() => new Promise<string>((resolve) => (resolveRequest = resolve)))
    const first = cachedRequest('details:9', request)
    const second = cachedRequest('details:9', request)
    resolveRequest('complete')
    await expect(Promise.all([first, second])).resolves.toEqual(['complete', 'complete'])
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('caches successful empty values', async () => {
    const request = vi.fn().mockResolvedValue(null)
    await expect(cachedRequest('details:empty', request)).resolves.toBeNull()
    await expect(cachedRequest('details:empty', request)).resolves.toBeNull()
    expect(request).toHaveBeenCalledTimes(1)
  })

  it('does not permanently cache rejected requests', async () => {
    const request = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error('temporary failure'))
      .mockResolvedValueOnce('recovered')
    await expect(cachedRequest('details:retry', request)).rejects.toThrow('temporary failure')
    await expect(cachedRequest('details:retry', request)).resolves.toBe('recovered')
    expect(request).toHaveBeenCalledTimes(2)
  })
})
