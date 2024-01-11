import { useState, type FC } from "react";
import { Root, Label } from "./styled";
import { Textarea } from "../../../components/Textarea";
import { MainButton } from "../../../components/MainButton";

export const LastQuestion: FC<{ onComplete(text: string): void }> = ({
  onComplete,
}) => {
  const [text, setText] = useState("");

  return (
    <Root>
      <Label>Есть ли у вас чем еще поделиться?</Label>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} />
      <MainButton
        text="Завершить опрос"
        onClick={() => {
          onComplete(text);
        }}
      />
    </Root>
  );
};
