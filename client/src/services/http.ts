import axios, { AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { logoutUser } from '@/redux/slice/authSlice'
import { refreshTokenAPi } from './fetch/auth'

let axiosReduxStore: any
let refreshTokenPromise: Promise<string | undefined> | null = null

export const injectStore = (_store: any) => {
  axiosReduxStore = _store
}

const createHttpInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })

  instance.interceptors.request.use((config) => {
    if (config.data instanceof FormData && config.headers && 'Content-Type' in config.headers) {
      delete config.headers['Content-Type']
    }
    return config
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response) {
        const status = error.response.status
        const message = (error.response.data as any)?.message || 'An error occurred.'

        // Xử lý refresh token
        if (status === 410 && !originalRequest._retry) {
          originalRequest._retry = true

          if (!refreshTokenPromise) {
            refreshTokenPromise = refreshTokenAPi()
              .then((data) => data?.accessToken)
              .catch(() => {
                axiosReduxStore.dispatch(logoutUser(false))
              })
              .finally(() => {
                refreshTokenPromise = null
              })
          }

          const newAccessToken = await refreshTokenPromise

          if (newAccessToken) {
            return instance(originalRequest)
          } else {
            return Promise.reject(error)
          }
        }

        if (status === 401) {
          axiosReduxStore.dispatch(logoutUser(false))
        } else if ([400, 403, 422, 404, 409, 406].includes(status)) {
          toast.error(message)
        } else if (error.request) {
          // toast.error('Unable to connect to server.')
        } else {
          toast.error('An unknown error occurred.')
        }
      }

      return Promise.reject(error)
    }
  )

  return instance
}

const http = createHttpInstance(import.meta.env.VITE_API_BASE_URL)

export default http
