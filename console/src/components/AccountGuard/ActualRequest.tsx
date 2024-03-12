import { useMemo, type FC, type ReactNode } from "react";
import { useGetAccounts } from "../../features/account/hooks/useGetAccounts";
import { getAccountId } from "../../lib/getAccountId";
import { setAccountId } from "../../lib/setAccountId";
import { clearAccountId } from "../../lib/clearAccountId";

export const ActualRequest: FC<{ children(): ReactNode }> = ({ children }) => {
  const accounts = useGetAccounts();

  const cont /*inue*/ = useMemo(() => {
    if (accounts) {
      const selectedAccountId = getAccountId();
      const account =
        selectedAccountId != null
          ? accounts.find(({ id }) => id === selectedAccountId)
          : undefined;

      if (account != null) {
        return true;
      } else {
        // Означает что пользователь потерял доступ к аккаунту
      }

      clearAccountId();

      if (accounts.length === 0) {
        // TODO: To implement
      } else if (accounts.length === 1) {
        setAccountId(accounts[0].id);

        location.href = "/stats";
      } else if (accounts.length > 1) {
        location.href = "/selectAccount";
      }
    }

    return false;
  }, [accounts]);

  return cont ? children() : null;
};
