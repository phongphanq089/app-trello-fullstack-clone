import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import http from '../http'

const fetchBoard = async (boardId: string) => {
  const ressponse = await http.get(`/board/${boardId}`)

  return ressponse.data
}

export const useGetBoard = (boardId: string) => {
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId),
    staleTime: 1000 * 60 * 5
  })
}

const fetchCreateBoard = async (payload: { title: string; boardId: string }) => {
  const response = await http.post(`/column`, { ...payload })

  return response.data
}

export const useCreateBoard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; boardId: string }) => fetchCreateBoard(payload)
  })
}

const fetchCreateCard = async (payload: { title: string; boardId: string }) => {
  const response = await http.post(`/card`, { ...payload })

  return response.data
}

export const useCreateCard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; boardId: string; columnId: string }) => fetchCreateCard(payload)
  })
}
