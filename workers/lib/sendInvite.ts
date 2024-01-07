import { UnrecoverableError } from "bullmq";
import { inviteGet } from "@checkyourstaff/persistence";
import { generatePinCode } from "@checkyourstaff/common";
import { logger } from "./logger";
import { emailTransport } from "./emailTransport";
import { smsTransport } from "./smsTransport";
import { sendEmailInvitesQueue } from './sendEmailInvitesQueue'
import { sendSMSInvitesQueue } from './sendSMSInvitesQueue'

export const sendInvite = async (inviteId: number) => {
  const invite = await inviteGet(inviteId);

  if (!invite) {
    throw new UnrecoverableError(
      `Invite with id = ${inviteId} not found or deleted`,
    );
  }

  logger.info("Invite = %s", JSON.stringify(invite));

  const pinCode = await generatePinCode({
    type: "invite-responder",
    inviteId,
  });

  logger.info("pinCode = %s", pinCode);

  if (!pinCode) {
    logger.error("Pin code not generated");

    throw new Error("Pin code not generated");
  }

  if (invite.email) {
    await sendEmailInvitesQueue.add('send-email-invite', {
      pinCode,
      email: invite.email
    })
  }

  if (invite.phone) {
    await sendSMSInvitesQueue.add('send-sms-invite', {
      pinCode,
      phone: invite.phone
    })
  }
};
