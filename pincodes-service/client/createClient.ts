import axios from "axios";
import { CreateData, GetData } from "../types";

export const createClient = (
  baseURL: string,
  tenantId: number,
  token: string,
) => {
  const client = axios.create({
    baseURL,
  });

  client.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  });

  return {
    async get<P>(code: string) {
      const { data } = await client.post<GetData<P>>("/get", {
        tenantId,
        code,
      });

      return data.payload;
    },
    async create(payload: any) {
      const { data } = await client.post<CreateData>("/create", {
        tenantId,
        payload,
      });

      return data.code;
    },
  };
};
