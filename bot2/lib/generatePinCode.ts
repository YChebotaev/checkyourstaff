import { pinCodesServiceClient } from './pinCodesServiceClient'

export const generatePinCode = async <P,>(payload: P) => {
  await pinCodesServiceClient.create(payload)
}
