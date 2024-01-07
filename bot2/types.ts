export type PinCodeType =
  | 'invite-responder'
  | 'invite-administrator'

export type PinCodePayload = {
  type: PinCodeType
  inviteId: number
}
