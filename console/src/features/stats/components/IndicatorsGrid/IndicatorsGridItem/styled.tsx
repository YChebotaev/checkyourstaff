import { type FC } from "react";
import { css, styled } from "styled-components";
import { Link as BaseLink } from "react-router-dom";
import { Badge } from '../../Badge';

type ValueRowProps = {
  $withDelta: boolean;
};

export const ViewChart = styled.div`
  color: #35424a;
  font-weight: 600;
  font-size: 10px;
  padding: 10px 0;
  transition: opacity 0.2s ease-in-out;
`;

const rootBaseStyles = css`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 30px;
  box-shadow: 0 0 10px #05296f2f;
  border: 1px solid transparent;

  ${ViewChart} {
    opacity: 0;
  }
`;

const RootLink = styled(BaseLink)`
  ${rootBaseStyles}

  cursor: pointer;

  &:hover {
    border: 1px solid #1AACFF;
  }

  &:hover ${ViewChart} {
    opacity: 1;
  }
`;

const RootBox = styled.div`
  ${rootBaseStyles}
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Root: FC<any> = (props) =>
  props.to ? <RootLink {...props} /> : <RootBox {...props} />;

export const ValueRow = styled.div<ValueRowProps>`
  ${({ $withDelta }) =>
    $withDelta &&
    css`
      padding-left: 50px;
    `}
`;

export const ValueContainer = styled.div`
  position: relative;
  display: inline-block;
  color: #35424a;
  font-size: 64px;
  font-weight: 700;
  z-index: 2;
`;

export const DeltaPercentage = styled(Badge)`
  display: inline-block;
  position: relative;
  top: -35px;
  left: -10px;
  z-index: 1;
`;

export const NameRow = styled.div`
  color: #35424a;
  font-weight: 600;
  font-size: 13.3px;
  text-align: center;
  margin: 0 5px;
`;

export const Separator = styled.div`
  flex-grow: 1;
`;
