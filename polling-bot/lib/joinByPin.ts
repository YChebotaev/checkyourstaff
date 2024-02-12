import {
  inviteGet,
  inviteDelete,
  responderCreate,
  respondersGetBySampleGroupId,
  responderGetBySampleGroupIdAndUserId,
} from "@checkyourstaff/persistence";
import { getPinCodePayload } from "@checkyourstaff/common/getPinCodePayload";
import { logger } from "./logger";
import type { PinCodePayload } from "../types";

export const joinByPin = async ({
  code,
  userId,
}: {
  code: string;
  userId: number;
}) => {
  const pinCodePayload = await getPinCodePayload<PinCodePayload>(code);

  if (!pinCodePayload) {
    logger.warn('Pin code "%s" not found', code);

    return 'wrong-pin-code';
  }

  const { type, inviteId } = pinCodePayload;

  switch (type) {
    case "invite-responder": {
      const invite = await inviteGet(inviteId);

      if (!invite) {
        logger.warn("Invite with id = %s not found or deleted", inviteId);

        return;
      }

      await inviteDelete(invite.id);

      const responder = await responderGetBySampleGroupIdAndUserId(
        invite.sampleGroupId,
        userId,
      );

      if (responder) {
        return "already-joined";
      } else {
        await responderCreate({
          sampleGroupId: invite.sampleGroupId,
          inviteId: invite.id,
          userId,
        });
      }

      return true;
    }
    case "invite-administrator":
      logger.debug("Inviting administrators not supported yet");

      break;
  }

  return false;
};
