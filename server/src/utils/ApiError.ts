type ErrorDetails = Record<string, any> | string[] | null

class ApiError extends Error {
  public statusCode: number
  public details: ErrorDetails
  public isJoi?: boolean

  constructor(statusCode: number, message: string, details: any = null) {
    super(message)

    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details

    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(message: string, details: any = null): ApiError {
    return new ApiError(400, message, details)
  }

  static notFound(message: string, details: any = null): ApiError {
    return new ApiError(404, message, details)
  }

  static internal(message: string, details: any = null): ApiError {
    return new ApiError(500, message, details)
  }
}

export default ApiError
