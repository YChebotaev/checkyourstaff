import { type FC } from "react";
import {
  Root,
  ValueRow,
  ValueContainer,
  DeltaPercentage,
  NameRow,
  ViewChart,
} from "./styled";
import type { IndicatorsGridItemProps } from "./types";

const renderPercent = (value: number) => {
  if (value > 0) {
    return `+${value}%`;
  } else if (value === 0) {
    return `${value}%`;
  } else {
    return `${value}%`;
  }
};

export const IndicatorsGridItem: FC<IndicatorsGridItemProps> = ({
  name,
  value,
  deltaPercent,
}) => (
  <Root to="/charts">
    <ValueRow $withDelta={deltaPercent != null}>
      <ValueContainer>{value}</ValueContainer>
      {deltaPercent != null && (
        <DeltaPercentage
          $positive={deltaPercent > 0}
          $neutral={deltaPercent === 0}
          $negative={deltaPercent < 0}
        >
          {renderPercent(deltaPercent)}
        </DeltaPercentage>
      )}
    </ValueRow>
    <NameRow>{name}</NameRow>
    <ViewChart>Смотреть график</ViewChart>
  </Root>
);
