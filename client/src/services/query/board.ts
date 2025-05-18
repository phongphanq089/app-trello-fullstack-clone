import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import {
  fetchBoard,
  fetchCreateBoard,
  fetchCreateCard,
  fetchMoveCardDifferentColumn,
  fetchRemoveColumn,
  fetchUpdateBoard,
  fetchUpdateColumn
} from '../fetch/board'

export const useGetBoard = (boardId: string) => {
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId),
    staleTime: 1000 * 60 * 5
  })
}

export const useCreateBoard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; boardId: string }) => fetchCreateBoard(payload)
  })
}

export const useCreateCard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; boardId: string; columnId: string }) => fetchCreateCard(payload)
  })
}

export const useUpdateBoard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; description: string; columnOrderIds: string[] }) => fetchUpdateBoard(payload)
  })
}

export const useUpdateColumn = () => {
  return useMutation({
    mutationFn: (payload: { id: string; cardOrderIds: string[] }) => fetchUpdateColumn(payload)
  })
}

export const useRemoveColumn = () => {
  return useMutation({
    mutationFn: (id: string) => fetchRemoveColumn(id)
  })
}

export const useMoveCardDifferentColumn = () => {
  return useMutation({
    mutationFn: (payload: {
      currentCardId: string
      prevColumnId: string
      prevCardOrderIds: string[]
      nextColumnId: string
      nextCardOrderIds: string[]
    }) => fetchMoveCardDifferentColumn(payload)
  })
}
