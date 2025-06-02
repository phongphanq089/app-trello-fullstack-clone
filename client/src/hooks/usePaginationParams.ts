import { useSearchParams } from 'react-router-dom'

export const usePaginationParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const getNumberParam = (key: string, defaultValue: number) => {
    const value = searchParams.get(key)
    return value ? parseInt(value) || defaultValue : defaultValue
  }

  const setPagination = (page: number, limit: number) => {
    const newParams = new URLSearchParams(searchParams.toString())
    newParams.set('page', String(page))
    newParams.set('limit', String(limit))
    setSearchParams(newParams)
  }

  return {
    page: getNumberParam('page', 1),
    limit: getNumberParam('limit', 12),
    setPagination
  }
}
