import React from 'react'
import { GraduationCap } from 'lucide-react'

export const Header: React.FC = () => {
    return (
        <header>
            <nav className="bg-white shadow-lg border-b border-blue-100 top-0 left-0 right-0 z-10">
                <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
                    <div className='flex items-center'>
                        <GraduationCap className="h-8 w-8 text-blue-600" />
                        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                            Расписание занятий
                        </span>
                    </div>
                    <span>
                        2024-2025 год 1 семестр
                    </span>
                </div>
            </nav>
        </header>
    )
}
