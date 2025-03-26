import React from 'react'
import { LuUtensils,LuTrendingUp,LuTrendingDown,LuTrash2 } from 'react-icons/lu'

const TransactionInfoCard = ({title,icon,date,amount,type,hideDeleteBtn}) => {
    console.log(LuUtensils)
  return (
    <div className='relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100/60'>
      <div className='w-12 h-12 flex items-center justify-center text-xl text-gray-800 rounded-full '>
        {icon ? (
            <img src={icon} alt={title} className='w-6 h-6'/>
        ):(<LuTrendingUp/>)}
      </div>
    </div>
  )
}

export default TransactionInfoCard
