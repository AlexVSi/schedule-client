import React, { FC, useContext, useEffect, useState } from 'react'
import { Input } from '@shared/ui/Input'
import { Context } from 'main'
import { Button } from '@shared/ui/Button'
import { IBusyTime, ITeacher } from '@app/types/types'

interface BusyTimeFormProps {
    teacherId: ITeacher['id']
    onAdd: (newBusyTime: IBusyTime) => void
}

export const BusyTimeForm: FC<BusyTimeFormProps> = ({ teacherId, onAdd }) => {
    const { teacherStore, timeSlotStore } = useContext(Context)
    const [ time, setTime ] = useState({
        startTime: '00:00',
        endTime: '00:00',
    })

    const [busyTime, setBusyTime] = useState<Omit<IBusyTime, 'id'>>({
        teacherId: teacherId,
        dayOfWeek: 1,
        startTime: new Date(0, 0, 0, +time.startTime),
        endTime: new Date(0, 0, 0, +time.endTime),
    })

    useEffect(() => {
        setBusyTime({...busyTime, startTime: createDateTime(time.startTime), endTime: createDateTime(time.endTime)})
    }, [time])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(busyTime.startTime, busyTime.endTime)
        const responce = await teacherStore.addBusyTime(busyTime)
        onAdd({...busyTime, id: responce!})
    }

    const createDateTime = (time: string) => {
        const [h, m] = time.split(':').map(Number)
        const date = new Date(Date.UTC(0, 0, 0, h, m))
        return date
    }

    return (
        <div>
            <select onChange={(e) => setBusyTime({...busyTime, dayOfWeek: +e.target.value})}>
                {timeSlotStore.days.map(d => (
                    <option
                        key={d.id}
                        value={d.id}
                    >
                        {d.day}
                    </option>
                ))}
            </select>

            <div className='mb-4'>
                с
                <Input
                    name='startTime'
                    type='time'
                    value={time.startTime}
                    onChange={(e) => setTime({...time, startTime: e.target.value})}
                />
                по
                <Input
                    name='endTime'
                    type='time'
                    value={time.endTime}
                    onChange={(e) => setTime({...time, endTime: e.target.value})}
                />
            </div>
            <Button
                type="submit"
                variant={'outline'}
                onClick={handleSubmit}
            >
                Добавить
            </Button>
        </div>
    )
}
