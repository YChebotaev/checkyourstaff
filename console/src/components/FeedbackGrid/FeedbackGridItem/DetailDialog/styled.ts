import { styled } from 'styled-components'

export const Inner = styled.div`
  position: relative;
  min-width: 500px;
  min-height: 250px;
`

export const Text = styled.div`
  padding: 0 30px 0;
  font-weight: 400;
  font-size: 14px;
  color: #35424A;
`

export const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background-color: #ffffffcc;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  font-weight: 400;
  font-size: 14px;
  color: #35424A;
  text-align: center;
`

export const Confirmation = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px
`

export const ConfirmationText = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: #35424A;
`
