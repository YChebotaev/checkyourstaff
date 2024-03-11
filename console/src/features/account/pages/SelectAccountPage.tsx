import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { BullseyeLayout } from "../../../layouts/BullseyeLayout";
import { setAccountId } from "../../../lib/setAccountId";
import { refresh } from "../../../main";
import { useGetAccounts } from "../hooks/useGetAccounts";

export const SelectAccountPage: FC = () => {
  const navigate = useNavigate();
  const accounts = useGetAccounts()!;
  const [selectedAccountIdStr, setSelectedAccountIdStr] = useState(
    String(accounts[0].id),
  );

  return (
    <BullseyeLayout>
      <div>
        <select onChange={(e) => setSelectedAccountIdStr(e.target.value)}>
          {accounts.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button
          onClick={() => {
            if (selectedAccountIdStr) {
              const accountId = Number(selectedAccountIdStr);

              setAccountId(accountId);

              refresh();

              navigate("/stats");
            }
          }}
        >
          Выбрать аккаунт
        </button>
      </div>
    </BullseyeLayout>
  );
};
