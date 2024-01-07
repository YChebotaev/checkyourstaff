import { logger } from "./logger";
import { smsTransport } from "./smsTransport";

export const sendSMSInvite = async (pinCode: string, phone: string) => {
  logger.info("Sending SMS to: %s", phone);

  // const { balance } = await smsTransport.getBalance()
  const { status: sendStatus, messageId } = await smsTransport.send(
    phone,
    `Присоединитесь к боту в телеграмме: t.me/checkyourstaffbot и введите пин-код: ${pinCode}`,
  );

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
    } else {
      logger.info(
        "SMS to number = %s failed with status:",
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
