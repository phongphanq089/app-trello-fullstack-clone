import { useMutation } from '@tanstack/react-query'
import {
  fetchForgotPassword,
  fetchForgotPasswordVerify,
  fetchLoginUser,
  fetchRegisterUser,
  fetchResendEmail,
  fetchResendForgotPasswordVerify,
  fetchVerifyUser,
  updateAccount,
  updatePassword
} from '../fetch/auth'

/**
 *LOGIN_USER
 */
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
 * @REGISTER_USER
 */
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

/**
 *@UPDATE_ACCOUNT
 */
export const useUpdateUser = () =>
  useMutation({
    mutationFn: updateAccount,
    onSuccess: (data) => {
      console.log('✅ Update user success:', data)
    },
    onError: (error) => {
      console.error('❌ Update user failed:', error)
    }
  })

/**
 * @UPDATE_PASSWORD
 */
export const useUpdatePassword = () =>
  useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      console.log('✅ Update password success:', data)
    },
    onError: (error) => {
      console.error('❌ Update password failed:', error)
    }
  })
