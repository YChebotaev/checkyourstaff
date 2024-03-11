import { useSuspenseQuery } from '@tanstack/react-query'
import { useApiClient } from "../../../hooks/useApiClient"
import { getAccountId } from '../../../lib/getAccountId'

export const useStatsPageData = () => {
  const apiClient = useApiClient()

  const { data } = useSuspenseQuery({
    queryKey: ["stats"],
    queryFn: () => apiClient.getStats({ accountId: getAccountId()! })
  })

  return data
}
