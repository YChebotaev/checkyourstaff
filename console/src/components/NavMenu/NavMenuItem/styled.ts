import { styled, css } from 'styled-components'
import { Link as BaseLink } from 'react-router-dom'

type RootProps = {
  $active: boolean
}

export const Root = styled.div<RootProps>`
  padding: 0 10px;
  border: 7px solid transparent;
  border-top-width: 0;
  border-bottom-width: 0;

  ${({ $active }) => $active && css`
    border-left-color: #1cacff;
  `}
`

export const Link = styled(BaseLink)`
  display: block;
`
