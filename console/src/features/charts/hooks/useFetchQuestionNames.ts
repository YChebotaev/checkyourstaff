import { useSuspenseQuery } from '@tanstack/react-query'
import { useApiClient } from '../../../hooks/useApiClient'
import { getAccountId } from '../../../lib/getAccountId'

export const useFetchQuestionNames = () => {
  const apiClient = useApiClient()

  return useSuspenseQuery({
    queryKey: ['/pollQuestiosn/distinctNames'],
    queryFn: () => apiClient.getPollQuestionsDistinctNames({ accountId: getAccountId()! })
  })
}
