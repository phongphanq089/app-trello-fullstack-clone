import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import {
  fetchAddNewBoard,
  fetchBoard,
  fetchCreateCard,
  fetchCreateColumn,
  fetchGetBoard,
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

export const useGetListBoard = (page: number, itemsPerPage: number) => {
  return useQuery({
    queryKey: ['board', page, itemsPerPage],
    queryFn: () => fetchGetBoard(String(page), String(itemsPerPage)),
    staleTime: 1000 * 60 * 5
  })
}

export const useAddNewBoard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; description: string }) => fetchAddNewBoard(payload)
  })
}

export const useCreateBoard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; boardId: string }) => fetchCreateColumn(payload)
  })
}

export const useCreateCard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; boardId: string; columnId: string }) => fetchCreateCard(payload)
  })
}

export const useUpdateBoard = (boardId: string) => {
  return useMutation({
    mutationFn: (payload: { title: string; description: string; columnOrderIds: string[] }) =>
      fetchUpdateBoard(boardId, payload)
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
