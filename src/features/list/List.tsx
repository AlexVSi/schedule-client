import React, { FC } from 'react'

interface ListProps {
    title: React.ReactNode
    children: React.ReactNode
}

export const List: FC<ListProps> = ({ title, children }) => {
    return (
        <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>
        </div>
    )
}
