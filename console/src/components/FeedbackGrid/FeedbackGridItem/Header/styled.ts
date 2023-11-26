import { styled } from 'styled-components'

export const Root = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px 30px 0;
`

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`

export const Right = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`

export const Date = styled.div`
  font-size: 10px;
  font-weight: 400;
  color: #C2CBCF;
`

export const IsNew = styled.div`
  font-size: 10px;
  font-weight: 400;
  color: #35424A;
`
