// @ts-nocheck

import emailRegex from "email-regex-safe";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js/mobile";
import { deduplicateContacts } from "./deduplicateContacts";

export type ContactsRecord = {
  type: "email" | "phone";
  value: string;
}[];

export const parseContactsList = (list: string) => {
  const filteredLines = list
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((trimmedLine) => trimmedLine.length);

  const contactGroups: ContactsRecord[] = [];

  for (const trimmedLine of filteredLines) {
    const trimmedParts = trimmedLine
      .split(/[\,]+/)
      .map(part => part.trim())
      .filter(part => part)
    const contacts: ContactsRecord = []

    console.log('trimmedParts =', trimmedParts)

    for (const trimmedPart of trimmedParts) {
      if (emailRegex({ exact: true }).test(trimmedPart)) {
        contacts.push({
          type: 'email',
          value: trimmedPart
        })
      } else
        if (isValidPhoneNumber(trimmedPart, 'RU')) {
          contacts.push({
            type: 'phone',
            value: parsePhoneNumber(trimmedPart, 'RU').formatInternational()
          })
        }
    }

    contactGroups.push(deduplicateContacts(contacts))
  }

  return contactGroups
};
