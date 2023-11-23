import { styled } from 'styled-components'

export const Root = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'menu content';
  width: 100vw;
  min-height: 100vh;
`

export const MenuColumn = styled.div`
  grid-area: menu;
`

export const NavMenuWrapper = styled.div`
  padding: 50px 30px 0 30px;
`

export const ContentColumn = styled.div`
  grid-area: content;
`

export const ContentWrapper = styled.div`
  padding: 50px 30px 0 30px;
`
