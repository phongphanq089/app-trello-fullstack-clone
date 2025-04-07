import axios, { AxiosInstance } from 'axios'

class HttpConfig {
  private axiosInstance: AxiosInstance

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

const httpConfig = new HttpConfig(import.meta.env.VITE_API_BASE_URL)

const http = httpConfig.getInstance()

export default http
