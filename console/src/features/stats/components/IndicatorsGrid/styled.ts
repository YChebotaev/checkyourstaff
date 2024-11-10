import styled from "styled-components";

export const Root = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 868px /* var(--container-width) */) {
    grid-template-columns: repeat(2, 1fr);
  }
`
