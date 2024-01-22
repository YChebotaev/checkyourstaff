import { type FC } from "react";
import { Root } from "./styled";
import { useFetchSampleGroups } from "../../hooks/useFetchSampleGroups";

export const SampleGroupSelector: FC<{
  value?: number;
  onChange?(value: number): void;
}> = ({ value, onChange }) => {
  const { data, isLoading } = useFetchSampleGroups();

  if (isLoading) {
    return null;
  }

  return (
    <Root
      value={value}
      onChange={(e) => {
        onChange && onChange(Number(e.target.value));
      }}
    >
      {data!.map(({ id, name }) => (
        <option key={id} value={id}>
          {name}
        </option>
      ))}
    </Root>
  );
};
