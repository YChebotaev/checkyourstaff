import { styled, css } from 'styled-components'

type RootProps = {
  $red: boolean
}

export const Root = styled.p<RootProps>`
  margin: 0;

  ${({ $red }) => $red && css`
    color: red;
  `}
`
