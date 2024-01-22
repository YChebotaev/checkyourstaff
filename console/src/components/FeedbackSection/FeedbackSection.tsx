import { type FC, type ReactNode } from "react";
import { Root, Title } from "./styled";

export const FeedbackSection: FC<{ title: string; children: ReactNode }> = ({
  title,
  children,
}) => (
  <Root>
    <Title>{title}</Title>
    {children}
  </Root>
);
