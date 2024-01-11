import { pinCodesServiceClient } from "./pinCodesServiceClient";
import type { PinCodePayload } from "./types";

export const generatePinCode = async <P extends PinCodePayload>(payload: P) => {
  return pinCodesServiceClient?.create(payload);
};
