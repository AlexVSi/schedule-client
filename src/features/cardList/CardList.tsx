import React, { FC, useState } from 'react'

interface ListProps {
    children: React.ReactNode
}

export const CardList: FC<ListProps> = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");

    return (
        <>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {children}
            </div>
        </>
    )
}
