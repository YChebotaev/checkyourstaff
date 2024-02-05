export const getCorsOrign = () => {
  const consoleOrigin = process.env["CONSOLE_ORIGIN"];

  if (consoleOrigin) {
    return consoleOrigin;
  }

  return true;
};
