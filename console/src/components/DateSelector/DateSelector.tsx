import { type FC } from "react";
import { Root, Button, CurrentDate } from "./styled";
import { ExpandLeft } from "../../icons/ExpandLeft";
import { ExpandRight } from "../../icons/ExpandRight";

export const DateSelector: FC = () => {
  return (
    <Root>
      <Button>
        <ExpandLeft />
      </Button>
      <CurrentDate>12.02-18.02</CurrentDate>
      <Button>
        <ExpandRight />
      </Button>
    </Root>
  );
};
