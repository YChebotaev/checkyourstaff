import { createTransport } from "nodemailer";

export const emailTransport = createTransport({
  host: "mail.netangels.ru",
  secure: false,
  debug: true,
  auth: {
    user: "noreply@checkyourstaff.ru",
    pass: process.env["SMTP_PASS"]!,
  },
});
