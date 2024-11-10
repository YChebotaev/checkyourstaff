import { css, styled } from 'styled-components'

type TabProps = {
  $active: boolean
}

export const Root = styled.div`
  display: flex;
`

export const Tab = styled.button<TabProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  font-size: 20px;
  font-weight: bold;
  padding: 12px 20px;
  color: #CACACA;
  cursor: pointer;

  ${({ $active }) => $active && css`
    background-color: #E2F5FF;
    color: #35424A;
    border-radius: 38px;
  `}
`
