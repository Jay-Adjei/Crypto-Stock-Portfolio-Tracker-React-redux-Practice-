import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import type { AppDispatch, RootState } from './store'

/** Typed hooks — prefer these over plain `useDispatch` / `useSelector`. */
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
