import BoardPage from '@/page/board/BoardPage'

const BoardLayout = () => {
  return (
    <>
      <div className='bg-gradient-1 bg-black min-h-screen overflow-hidden'>
        {/* <Header /> */}
        {/* <BoardContent /> */}
        <div className='mt-14'></div>
        <BoardPage />
        {/* <PreviewModernGlassyAlert /> */}
      </div>
    </>
  )
}

export default BoardLayout
