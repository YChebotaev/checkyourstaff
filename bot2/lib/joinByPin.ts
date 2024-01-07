import { inviteGet, inviteDelete, responderCreate } from "@checkyourstaff/persistence"
import { logger } from "./logger"
import { getPinCodePayload } from "./getPinCodePayload"
import type { PinCodePayload } from "../types"

export const joinByPin = async (
  {
    code,
    userId,
    sendMessage
  }: {
    code: string
    userId: number
    sendMessage(text: string): Promise<void>
  }) => {
  const pinCodePayload = await getPinCodePayload<PinCodePayload>(code)

  if (!pinCodePayload) {
    logger.warn('Pin code "%s" not found', code)

    return
  }

  const { type, inviteId } = pinCodePayload

  switch (type) {
    case 'invite-responder': {
      const invite = await inviteGet(inviteId)

      if (!invite) {
        logger.warn("Invite with id = %s not found or deleted", inviteId)

        return
      }

      await inviteDelete(invite.id)

      await responderCreate({
        sampleGroupId: invite.sampleGroupId,
        userId
      })

      await sendMessage('Вы успешно присоединились к группе. Скоро к вам придут вопросы по поводу вашей работы')

      break
    }
    case 'invite-administrator':
      logger.debug('Inviting administrators not supported yet')

      break
  }
}
