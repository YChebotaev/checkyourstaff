import axios from "axios";
import { logger } from "./logger";

export type SendStatusType =
  | "accepted"
  | "invalid mobile phone"
  | "text is empty"
  | "sender address invalid"
  | "wapurl invalid"
  | "invalid schedule time format"
  | "invalid status queue name"
  | "not enough credits"
  | "error";

export type MessageStatusType =
  | "queued"
  | "delivered"
  | "delivery error"
  | "smsc submit"
  | "smsc reject"
  | "incorrect id";

const login = process.env["IQSMS_LOGIN"]; //  process.env["SMSC_LOGIN"]; // process.env["IQSMS_LOGIN"];
const password = process.env["IQSMS_PASSWORD"]; //  process.env["SMSC_PASSWORD"]; // process.env["IQSMS_PASSWORD"];

if (!login || !password) {
  logger.fatal("IQSMS_LOGIN and IQSMS_PASSWORD environment must be provided");
  // logger.fatal("SMSC_LOGIN and SMSC_PASSWORD environment must be provided");

  process.exit(1);
}

export const smsTransport = {
  async send({
    phone,
    text,
    code,
  }: {
    phone: string;
    text: string;
    code: string;
  }) {
    const { data } = await axios.get("https://api.iqsms.ru/messages/v2/send", {
      params: {
        login,
        password,
        phone: phone,
        text,
      },
    });
    const [status, messageId] = data.split(";") as [SendStatusType, string];
    if (status === "error") {
      return {
        status: messageId,
        messageId: null,
      };
    }
    return {
      status,
      messageId,
    };
  },
  async getStatus(messageId: string) {
    const { data } = await axios.get(
      "https://api.iqsms.ru/messages/v2/status",
      {
        params: {
          login,
          password,
          id: messageId,
        },
      },
    );
    const [_, status] = data.split(";") as [string, MessageStatusType];
    return status;
  },
  // async getBalance() {
  //   const { data } = await axios.get(
  //     "https://api.iqsms.ru/messages/v2/balance",
  //     {
  //       params: {
  //         login,
  //         password,
  //       },
  //     },
  //   );

  //   console.log("getBalance()", "data =", data);

  //   const [currency, balance] = data.split(";");

  //   return {
  //     currency,
  //     balance: Number(balance),
  //   };
  // },
  async waitForResolution(messageId: string, pollingInterval = 3000) {
    let messageStatus: MessageStatusType;
    do {
      messageStatus = await this.getStatus(messageId);
      if (messageStatus === "queued") {
        await new Promise((resolve) => setTimeout(resolve, pollingInterval));
        continue;
      } else {
        return messageStatus;
      }
    } while (messageStatus === "queued");
  },
};
