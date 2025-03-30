import React from 'react'

interface ColumnHeaderProps {
  title: string
  attributes?: any
  listeners?: any
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, attributes, listeners }) => {
  return (
    <div {...attributes} {...listeners} className='font-bold mb-4 cursor-grab active:cursor-grabbing'>
      {title}
    </div>
  )
}

export default ColumnHeader
