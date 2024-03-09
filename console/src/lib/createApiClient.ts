import { createClient } from "@checkyourstaff/console-backend/client";
import { getToken } from "../utils/getToken";

export const createApiClient = () => {
  return createClient({
    baseURL: import.meta.env["VITE_BACKEND_URL"],
    getToken: () => getToken() ?? undefined,
  });
}
