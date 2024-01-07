import { pinCodesServiceClient } from './pinCodesServiceClient'

export const getPinCodePayload = <P,>(code: string): Promise<P | undefined> => {
  return pinCodesServiceClient.get(code)
}
