import { useSuspenseQuery } from '@tanstack/react-query'
import { useApiClient } from "../../../hooks/useApiClient"
import { getAccountId } from '../../../lib/getAccountId'

export const useFeedbackPageData = () => {
  const apiClient = useApiClient()

  const { data } = useSuspenseQuery({
    queryKey: ["textFeedback"],
    queryFn: () => apiClient.getTextFeedback({ accountId: getAccountId()! })
  })

  return data
}
