import { styled } from 'styled-components'

export const Footer = styled.div`
  text-align: center;
  padding: 20px 0;
  font-family: sans-serif;
  font-size: 10pt;
  color: #35424A;
  transition: opacity 0.2s ease-in-out;
`

export const Root = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  position: relative;
  border-radius: 30px;
  box-shadow: 0 0 10px #05296F2f;
  cursor: pointer;

  ${Footer} {
    opacity: 0;
  }

  &:hover ${Footer} {
    opacity: 1;
  }
`

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 10px;
`

export const Question = styled.div`
  position: absolute;
  top: -15px;
  right: 15px;
  padding: 5px 10px;
  border-radius: 38px;
  background-color: #1AACFF;
  color: #ffffff;
  font-size: 10pt;
  font-weight: 400;
  font-family: sans-serif;
`


export const Body = styled.div`
  font-family: sans-serif;
  font-size: 14pt;
  color: #35424A;
  flex-grow: 1;
  padding: 0 20px;
  text-align: left;
`
