import { type FC } from "react";
import { Root, Button, CurrentDate } from "./styled";
import { ExpandLeft } from "../../icons/ExpandLeft";
import { ExpandRight } from "../../icons/ExpandRight";
// import { useSuspenseQuery } from "@tanstack/react-query";
// import { useApiClient } from "../../hooks/useApiClient";
// import { getAccountId } from "../../lib/getAccountId";
// import { useSearchParams } from "react-router-dom";

export const DateSelector: FC = () => {
  // const apiClient = useApiClient();
  // const searchParams = useSearchParams()

  // const { data } = useSuspenseQuery({
  //   queryKey: ["pollSessions"],
  //   queryFn: () => apiClient.getPollSessions({ accountId: getAccountId()! }),
  // });

  // const indexByCreatedAt = data
  //   .map(({ id, createdAt }) => [createdAt, id])
  //   .sort(([aca], [bca]) => aca - bca)
  //   .map(([_, id]) => id);

  return null;

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
