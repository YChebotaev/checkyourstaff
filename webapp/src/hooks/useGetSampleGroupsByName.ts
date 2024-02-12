import { useQuery } from "@tanstack/react-query"
import type { SampleGroup } from "@checkyourstaff/persistence/types"
import { useDebounce } from "./useDebounce"
import { useApiClient } from "./useApiClient"

export const useGetSampleGroupsByName = (name: string, accountId: number) => {
  const apiClient = useApiClient()
  const debouncedName = useDebounce(name, 400)

  return useQuery({
    queryKey: ['sampleGroups', { name: debouncedName, accountId }],
    async queryFn() {
      const { data } = await apiClient.get<SampleGroup[]>('/sampleGroups', {
        params: {
          name: debouncedName,
          accountId
        }
      })

      return data
    }
  })
}
