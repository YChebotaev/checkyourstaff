import { type FC } from "react";
import { Root } from "./styled";
import { IndicatorsGridItem, type IndicatorsGridItemProps } from "./IndicatorsGridItem";

export const IndicatorsGrid: FC<{
  items: IndicatorsGridItemProps[];
}> = ({ items }) => (
  <Root>
    {items.map((item) => (
      <IndicatorsGridItem {...item} />
    ))}
  </Root>
);
