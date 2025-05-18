import http from '../http'

export const refreshTokenAPi = async () => {
  const response = await http.get('/users/refeshToken')
  return response.data
}
