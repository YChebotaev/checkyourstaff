import { useQuery } from "@tanstack/react-query"
import type { Account } from "@checkyourstaff/persistence/types"
import { useDebounce } from "./useDebounce"
import { useApiClient } from "./useApiClient"

export const useGetAccountsByName = (name: string) => {
  const apiClient = useApiClient()
  const debouncedName = useDebounce(name, 400)

  return useQuery({
    queryKey: ['accounts', { name: debouncedName }],
    async queryFn() {
      const { data } = await apiClient.get<Account[]>('/accounts', {
        params: {
          name: debouncedName
        }
      })

      return data
    }
  })
}
