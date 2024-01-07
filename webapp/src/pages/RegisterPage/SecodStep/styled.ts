import { styled } from 'styled-components'
import { Textarea as BaseTextarea } from '../../../components/Textarea'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  height: calc(100vh - 20px - 16px);
`

export const Textarea = styled(BaseTextarea)`
  display: block;
  flex-grow: 1;
`

export const Help = styled.p`
  color: #ffffff;
  margin: 0;
`
