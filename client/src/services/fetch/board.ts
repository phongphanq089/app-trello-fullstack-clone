import http from '../http'

export const fetchBoard = async (boardId: string) => {
  const ressponse = await http.get(`/boards/getBoard/${boardId}`)

  return ressponse.data.result
}

export const fetchMoveCardDifferentColumn = async (payload: any) => {
  const response = await http.put(`/boards/moveCardDifferentColumn`, { ...payload })

  return response.data
}

export const fetchRemoveColumn = async (id: string) => {
  const response = await http.put(`/boards/removeColumn/${id}`, { columnId: id })

  return response.data
}

export const fetchUpdateColumn = async (payload: { id: string; cardOrderIds: string[] }) => {
  const response = await http.put(`/boards/updateColumn/${payload.id}`, { cardOrderIds: payload.cardOrderIds })

  return response.data
}

export const fetchUpdateBoard = async (payload: { title: string; description: string; columnOrderIds: string[] }) => {
  const id = '681f387fdc886ca3acecb0f2'
  const response = await http.put(`/boards/updateBoard/${id}`, { ...payload })

  return response.data
}

export const fetchCreateCard = async (payload: { title: string; boardId: string }) => {
  const response = await http.post(`/boards/createCard`, { ...payload })

  return response.data
}

export const fetchCreateBoard = async (payload: { title: string; boardId: string }) => {
  const response = await http.post(`/boards/createColumn`, { ...payload })

  return response.data
}
