export const maybeParseJson = <T extends object>(input: T | string) => {
  if (typeof input === "object") {
    return input;
  } else {
    return JSON.parse(input) as T;
  }
};
