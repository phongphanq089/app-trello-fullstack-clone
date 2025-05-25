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

export const fetchUpdateBoard = async (
  boardId: string,
  payload: { title: string; description: string; columnOrderIds: string[] }
) => {
  const response = await http.put(`/boards/updateBoard/${boardId}`, { ...payload })

  return response.data
}

export const fetchCreateCard = async (payload: { title: string; boardId: string }) => {
  const response = await http.post(`/boards/createCard`, { ...payload })

  return response.data
}

export const fetchCreateColumn = async (payload: { title: string; boardId: string }) => {
  const response = await http.post(`/boards/createColumn`, { ...payload })

  return response.data
}

export const fetchGetBoard = async (page = '1', itemsPerPage = '12') => {
  const response = await http.post(`/boards/board-list?page=${page}&itemsPerPage=${itemsPerPage}`)

  return response.data
}

export const fetchAddNewBoard = async (payload: any) => {
  const response = await http.post('/boards/createBoard', payload)

  return response.data
}
