import { useQuery } from "@tanstack/react-query";
import type { SampleGroupsData } from "@checkyourstaff/console-backend/types";
import { getAccountId } from "../utils/getAccountId";
import { useApiClient } from "./useApiClient";

export const useFetchSampleGroups = () => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: ["sampleGroups"],
    async queryFn() {
      const { data } = await apiClient.get<SampleGroupsData>("/sampleGroups", {
        params: {
          accountId: getAccountId(),
        },
      });

      return data;
    },
  });
};
