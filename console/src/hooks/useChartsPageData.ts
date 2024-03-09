import { useQuery } from '@tanstack/react-query'
import { useApiClient } from "./useApiClient"
import { getAccountId } from '../utils/getAccountId'

export const useChartsPageData = (sampleGroupId: number) => {
  const apiClient = useApiClient()

  const { data } = useQuery({
    queryKey: ['charts', sampleGroupId],
    queryFn: () => apiClient.getCharts({
      accountId: getAccountId()!,
      sampleGroupId
    })
  })

  return data
}
