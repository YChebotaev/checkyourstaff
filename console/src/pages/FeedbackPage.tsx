import { useState, type FC, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { isEmpty } from "lodash";
import { format } from "date-fns";
import { AppLayout } from "../layouts/AppLayout/AppLayout";
import { appMenu } from "../constants/appMenu";
import { FeedbackGrid } from "../components/FeedbackGrid";
import { PageHeader } from "../components/PageHeader";
import { EmptyData } from "../components/EmptyData";
import { FeedbackGridItemProps } from "../components/FeedbackGrid/FeedbackGridItem";
import type { FeedbackLoaderResult } from "../types";

const getQuestionTextFromIdent = (q: "1" | "2" | "3") => {
  switch (q) {
    case "1":
      return "Результаты работы";
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

    for (const item of feedbackData.ss) {
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

    items.push(
      ...feedbackData.ff.map((it) => ({
        id: `${it.id}-ff`,
        date: format(Date.parse(it.t), "dd.MM.yyyy"),
        text: it.tx,
      })),
    );

    return items;
  }, [feedbackData, deletedIds]);

  return (
    <AppLayout navMenu={{ items: appMenu, activeKey: "feedback" }}>
      <PageHeader>Фидбек</PageHeader>
      {isEmpty(items) ? (
        <EmptyData />
      ) : (
        <FeedbackGrid
          items={items}
          onDeleteItem={(id) => {
            setDeletedIds([...deletedIds, id]);
          }}
        />
      )}
    </AppLayout>
  );
};
