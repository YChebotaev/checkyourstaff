import { styled } from 'styled-components'
import { Root as AppContainerRoot } from '../AppContainer/styled'

export const Root = styled.div`
  height: var(--header-height);
  border-bottom-left-radius: 30px;
  border-bottom-right-radius: 30px;
  background-color: rgb(229, 244, 254);

  @media (max-width: 868px /* var(--container-width) */) {
    ${AppContainerRoot} {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`

export const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  height: var(--header-height);

  @media (max-width: 868px /* var(--container-width) */) {
    margin: auto;
  }
`
