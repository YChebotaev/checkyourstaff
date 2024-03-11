import { useMemo, type FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { AppLayout } from "../../../layouts/AppLayout/AppLayout";
import { appMenu } from "../../../constants/appMenu";
import { LineChart } from '../components/LineChart'
import { SampleGroupSelector } from '../components/SampleGroupSelector'
import { PageHeader } from "../../../components/PageHeader";
import { ChartSection } from '../components/ChartSection'
import { useFetchSampleGroups } from "../hooks/useFetchSampleGroups";
import { useChartsPageData } from "../hooks/useChartsPageData";

export const ChartsPage: FC = () => {
  const navigate = useNavigate();
  const { sampleGroupId: sampleGroupIdStr } = useParams() as {
    sampleGroupId: string;
  };
  const sampleGroupId = Number(sampleGroupIdStr);
  const chartsData = useChartsPageData(sampleGroupId)!;
  const { data: sampleGroups, isLoading } = useFetchSampleGroups();

  const charts = useMemo(() => {
    type Value = {
      date: string;
      value?: number;
    };
    type Chart = {
      title: string;
      values: Value[];
    };

    const charts: Chart[] = [];

    for (const session of chartsData) {
      for (const question of session.values) {
        const chart: Chart | undefined = charts.find(
          ({ title }) => title === question.title,
        );

        if (!chart) {
          charts.push({
            title: question.title,
            values: chartsData.map(({ date, values }) => ({
              date,
              value: values.find(({ title }) => title === question.title)
                ?.value,
            })),
          });
        }
      }
    }

    return charts;
  }, [chartsData]);

  if (isLoading) {
    return null;
  }

  return (
    <AppLayout navMenu={{ items: appMenu, activeKey: "charts" }}>
      <PageHeader>Графики</PageHeader>
      {sampleGroups!.length > 1 && (
        <div>
          <SampleGroupSelector
            value={sampleGroupId}
            onChange={(sampleGroupId) => {
              navigate(`/charts/${sampleGroupId}`);
            }}
          />
        </div>
      )}
      {charts.map(({ title, values }) => (
        <ChartSection key={title} title={title}>
          <LineChart
            name={title}
            data={values.map(({ date, value }) => ({
              date: format(date, "dd.MM.yyyy"),
              value: value!,
            }))}
          />
        </ChartSection>
      ))}
    </AppLayout>
  );
};
