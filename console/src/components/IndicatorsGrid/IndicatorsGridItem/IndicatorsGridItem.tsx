import { type FC } from "react";
import {
  Root,
  ValueRow,
  ValueContainer,
  DeltaPercentage,
  NameRow,
  ViewChart,
  Separator,
} from "./styled";
import type { IndicatorsGridItemProps } from "./types";
import { BadgeColor } from "../../Badge";

const renderPercent = (value: number) => {
  if (value > 0) {
    return `+${value}%`;
  } else if (value === 0) {
    return `${value}%`;
  } else {
    return `${value}%`;
  }
};

const getPercentColor = (value: number): BadgeColor => {
  if (value > 0) {
    return "green";
  } else if (value === 0) {
    return "gray";
  } else {
    return "red";
  }
};

export const IndicatorsGridItem: FC<IndicatorsGridItemProps> = ({
  name,
  value,
  deltaPercent,
  sampleGroupId,
}) => (
  <Root to={sampleGroupId ? `/charts/${sampleGroupId}` : undefined}>
    <Separator />
    <ValueRow $withDelta={deltaPercent != null}>
      <ValueContainer>{value}</ValueContainer>
      {deltaPercent != null && (
        <DeltaPercentage color={getPercentColor(deltaPercent)}>
          {renderPercent(deltaPercent)}
        </DeltaPercentage>
      )}
    </ValueRow>
    <NameRow>{name}</NameRow>
    <Separator />
    <ViewChart>Смотреть график</ViewChart>
  </Root>
);
