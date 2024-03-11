import { styled, css } from 'styled-components'
import type { BadgeColor } from './types'

type RootProps = {
  $color: BadgeColor
}

export const Root = styled.div<RootProps>`
  font-size: 12px;
  font-weight: bold;
  padding: 5px 15px;
  border-radius: 8.6px;
  color: #35424A;

  ${({ $color }) => $color === 'green' && css`
    background-color: #BCFFC7;
  `}

  ${({ $color }) => $color === 'red' && css`
    background-color: #ffbcbc;
  `}

  ${({ $color }) => $color === 'gray' && css`
    background-color: #cecece;
  `}
`
