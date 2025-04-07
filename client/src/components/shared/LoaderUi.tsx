const LoaderUi = () => {
  return (
    <div className='h-screen fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/60 z-[999] overflow-hidden'>
      <div className='loader-ui'>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}

export default LoaderUi
