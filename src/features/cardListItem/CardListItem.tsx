import React, { FC } from 'react'

interface CardListItemProps {
    // id: string
    title: string
}

export const CardListItem: FC<CardListItemProps> = ({ title }) => {
    return (
        <>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{title}</span>
            </div>
        </>
    )
}
