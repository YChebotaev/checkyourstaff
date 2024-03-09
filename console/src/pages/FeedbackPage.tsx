import { type FC } from "react";
// import { useLoaderData } from "react-router-dom";
import { AppLayout } from "../layouts/AppLayout/AppLayout";
import { appMenu } from "../constants/appMenu";
import { FeedbackGrid } from "../components/FeedbackGrid";
import { PageHeader } from "../components/PageHeader";
// import type { FeedbackLoaderResult } from "../types";
import { FeedbackSection } from "../components/FeedbackSection";
import { useFeedbackPageData } from "../hooks/useFeedbackPageData";

export const FeedbackPage: FC = () => {
  // const { feedbackData } = useLoaderData() as FeedbackLoaderResult;
  const feedbackData = useFeedbackPageData()!

  return (
    <AppLayout navMenu={{ items: appMenu, activeKey: "feedback" }}>
      <PageHeader>Фидбек</PageHeader>
      {feedbackData.map(({ title, values }) => (
        <FeedbackSection key={title} title={title}>
          <FeedbackGrid items={values} /* onDeleteItem={() => {}} */ />
        </FeedbackSection>
      ))}
    </AppLayout>
  );
};
