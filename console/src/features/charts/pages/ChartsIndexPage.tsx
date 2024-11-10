import { Suspense, useState, type FC } from "react";

import { AppLayout } from "../../../layouts/AppLayout";
import { appMenu } from "../../../constants/appMenu";
import { TitleWithAction } from "../../../components/TitleWithAction";
import { DateSelector } from "../../../components/DateSelector";
import { PillTabs } from "../../../components/PillTabs";
import { ChartTabSkeleton } from "../components/ChartTabSkeleton";
import { ChartTab } from "../components/ChartTab";
import { useFetchQuestionNames } from "../hooks/useFetchQuestionNames";
import { useSearchParams } from "react-router-dom";

export const ChartsIndexPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: questions } = useFetchQuestionNames();
  const [activeTab, setActiveTab] = useState(
    searchParams.has("q") ? Number(searchParams.get("q")) : questions[0].id,
  );
  const currentQuestion = questions.find(({ id }) => activeTab === id)!;

  const selectTabHandler = (key: number) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("q", String(key));

    setSearchParams(nextSearchParams);
  };

  return (
    <AppLayout navMenu={{ items: appMenu, activeKey: "charts" }}>
      <TitleWithAction action={<DateSelector />}>Динамика</TitleWithAction>
      <PillTabs
        activeTab={activeTab}
        items={questions.map(({ id: key, name: title }) => ({
          key,
          title,
          onSelect: selectTabHandler,
        }))}
        onChange={setActiveTab}
      />
      <Suspense fallback={<ChartTabSkeleton />}>
        <ChartTab question={currentQuestion} />
      </Suspense>
    </AppLayout>
  );
};
