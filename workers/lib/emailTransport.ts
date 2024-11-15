import { createTransport } from "nodemailer";

export const emailTransport = createTransport({
  host: "mail.netangels.ru",
  secure: false,
  debug: true,
  auth: {
    user: "noreply@kaknarabote.ru",
    pass: process.env["SMTP_PASS"]!,
  },
});
