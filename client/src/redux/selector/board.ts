import { RootState } from '../store'

export const selectCurrentActiveBoard = (state: RootState) => {
  return state.activeBoard.currentActiveBoard
}
