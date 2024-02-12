import { createContext, useContext, type ReactNode } from "react";
import { type ConsoleBackendClient } from "@checkyourstaff/console-backend/client";

const context = createContext<ConsoleBackendClient | null>(null);

export const useApiClient = () => {
  return useContext(context)!;
};

useApiClient.Provider = ({
  apiClient,
  children,
}: {
  apiClient: ConsoleBackendClient;
  children: ReactNode;
}) => {
  return <context.Provider value={apiClient}>{children}</context.Provider>;
};
