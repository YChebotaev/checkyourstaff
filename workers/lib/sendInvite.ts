import { UnrecoverableError } from "bullmq";
import { inviteGet } from "@checkyourstaff/persistence";
import { generatePinCode } from "@checkyourstaff/common/generatePinCode";
import { sendSmsInvite } from "@checkyourstaff/common/sendSMSInvitesQueue";
import { sendEmailInvite } from "@checkyourstaff/common/sendEmailInvitesQueue";
import { logger } from "./logger";

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

  for (const { type, value } of invite.contacts) {
    switch (type) {
      case 'email':
        await sendEmailInvite({
          pinCode,
          email: value
        })

        return
      case 'phone':
        await sendSmsInvite({
          pinCode,
          phone: value
        })

        return
    }
  }
};
