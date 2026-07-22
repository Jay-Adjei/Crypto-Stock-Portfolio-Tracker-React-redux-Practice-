import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { ASSET_CATALOG } from '../../data/mockAssets'
import type { MarketQuote } from '../../types'
import { fetchMarketQuotes } from './mockMarketApi'

/**
 * Level 3: RTK Query endpoint with polling support for live market data.
 * Components can use `useGetLiveQuotesQuery` with `pollingInterval`.
 */
export const marketApi = createApi({
  reducerPath: 'marketApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Quotes'],
  endpoints: (builder) => ({
    getLiveQuotes: builder.query<MarketQuote[], string[] | void>({
      async queryFn(assetIds) {
        try {
          const ids =
            assetIds && assetIds.length > 0
              ? assetIds
              : ASSET_CATALOG.map((asset) => asset.id)
          const data = await fetchMarketQuotes(ids)
          return { data }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'RTK Query market fetch failed'
          return { error: { status: 'CUSTOM_ERROR', error: message } }
        }
      },
      providesTags: ['Quotes'],
    }),
  }),
})

export const { useGetLiveQuotesQuery } = marketApi
