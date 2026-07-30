import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { QueryClient } from '@tanstack/vue-query'
import { sportsDbCacheMaxAge, sportsDbQueryKeys } from './sportsDbQueries'

export const sportsDbQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: sportsDbCacheMaxAge,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: window.sessionStorage,
  key: 'league-finder-sports-db-cache',
  throttleTime: 1000,
})

export function persistSportsDbQueries(queryClient: QueryClient) {
  return persistQueryClient({
    queryClient,
    persister,
    maxAge: sportsDbCacheMaxAge,
    buster: 'normalized-sports-db-v1',
    dehydrateOptions: {
      shouldDehydrateQuery: (query) =>
        query.state.status === 'success' && query.queryKey[0] === sportsDbQueryKeys.all[0],
    },
  })
}
