import { styled } from 'styled-components'

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 30vw;
`

export const Actions = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 30px 20px;
  gap: 20px;
`

export const Button = styled.button`
  display: block;
  border: none;
  background: transparent;
  padding: 0;
  font-family: sans-serif;
  font-size: 14pt;
  font-weight: 400;
  color: #35424A;
  cursor: pointer;
`
