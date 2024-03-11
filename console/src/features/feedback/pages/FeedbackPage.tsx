import { type FC } from "react";
import { FeedbackSection } from '../components/FeedbackSection'
import { FeedbackGrid } from '../components/FeedbackGrid'
import { AppLayout } from "../../../layouts/AppLayout/AppLayout";
import { appMenu } from "../../../constants/appMenu";
import { PageHeader } from "../../../components/PageHeader";
import { useFeedbackPageData } from "../hooks/useFeedbackPageData";

export const FeedbackPage: FC = () => {
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
