export const getAccountId = () => {
  const accountIdStr = localStorage.getItem("accountId");

  if (accountIdStr != null) {
    return Number(accountIdStr)
  }
};
