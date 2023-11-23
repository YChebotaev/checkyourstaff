import { css, styled } from 'styled-components'
import { Link as BaseLink } from 'react-router-dom'

type ValueRowProps = {
  $withDelta: boolean
}

type DeltaPercentageProps = {
  $positive: boolean
  $neutral: boolean
  $negative: boolean
}

export const ViewChart = styled.div`
  color: #35424A;
  font-weight: 400;
  font-size: 10pt;
  margin-top: 30px;
  transition: opacity 0.2s ease-in-out;
`

export const Root = styled(BaseLink)`
  font-family: sans-serif;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 40px 0 15px;
  border-radius: 30px;
  box-shadow: 0 0 10px #05296F2f;
  cursor: pointer;

  ${ViewChart} {
    opacity: 0;
  }

  &:hover ${ViewChart} {
    opacity: 1;
  }
`

export const ValueRow = styled.div<ValueRowProps>`
  ${({ $withDelta }) => $withDelta && css`
    padding-left: 40px;
  `}
`

export const ValueContainer = styled.div`
  position: relative;
  display: inline-block;
  color: #35424A;
  font-size: 64pt;
  font-weight: bold;
  z-index: 2;
`

export const DeltaPercentage = styled.div<DeltaPercentageProps>`
  position: relative;
  top: -55px;
  left: -15px;
  z-index: 1;
  display: inline-block;
  font-size: 12pt;
  font-weight: bold;
  padding: 5px 15px;
  border-radius: 8.6px;
  color: #35424A;

  ${({ $positive }) => $positive && css`
    background-color: #BCFFC7;
  `}

  ${({ $negative }) => $negative && css`
    background-color: #ffbcbc;
  `}

  ${({ $neutral }) => $neutral && css`
    background-color: #cecece;
  `}
`

export const NameRow = styled.div`
  color: #35424A;
  font-weight: 400;
  font-size: 13.33pt;
`
