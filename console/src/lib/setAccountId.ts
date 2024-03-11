export const setAccountId = (accountId: number) => {
  localStorage.setItem("accountId", String(accountId));
};
