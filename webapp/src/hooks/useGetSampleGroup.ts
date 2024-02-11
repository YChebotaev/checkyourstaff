import { useQuery } from '@tanstack/react-query'
import type { SampleGroup } from '@checkyourstaff/persistence/types'
import { useApiClient } from "./useApiClient"

export const useGetSampleGroup = (sampleGroupId: number) => {
  const apiClient = useApiClient()

  return useQuery({
    queryKey: ['sampleGroups', sampleGroupId],
    async queryFn() {
      const { data } = await apiClient.get<SampleGroup>(`/sampleGroups/${sampleGroupId}`)

      return data
    }
  })
}
