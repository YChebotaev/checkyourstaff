import { useSuspenseQuery } from "@tanstack/react-query"
import { ChartsByQuestionResp } from "@checkyourstaff/console-backend/types"
import { useApiClient } from "../../../hooks/useApiClient"
import { getAccountId } from "../../../lib/getAccountId"

export const useChartsByQuestion = ({ questionId }: { questionId: number }) => {
  const apiClient = useApiClient()

  return useSuspenseQuery({
    queryKey: ['charts', { questionId }],
    queryFn: () => apiClient.getCharts({
      accountId: getAccountId()!,
      questionId
    }) as unknown as Awaited<ChartsByQuestionResp>
  })
}
