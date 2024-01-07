export type VerifyBody = {
  initData: string
}

export type VerifyData = {
  valid: boolean
}

export type CompleteRegistrationBody = {
  name: string
  groupName: string
  list: string
  chatId: string
  userId: string
}
