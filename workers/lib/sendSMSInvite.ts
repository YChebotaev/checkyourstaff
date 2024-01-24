import { DelayedError } from "bullmq";
import { logger } from "./logger";
import { smsTransport } from "./smsTransport";

export const sendSMSInvite = async (pinCode: string, phone: string) => {
  logger.info("Sending SMS to: %s", phone);

  const { status: sendStatus, messageId } = await smsTransport.send({
    phone,
    code: pinCode,
    text: `Присоединитесь к боту: t.me/checkyourstaffbot и введите пин-код: ${pinCode}`,
  });

  logger.info("SMS to number = %s status us: %s", phone, sendStatus);

  if (!messageId) {
    logger.error("SMS to number = %s failed with error: %s", phone, sendStatus);
    throw new Error(sendStatus);
  }

  if (sendStatus === "accepted") {
    const messageStatus = await smsTransport.waitForResolution(messageId);

    if (messageStatus === "delivered") {
      logger.info("SMS to number = %s successfully delivered", phone);

      return;
    } else if (messageStatus === "not enough balance") {
      logger.info(
        "SMS to number = %s sending failed because not enough balance",
        phone,
      );

      throw new DelayedError(
        `SMS to number = ${phone} sending failed because not enough balance`,
      );
    } else {
      logger.info(
        "SMS to number = %s failed with status: %s",
        phone,
        messageStatus,
      );

      throw new Error(messageStatus);
    }
  } else {
    logger.error("SMS to number = %s failed with error: %s", phone, sendStatus);

    throw new Error(sendStatus);
  }
};
