export const getCorsOrign = () => {
  const envOrigin = process.env["ORIGIN"];

  if (envOrigin) {
    return envOrigin;
  }

  return true;
};
