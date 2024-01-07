import { useState, type FC, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useApiClient } from "../../hooks/useApiClient";
import { AppLayout } from "../../layouts/AppLayout";
import { FirstStep } from "./FirstStep";
import { SecondStep } from "./SecodStep";
import { ThirdStep } from "./ThirdStep";
import { Text } from "../../components/Text";
import { parseContactsList, type ContactRecord } from "@checkyourstaff/common";
import { BullseyeLayout } from "../../layouts/BullseyeLayout";

const REQUIRED_MINIMUM_CONTACTS_COUNT = 2 // 10;

const isListValid = (list: string) => {
  const contacts = parseContactsList(list);

  return contacts.length >= REQUIRED_MINIMUM_CONTACTS_COUNT;
};

export const RegisterPage: FC = () => {
  const apiClient = useApiClient();
  const [searchParams] = useSearchParams();
  const [registrationComplete, setRegistrationComplete] = useState<
    boolean | null
  >(null);
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [list, setList] = useState("");
  const chatId = searchParams.get("chatId");
  const userId = searchParams.get("userId");
  const registrationCompleteCloudStorageKey = `registration_complete_${chatId}_${userId}`;

  // DEBUG ONLY:
  // Telegram.WebApp.CloudStorage.removeItem(registrationCompleteCloudStorageKey)

  const { mutate } = useMutation({
    async mutationFn(vars: { name: string; groupName: string; list: string }) {
      const { data } = await apiClient.post("/completeRegistration", {
        ...vars,
        chatId,
        userId,
      });

      return data;
    },
    onSuccess() {
      Telegram.WebApp.close();

      Telegram.WebApp.MainButton.hideProgress();

      Telegram.WebApp.CloudStorage.setItem(
        registrationCompleteCloudStorageKey,
        "true",
      );
    },
  });

  useEffect(() => {
    Telegram.WebApp.CloudStorage.getItem(
      registrationCompleteCloudStorageKey,
      (error, value) => {
        if (error) {
          console.error(error);
        } else {
          setRegistrationComplete(value === "true");
        }
      },
    );
  }, [registrationCompleteCloudStorageKey]);

  if (registrationComplete === null) {
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
