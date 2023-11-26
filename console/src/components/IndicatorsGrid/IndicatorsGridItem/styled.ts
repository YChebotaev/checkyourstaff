import { css, styled } from 'styled-components'
import { Link as BaseLink } from 'react-router-dom'
import { Badge } from '../../Badge'

type ValueRowProps = {
  $withDelta: boolean
}

export const ViewChart = styled.div`
  color: #35424A;
  font-weight: 600;
  font-size: 10px;
  padding: 40px 0;
  transition: opacity 0.2s ease-in-out;
`

export const Root = styled(BaseLink)`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 30px;
  box-shadow: 0 0 10px #05296F2f;
  aspect-ratio: 1;
  cursor: pointer;

  ${ViewChart} {
    opacity: 0;
  }

  &:hover ${ViewChart} {
    opacity: 1;
  }
`

export const ValueRow = styled.div<ValueRowProps>`
  margin-top: 20px;

  ${({ $withDelta }) => $withDelta && css`
    padding-left: 50px;
  `}
`

export const ValueContainer = styled.div`
  position: relative;
  display: inline-block;
  color: #35424A;
  font-size: 64px;
  font-weight: 700;
  z-index: 2;
`

export const DeltaPercentage = styled(Badge)`
  display: inline-block;
  position: relative;
  top: -35px;
  left: -10px;
  z-index: 1;
`

export const NameRow = styled.div`
  color: #35424A;
  font-weight: 600;
  font-size: 13.3px;
`

export const Separator = styled.div`
  flex-grow: 1;
`
