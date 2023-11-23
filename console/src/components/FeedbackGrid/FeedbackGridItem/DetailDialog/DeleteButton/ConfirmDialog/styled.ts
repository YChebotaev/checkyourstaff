import { styled } from 'styled-components'

export const Inner = styled.div`
  gap: 20px;
  max-width: 30vw;
`

export const Body = styled.div`
  font-family: sans-serif;
  font-size: 14pt;
  color: #35424A;
  flex-grow: 1;
  padding: 30px 30px 0 30px;
  text-align: left;
  font-weight: bold;
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
