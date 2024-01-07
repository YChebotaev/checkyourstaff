import { createContext, useContext, type ReactNode } from "react";
import { type AxiosInstance } from "axios";

const context = createContext<AxiosInstance | null>(null);

export const useApiClient = () => {
  return useContext(context)!;
};

useApiClient.Provider = ({
  apiClient,
  children,
}: {
  apiClient: AxiosInstance;
  children: ReactNode;
}) => {
  return <context.Provider value={apiClient}>{children}</context.Provider>;
};
