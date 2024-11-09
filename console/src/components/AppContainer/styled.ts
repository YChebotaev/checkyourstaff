import { styled } from 'styled-components'

export const Root = styled.div`
  margin: auto;
  max-width: var(--container-width);

  @media (max-width: 868px /* var(--container-width) */) {
    width: 100%;
    max-width: initial;
  }
`
