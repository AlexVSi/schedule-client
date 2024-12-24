import React, { FC, useContext, useState } from 'react'
import { ISchedule } from '@app/types/types';
import { Input } from '@shared/ui/Input';
import { Radio, RadioGroup } from '@headlessui/react';
import { CheckIcon } from 'lucide-react';
import { Button } from '@shared/ui/Button';
import { Context } from 'main';

interface ScheduleFormProps {
    schedule?: ISchedule
    closeModal: (flag: boolean) => void
}

export const ScheduleForm: FC<ScheduleFormProps> = ({ schedule, closeModal }) => {
    const { scheduleStore, timeSlotStore } = useContext(Context)
    const [formData, setFormData] = useState<Omit<ISchedule, 'id'>>(schedule ? {
        name: schedule.name,
        isPublic: schedule.isPublic,
        timeOfStart: schedule.timeOfStart,
    }
        :
        {
            name: '',
            isPublic: false,
            timeOfStart: new Date,
        })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (schedule?.id) {
            await scheduleStore.edit({ id: schedule.id, ...formData })
            await scheduleStore.setPublic(schedule.id, formData.isPublic)
        } else {
            const id = await scheduleStore.add(formData)
            const names = await timeSlotStore.fetchTemplatesNames()
            if (names) {
                await timeSlotStore.initTemplate(names?.[0].name, id!)
                await timeSlotStore.fetchAllBySchedule(id!)
            }
        }
        setFormData({
            name: '',
            isPublic: false,
            timeOfStart: new Date,
        })
        closeModal(false)
    }

    return (
        <form action="" onSubmit={handleSubmit} className='flex flex-col gap-3 '>
            <Input
                label='Название'
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />

            <RadioGroup value={formData.isPublic} onChange={(val) => setFormData({ ...formData, isPublic: val })} aria-label="Server size" className="space-y-2">
                <p>Сделать расписание публичным?</p>
                {[
                    { value: true, content: 'Да' },
                    { value: false, content: 'Нет' },
                ].map((v, i) => {
                    return (
                        <Radio
                            key={i}
                            value={v.value}
                            className="group relative flex cursor-pointer rounded-lg bg-white/5 py-2 px-5 shadow-md transition data-[checked]:bg-white/10"
                        >
                            <div className="flex w-full items-center justify-between">
                                <div className="text-sm">
                                    <p className="font-semibold ">{v.content}</p>
                                </div>
                                <CheckIcon className="size-6 opacity-0 transition group-data-[checked]:opacity-100 " />
                            </div>
                        </Radio>
                    )
                })}
            </RadioGroup>
            <div className="flex space-x-4">
                <Button
                    type="submit"
                    className="flex-1"
                >
                    Сохранить
                </Button>
                <Button
                    type="reset"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                        closeModal(false)
                    }}
                >
                    Отменить
                </Button>
            </div>
        </form>
    )
}
