import type { ContactRecord } from "./parseContactsList";

export const deduplicateContacts = <T extends ContactRecord>(contacts: T[]) => {
  const result: T[] = [];
  const valueIndex: Record<string, true> = {};

  for (const contact of contacts) {
    const { value } = contact;

    if (valueIndex[value] != null) {
      continue;
    } else {
      valueIndex[value] = true;
      result.push(contact);
    }
  }

  return result;
};
