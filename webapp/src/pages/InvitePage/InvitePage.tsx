import { useState, type FC } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AppLayout } from "../../layouts/AppLayout";
import { MainButton } from "../../components/MainButton";
import { Text } from "../../components/Text";
import { useGetSampleGroup } from "../../hooks/useGetSampleGroup";
import { InviteMemebers } from "../../components/InviteMemebers";
import { useApiClient } from "../../hooks/useApiClient";
import { Root } from "./styled";

export const InvitePage: FC = () => {
  const apiClient = useApiClient();
  const [searchParams] = useSearchParams();
  const sampleGroupId = Number(searchParams.get("sampleGroupId"));
  const [rawList, setRawList] = useState("");
  const { data: sampleGroup, isLoading } = useGetSampleGroup(sampleGroupId);

  const { mutate } = useMutation({
    async mutationFn() {
      const { data } = await apiClient.post("/inviteMembers", {
        sampleGroupId,
        list: rawList,
        tgChatId: Number(searchParams.get("tgChatId")),
      });

      return data;
    },
    onMutate() {
      Telegram.WebApp.MainButton.showProgress(false);
    },
    onSuccess() {
      Telegram.WebApp.MainButton.hideProgress();

      Telegram.WebApp.close();
    },
  });

  if (isLoading) {
    return null;
  }

  return (
    <AppLayout>
      <Root>
        <Text>Добавить респондентов в группу «{sampleGroup!.name}»</Text>
        <InviteMemebers textareaProps={{ rows: 7 }} onChangeList={setRawList} />
        <MainButton text="Пригласить" onClick={() => mutate()} />
      </Root>
    </AppLayout>
  );
};
