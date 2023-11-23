import { styled } from 'styled-components'
import { Button as BaseButton } from '../styled'

export const Root = styled(BaseButton)`
  &[disabled] {
    color: gray;
    cursor: not-allowed;
  }
`
