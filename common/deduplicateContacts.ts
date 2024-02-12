import type { ContactsRecord } from "./parseContactsList";

export const deduplicateContacts = <T extends ContactsRecord>(contacts: T) => {
  const result: T = [] as unknown as T
  const index: Record<string, true> = {}

  for (const contact of contacts) {
    const { value } = contact

    if (index[value]) {
      continue
    } else {
      index[value] = true
      result.push(contact)
    }
  }

  return result
};
