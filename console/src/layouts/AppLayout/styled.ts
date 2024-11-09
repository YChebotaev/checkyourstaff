import { styled } from 'styled-components'

export const Root = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas:
    'menu'
    'content';
  grid-template-rows: var(--header-height) 1fr;
  min-height: 100vh;
`

export const MenuRow = styled.div`
  grid-area: menu;
`

export const ContentRow = styled.div`
  grid-area: content;
  padding: 50px 30px 0 30px;
`
