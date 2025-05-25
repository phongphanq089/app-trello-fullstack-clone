import { TypeLoginValidation, TypeRisterValidation } from '@/lib/validate'
import http from '../http'

export const refreshTokenAPi = async () => {
  const response = await http.get('/users/refeshToken')
  return response.data
}

export const fetchLoginUser = async (PAYLOAD: TypeLoginValidation) => {
  const response = await http.post('/users/login', { ...PAYLOAD })

  return response.data
}

export const fetchRegisterUser = async (PAYLOAD: TypeRisterValidation) => {
  const response = await http.post('/users/register', { ...PAYLOAD })

  return response.data
}

export const fetchVerifyUser = async (PAYLOAD: { email: string; token: string }) => {
  const response = await http.put('/users/verify', { ...PAYLOAD })
  return response.data
}

export const fetchResendEmail = async (emailResend: string) => {
  const response = await http.post('/users/resend-email', { email: emailResend })
  return response.data
}

export const fetchForgotPassword = async (email: string) => {
  const url = 'http://localhost:8015/auth/verify-forgot-password'
  const response = await http.post('/users/forgot-pasword', { email: email, urlRedirect: url })
  return response.data
}

interface ForgotPasswordVerifyType {
  email: string
  token: string
  password: string
}
export const fetchForgotPasswordVerify = async (PAYLOAD: ForgotPasswordVerifyType) => {
  const response = await http.post('/users/verify-forgot-password', { ...PAYLOAD })
  return response.data
}

export const fetchResendForgotPasswordVerify = async (email: string) => {
  const url = 'http://localhost:8015/auth/verify-forgot-password'
  const response = await http.post('/users/resend-forgot-password-token', { email: email, urlRedirect: url })
  return response.data
}

export const updateAccount = async (payload: any) => {
  const response = await http.put('/users/updateAccount', payload)
  return response.data
}

export const updatePassword = async (payload: any) => {
  const response = await http.put('/users/update-password', payload)
  return response.data
}
