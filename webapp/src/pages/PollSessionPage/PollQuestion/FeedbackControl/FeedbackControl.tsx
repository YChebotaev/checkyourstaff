import { type FC } from "react";
import { Root, Label } from "./styled";
import { Textarea } from "../../../../components/Textarea";

export const FeedbackControl: FC<{
  value: string;
  onChange(value: string): void;
}> = ({ value, onChange }) => {
  return (
    <Root>
      <Label>Расскажите, что пошло не так?</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </Root>
  );
};
