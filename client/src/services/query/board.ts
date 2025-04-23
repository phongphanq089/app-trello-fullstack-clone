import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import http from '../http'

const fetchBoard = async (boardId: string) => {
  const ressponse = await http.get(`/boards/getBoard/${boardId}`)

  return ressponse.data.result
}

export const useGetBoard = (boardId: string) => {
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId),
    staleTime: 1000 * 60 * 5
  })
}

const fetchCreateBoard = async (payload: { title: string; boardId: string }) => {
  const response = await http.post(`/boards/createColumn`, { ...payload })

  return response.data
}

export const useCreateBoard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; boardId: string }) => fetchCreateBoard(payload)
  })
}

const fetchCreateCard = async (payload: { title: string; boardId: string }) => {
  const response = await http.post(`/boards/createCard`, { ...payload })

  return response.data
}

export const useCreateCard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; boardId: string; columnId: string }) => fetchCreateCard(payload)
  })
}

const fetchUpdateBoard = async (payload: { title: string; description: string; columnOrderIds: string[] }) => {
  const id = '67f78e83fabfe0894a3089e1'
  const response = await http.put(`/boards/updateBoard/${id}`, { ...payload })

  return response.data
}

export const useUpdateBoard = () => {
  return useMutation({
    mutationFn: (payload: { title: string; description: string; columnOrderIds: string[] }) => fetchUpdateBoard(payload)
  })
}
