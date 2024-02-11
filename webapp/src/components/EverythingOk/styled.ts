import { styled } from 'styled-components'
import { Text } from '../Text'

export const Root = styled.div`
  padding: 10px;
`

export const Label = styled(Text)`
  font-weight: 700;
`

export const Block = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
`
