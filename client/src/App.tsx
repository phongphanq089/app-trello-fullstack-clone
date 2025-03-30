import Header from './components/shared/Header/Header'
// import PreviewModernGlassyAlert from './components/shared/PreviewModernGlassyAlert'
import BoardPage from './page/board/BoardPage'

function App() {
  return (
    <div className='bg-gradient min-h-screen overflow-hidden'>
      <Header />
      {/* <BoardContent /> */}
      <BoardPage />
      {/* <PreviewModernGlassyAlert /> */}
    </div>
  )
}

export default App
