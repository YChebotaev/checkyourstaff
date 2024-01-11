import { pinCodesServiceClient } from "./pinCodesServiceClient";
import type { PinCodePayload } from "./types";

export const getPinCodePayload = <P extends PinCodePayload>(code: string) => {
  return pinCodesServiceClient?.get<P>(code);
};
