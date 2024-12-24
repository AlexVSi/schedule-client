import React, { useContext } from 'react'
import { GraduationCap } from 'lucide-react'
import { Context } from 'main'
import { observer } from 'mobx-react-lite'

export const Header: React.FC = observer(() => {
    const { scheduleStore } = useContext(Context)

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
                    {scheduleStore.schedules.find(s => s.id === scheduleStore.currentScheduleId)?.name}
                    </span>
                </div>
            </nav>
        </header>
    )
})
