export const getAccountId = () => {
  const accountIdStr = localStorage.getItem("accountId");

  return accountIdStr && Number(accountIdStr);
};
