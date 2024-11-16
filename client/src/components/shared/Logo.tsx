import { LayoutGrid } from 'lucide-react'
import { Link } from 'react-router-dom'
const Logo = () => {
  return (
    <Link to='/' className='flex items-center gap-2 font-semibold text-lg text-white'>
      <LayoutGrid />
      APP TRELLO
    </Link>
  )
}

export default Logo
