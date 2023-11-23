import { useState, type FC, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { isEmpty, uniq } from "lodash";
import { format } from "date-fns";
import { AppLayout } from "../layouts/AppLayout/AppLayout";
import { appMenu } from "../constants/appMenu";
import { FeedbackGrid } from "../components/FeedbackGrid";
import type { FeedbackLoaderResult } from "../types";
import { PageHeader } from "../components/PageHeader";
import { EmptyData } from "../components/EmptyData";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../hooks/useApiClient";
import type { TextFeedbackResp } from "@checkyourstaff/service/types";
import { FeedbackGridItemProps } from "../components/FeedbackGrid/FeedbackGridItem";

const getQuestionTextFromIdent = (q: "1" | "2" | "3") => {
  switch (q) {
    case "1":
      return "Результаты";
    case "2":
      return "Нагрузка";
    case "3":
      return "Счастье";
  }
};

export const FeedbackPage: FC = () => {
  const { feedbackData } = useLoaderData() as FeedbackLoaderResult;
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const items = useMemo(() => {
    const items: FeedbackGridItemProps[] = [];

    for (const item of feedbackData) {
      for (const a of item.a) {
        const id = `${item.id}-${a.q ? "a" : "f"}-${a.id}`;

        if (deletedIds.includes(id)) {
          continue;
        }

        items.push({
          id,
          date: format(Date.parse(item.t), "dd.MM.yyyy"),
          text: a.f,
          question: getQuestionTextFromIdent(a.q as any),
          score: a.s,
        });
      }
    }

    return items;
  }, [feedbackData, deletedIds]);
  // const items = feedbackData
  //   .flatMap((item) =>
  //     item.a.map((a) => {
  //       const id = `${item.id}-${a.q ? "a" : "f"}-${a.id}`;

  //       if (deletedIds.includes(id)) {
  //         return null;
  //       }

  //       return {
  //         id: `${item.id}-${a.q ? "a" : "f"}-${a.id}`,
  //         date: format(Date.parse(item.t), "dd.MM.yyyy"),
  //         text: a.f,
  //         question: getQuestionTextFromIdent(a.q as any),
  //         score: a.s,
  //       };
  //     }),
  //   )

  if (isEmpty(items)) {
    return (
      <AppLayout navMenu={{ items: appMenu, activeKey: "feedback" }}>
        <PageHeader>Фидбек</PageHeader>
        <EmptyData />
      </AppLayout>
    );
  }

  return (
    <AppLayout navMenu={{ items: appMenu, activeKey: "feedback" }}>
      <PageHeader>Фидбек</PageHeader>
      <FeedbackGrid
        items={items}
        onDeleteItem={(id) => {
          setDeletedIds([...deletedIds, id]);
        }}
      />
    </AppLayout>
  );
};
