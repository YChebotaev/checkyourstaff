import { useQuery } from "@tanstack/react-query";
import { getAccountId } from "../utils/getAccountId";
import { useApiClient } from "./useApiClient";

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
