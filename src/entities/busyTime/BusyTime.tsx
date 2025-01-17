import { FC, useContext } from 'react'
import { IBusyTime } from '@app/types/types'
import { Card } from '@features/card/Card'
import { Context } from 'main'

interface BusyTimeProps {
    busyTime: IBusyTime
    onDelete: (id: IBusyTime['id']) => void
}

export const BusyTime: FC<BusyTimeProps> = ({ busyTime, onDelete }) => {
    const { teacherStore, timeSlotStore } = useContext(Context)
    return (
        <Card
            title={`${timeSlotStore.days.find(d => d.id === busyTime.dayOfWeek)?.day}
                ${String(new Date(busyTime.startTime).getUTCHours()).padStart(2, '0')}:${String(new Date(busyTime.startTime).getUTCMinutes()).padStart(2, '0')}
                –
                ${String(new Date(busyTime.endTime).getUTCHours()).padStart(2, '0')}:${String(new Date(busyTime.endTime).getUTCMinutes()).padStart(2, '0')}`
            }
            onClickDelete={(e) => {
                e?.preventDefault()
                onDelete(busyTime.id)
                teacherStore.removeBusyTime(busyTime.id)
            }}
        >
        </Card>
    )
}
