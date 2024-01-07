import { logger } from "./logger";
import { emailTransport } from "./emailTransport";

export const sendEmailInvite = async (pinCode: string, email: string) => {
  logger.info("Sending email to: %s", email);

  await emailTransport.sendMail({
    from: "noreply@checkyourstaff.ru",
    to: email,
    subject: "Приглашение на опрос",
    text: `Присоединитесь к боту в телеграмме: @checkyourstaffbot и введите пин-код: ${pinCode}`,
    html: `Присоединитесь к боту в телеграмме <a href="https://t.me/checkyourstaffbot">t.me/checkyourstaffbot</a> и введите пин-код: <b>${pinCode}</b>`,
  });

  logger.info("Email successfully sended");
};
