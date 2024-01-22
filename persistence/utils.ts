import { parse } from "date-fns";

export const parseDate = (dateStr: string) => {
  console.log('dateStr =', dateStr)

  return parse(dateStr, "yyyy-MM-dd HH:mm:ss", new Date());
};
