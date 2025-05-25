import { useGetListBoard } from '@/services/query/board'

import AddBoard from './components/AddBoard'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import randomColor from 'randomcolor'

const PageListBoard = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const pageParam = Number(searchParams.get('page')) || 1
  const limitParam = Number(searchParams.get('itemsPerPage')) || 12

  const updateParams = (params: Record<string, any>) => {
    const newParams = new URLSearchParams(searchParams.toString())
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })
    setSearchParams(newParams)
  }

  const { data: listBoard, isFetching, isLoading, refetch } = useGetListBoard(pageParam, limitParam)

  const totalBoards = listBoard?.result?.totalBoards || 0
  const totalPages = Math.ceil(totalBoards / limitParam)

  if (isLoading) return <div>Loading....</div>
  return (
    <div>
      <div className='flex justify-end'>
        <AddBoard refetch={refetch} />
      </div>
      <div className='grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 pt-10'>
        {listBoard?.result.boards &&
          listBoard.result.boards.map((item: any, index: number) => {
            const color = randomColor()
            return (
              <Link to={`/boards/${item._id}`} key={index}>
                <Card className='overflow-hidden dark:bg-gray-800'>
                  <div className='p-5 ' style={{ backgroundColor: color }}></div>
                  <CardContent className='px-3 py-6'>
                    <h3 className='text-lg'>{item.title}</h3>
                    <p>{item.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
      </div>
      <div className='flex justify-center gap-2 mt-10'>
        <Button disabled={pageParam <= 1} onClick={() => updateParams({ page: pageParam - 1 })}>
          Prev
        </Button>
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1
          const isActive = pageNumber === pageParam
          return (
            <Button
              key={pageNumber}
              variant={isActive ? 'default' : 'outline'}
              size='sm'
              className={isActive ? 'font-bold' : ''}
              onClick={() => updateParams({ page: pageNumber })}
            >
              {pageNumber}
            </Button>
          )
        })}
        <Button disabled={pageParam >= totalPages} onClick={() => updateParams({ page: pageParam + 1 })}>
          Next
        </Button>
      </div>

      {isFetching && <div>Loading more...</div>}
    </div>
  )
}

export default PageListBoard
