import { type FC } from "react";
import { IndicatorsSection } from "../components/IndicatorsSection";
import { IndicatorsGrid } from "../components/IndicatorsGrid";
import { useStatsPageData } from "../hooks/useStatsPageData";
import { AppLayout } from "../../../layouts/AppLayout/AppLayout";
import { appMenu } from "../../../constants/appMenu";
import { TitleWithAction } from "../../../components/TitleWithAction";
import { DateSelector } from "../../../components/DateSelector";

export const StatsPage: FC = () => {
  const stats = useStatsPageData()!;

  return (
    <AppLayout navMenu={{ items: appMenu, activeKey: "stats" }}>
      <TitleWithAction action={<DateSelector />}>Показатели</TitleWithAction>
      <IndicatorsSection title="Все отделы">
        <IndicatorsGrid
          items={stats.general.map((item) => ({
            key: item.title,
            name: item.title,
            value: item.value,
            deltaPercent: item.differencePercentage,
          }))}
        />
      </IndicatorsSection>
      {stats.groups.map((item) => (
        <IndicatorsSection key={item.title} title={item.title}>
          <IndicatorsGrid
            items={item.values.map((item) => ({
              key: item.title,
              sampleGroupId: item.sampleGroupId,
              name: item.title,
              value: item.value,
              deltaPercent: item.differencePercentage,
            }))}
          />
        </IndicatorsSection>
      ))}
    </AppLayout>
  );
};
