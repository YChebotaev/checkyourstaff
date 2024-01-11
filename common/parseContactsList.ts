// @ts-nocheck

import emailRegex from "email-regex-safe";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js/mobile";
import { deduplicateContacts } from "./deduplicateContacts";

export type ContactRecord = {
  type: "email" | "phone";
  value: string;
};

export const parseContactsList = (list: string) => {
  const filteredLines = list
    .split("\n")
    .map((line) => line.trim())
    .filter((trimmedLine) => trimmedLine.length);

  const contacts: ContactRecord[] = [];

  for (const trimmedLine of filteredLines) {
    if (emailRegex({ exact: true }).test(trimmedLine)) {
      contacts.push({
        type: "email",
        value: trimmedLine,
      });
    } else if (isValidPhoneNumber(trimmedLine, "RU")) {
      contacts.push({
        type: "phone",
        value: parsePhoneNumber(trimmedLine, "RU").formatInternational(),
      });
    }
  }

  return deduplicateContacts(contacts);
};
