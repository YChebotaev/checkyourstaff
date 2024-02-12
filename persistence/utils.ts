export const maybeParseJson = (input: object | string) => {
  if (typeof input === "object") {
    return input;
  } else {
    return JSON.parse(input);
  }
};
