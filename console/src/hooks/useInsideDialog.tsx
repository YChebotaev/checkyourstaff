import { useContext } from 'react'
import { context } from './useDialog'

export const useInsideDialog = () =>
  useContext(context)!
