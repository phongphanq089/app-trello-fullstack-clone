import { useMutation } from '@tanstack/react-query'
import http from '../http'

interface RegisterUser {
  email: string
  password: string
}

const fetchLoginUser = async (PAYLOAD: RegisterUser) => {
  const response = await http.post('/users/login', { ...PAYLOAD })

  return response.data
}

export const useLoginUser = () =>
  useMutation({
    mutationFn: fetchLoginUser,
    onSuccess: (data) => {
      console.log('Login successful:', data)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })
