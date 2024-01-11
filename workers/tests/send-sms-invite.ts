import { sendSMSInvitesQueue } from "../lib/sendSMSInvitesQueue";

sendSMSInvitesQueue
  .add(
    "send-sms-invite",
    {
      pinCode: "5678",
      phone: "+7 912 034 51 01",
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 65000,
      },
    },
  )
  .then(() => {
    process.exit(1);
  });
