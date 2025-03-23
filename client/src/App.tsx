import Header from './components/shared/Header/Header'
import PreviewModernGlassyAlert from './components/shared/PreviewModernGlassyAlert'
import BoardContent from './page/boards/BoardContent/BoardContent'

function App() {
  return (
    <div className='bg-gradient min-h-screen overflow-hidden'>
      <Header />
      <BoardContent />
      <PreviewModernGlassyAlert />
    </div>
  )
}

export default App
