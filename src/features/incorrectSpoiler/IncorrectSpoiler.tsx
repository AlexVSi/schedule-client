import React, { FC } from 'react'

interface IncorrectSpoilerProps {
    children: React.ReactNode
}

export const IncorrectSpoiler: FC<IncorrectSpoilerProps> = ({ children }) => {
    return (
        <div className='p-3 text-red-500 font-bold border border-red-600 rounded-lg bg-red-200'>{children}</div>
    )
}
