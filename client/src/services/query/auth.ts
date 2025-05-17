import { useMutation } from '@tanstack/react-query'
import http from '../http'
import { TypeLoginValidation, TypeRisterValidation } from '@/lib/validate'

/**
 *
 * @PAYLOAD { email: string;  password: string; }
 * @returns
 */
const fetchLoginUser = async (PAYLOAD: TypeLoginValidation) => {
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

/**
 *
 * @PAYLOAD  {
    email: string;
    password: string;
    confirmPwd: string;
    username?: string | undefined;
}
 * @returns
 */
const fetchRegisterUser = async (PAYLOAD: TypeRisterValidation) => {
  const response = await http.post('/users/register', { ...PAYLOAD })

  return response.data
}

export const useRegisterUser = () =>
  useMutation({
    mutationFn: fetchRegisterUser,
    onSuccess: (data) => {
      console.log('Login successful:', data)
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })

/**
 *@VERIFY_ACCOUNT
 */
const fetchVerifyUser = async (PAYLOAD: { email: string; token: string }) => {
  const response = await http.put('/users/verify', { ...PAYLOAD })
  return response.data
}

export const useVerifyUser = () =>
  useMutation({
    mutationFn: fetchVerifyUser,
    onSuccess: (data) => {
      console.log('✅ Verify success:', data)
    },
    onError: (error) => {
      console.error('❌ Verify failed:', error)
    }
  })

/**
 *@RESEND_EMAIL
 */
const fetchResendEmail = async (emailResend: string) => {
  const response = await http.post('/users/resend-email', { email: emailResend })
  return response.data
}

export const useResendEmail = () =>
  useMutation({
    mutationFn: fetchResendEmail,
    onSuccess: (data) => {
      console.log('✅ Resend Email success:', data)
    },
    onError: (error) => {
      console.error('❌ Resend Email failed:', error)
    }
  })

/**
 *@FORGOT_PASSWORD
 */
const fetchForgotPassword = async (email: string) => {
  const url = 'http://localhost:8015/auth/verify-forgot-password'
  const response = await http.post('/users/forgot-pasword', { email: email, urlRedirect: url })
  return response.data
}

export const useForgotPassword = () =>
  useMutation({
    mutationFn: fetchForgotPassword,
    onSuccess: (data) => {
      console.log('✅ Resend Email success:', data)
    },
    onError: (error) => {
      console.error('❌ Resend Email failed:', error)
    }
  })

/**
 *@FORGOT_PASSWORD_VERIFY
 */

interface ForgotPasswordVerifyType {
  email: string
  token: string
  password: string
}
const fetchForgotPasswordVerify = async (PAYLOAD: ForgotPasswordVerifyType) => {
  const response = await http.post('/users/verify-forgot-password', { ...PAYLOAD })
  return response.data
}

export const useForgotPasswordVerify = () =>
  useMutation({
    mutationFn: fetchForgotPasswordVerify,
    onSuccess: (data) => {
      console.log('✅ Update password success:', data)
    },
    onError: (error) => {
      console.error('❌ Update password failed:', error)
    }
  })

/**
 *@RESEND_FORGOT_PASSWORD_VERIFY
 */

const fetchResendForgotPasswordVerify = async (email: string) => {
  const url = 'http://localhost:8015/auth/verify-forgot-password'
  const response = await http.post('/users/resend-forgot-password-token', { email: email, urlRedirect: url })
  return response.data
}

export const useResendForgotPasswordVerify = () =>
  useMutation({
    mutationFn: fetchResendForgotPasswordVerify,
    onSuccess: (data) => {
      console.log('✅ Resend password success:', data)
    },
    onError: (error) => {
      console.error('❌ Resend password failed:', error)
    }
  })
