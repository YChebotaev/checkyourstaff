import { styled } from 'styled-components'

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 30vw;
`

export const Body = styled.div`
  padding: 30px 30px 0;
  font-family: sans-serif;
  font-size: 10pt;
  color: #35424A;
`

export const Actions = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 30px 20px;
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

export const Input = styled.input`
  display: block;
  width: 100%;
  font-family: sans-serif;
  border-radius: 4px;
  border: 1px solid #35424A;
  font-size: 10pt;
  padding: 3px;
`
