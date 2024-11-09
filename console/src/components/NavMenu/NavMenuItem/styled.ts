import { styled, css } from 'styled-components'
import { Link as BaseLink } from 'react-router-dom'

type RootProps = {
  $active: boolean
}

export const Title = styled.div`
  font-size: 24px;
  color: #19ACFF;

  @media (max-width: 868px /* var(--container-width) */) {
    display: none;
  }
`

export const Root = styled.div<RootProps>`
  height: calc(var(--header-height) - 7px);
  border-bottom: 7px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ $active }) => $active && css`
    border-bottom-color: #1cacff;
  `}
`

export const Link = styled(BaseLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  text-decoration: none;
  padding: 0 14px;
`
