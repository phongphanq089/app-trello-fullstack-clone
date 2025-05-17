import axios, { AxiosInstance } from 'axios'
import { toast } from 'react-toastify'

class HttpConfig {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    })

    this.initializeResponseInterceptor()
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance
  }

  private initializeResponseInterceptor(): void {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          const status = error.response.status
          const message = (error.response.data as any)?.message || 'An error occurred.'

          // Nếu lỗi 401 mà là do token hết hạn, xử lý riêng
          if (status === 410) {
            const errorMessage = message.toLowerCase()
            if (errorMessage.includes('token') || errorMessage.includes('expired')) {
              // Xử lý riêng token hết hạn: ví dụ tự logout hoặc redirect
              console.warn('Token hết hạn, xử lý đăng xuất ở đây.')
              // Ví dụ: logoutUser() hoặc redirect('/login')
              return Promise.reject(error)
            }
            toast.error(message)
          } else if ([400, 403, 422, 404, 409, 406].includes(status)) {
            toast.error(message)
          } else if (error.request) {
            toast.error('Unable to connect to server.')
          } else {
            toast.error('An unknown error occurred.')
          }
        }

        // Handle error globally
        return Promise.reject(error)
      }
    )
  }
}

const httpConfig = new HttpConfig(import.meta.env.VITE_API_BASE_URL)

const http = httpConfig.getInstance()

export default http
