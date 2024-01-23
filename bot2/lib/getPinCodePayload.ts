import { pinCodesServiceClient } from "./pinCodesServiceClient";
import { logger } from "./logger";

export const getPinCodePayload = async <P>(code: string) => {
  try {
    return pinCodesServiceClient.get<P>(code);
  } catch (e) {
    logger.error(e);
  }
};
