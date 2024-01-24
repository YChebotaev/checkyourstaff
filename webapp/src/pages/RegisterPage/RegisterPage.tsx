import { useState, type FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  parseContactsList,
  type ContactRecord,
} from "@checkyourstaff/common/parseContactsList";
import { useApiClient } from "../../hooks/useApiClient";
import { AppLayout } from "../../layouts/AppLayout";
import { FirstStep } from "./FirstStep";
import { SecondStep } from "./SecodStep";
import { ThirdStep } from "./ThirdStep";
import { Text } from "../../components/Text";
import { BullseyeLayout } from "../../layouts/BullseyeLayout";
import { useCloudStorageItem } from "../../hooks/useCloudStorageItem";

const REQUIRED_MINIMUM_CONTACTS_COUNT = /** @todo: debug only */ 2; // 10;

const isListValid = (list: string) => {
  const contacts = parseContactsList(list);

  return contacts.length >= REQUIRED_MINIMUM_CONTACTS_COUNT;
};

export const RegisterPage: FC = () => {
  const apiClient = useApiClient();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [list, setList] = useState("");
  const chatId = searchParams.get("chatId");
  const userId = searchParams.get("userId");

  // DEBUG ONLY:
  Telegram.WebApp.CloudStorage.removeItem(`registration_complete_${chatId}_${userId}`)

  const [registrationComplete, setRegistrationComplete] = useCloudStorageItem(
    `registration_complete_${chatId}_${userId}`,
    {
      parse(value) {
        return value === "true";
      },
      stringify(value) {
        return value ? "true" : "fasle";
      },
    },
  );

  const { mutate } = useMutation({
    async mutationFn(vars: { name: string; groupName: string; list: string }) {
      const { data } = await apiClient.post("/completeRegistration", {
        ...vars,
        chatId,
        userId,
      });

      return data;
    },
    async onSuccess() {
      Telegram.WebApp.MainButton.hideProgress();

      await setRegistrationComplete(true);

      Telegram.WebApp.close();
    },
  });

  if (registrationComplete == null) {
    return null;
  }

  if (registrationComplete) {
    return (
      <BullseyeLayout>
        <Text>Регистрация завершена</Text>
      </BullseyeLayout>
    );
  }

  return (
    <AppLayout>
      {step === 1 && (
        <FirstStep
          onChangeName={setName}
          completeDisabled={name == ""}
          onComplete={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <SecondStep
          onChangeGroupName={setGroupName}
          onChangeList={setList}
          completeDisabled={groupName == "" || !isListValid(list)}
          minimumContactsCount={REQUIRED_MINIMUM_CONTACTS_COUNT}
          onComplete={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <ThirdStep
          name={name}
          groupName={groupName}
          contacts={parseContactsList(list)}
          onComplete={() => {
            Telegram.WebApp.MainButton.showProgress(false);

            mutate({ name, groupName, list });
          }}
        />
      )}
    </AppLayout>
  );
};

export { ContactRecord };
