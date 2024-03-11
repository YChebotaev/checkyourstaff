import { useQuery } from "@tanstack/react-query";
import { getAccountId } from "../../../lib/getAccountId";
import { useApiClient } from "../../../hooks/useApiClient";

export const useFetchSampleGroups = () => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ["sampleGroups"],
    async queryFn() {
      return apiClient.getSampleGroups({
        accountId: getAccountId()!
      })
    },
  });
};
