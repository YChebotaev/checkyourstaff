import { createClient } from "@checkyourstaff/pincodes-service/client";

export const pinCodesServiceClient =
  typeof process !== "undefined"
    ? createClient(process.env["PINCODES_URL"]!, 1, "--dummy-token--")
    : null;
