import React, { FC } from 'react'

interface ListProps {
    children: React.ReactNode
    search?: boolean
}

export const CardList: FC<ListProps> = ({ children }) => {

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {children}
        </div>
    )
}
