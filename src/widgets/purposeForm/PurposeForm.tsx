import React, { FC, useContext, useState } from 'react'
import { SelectList } from '@features/selectList/SelectList'
import { Button } from '@shared/ui/Button'
import { IAcademicSubject, IClassroom, IPurposeSubject, ITimeSlot } from '@app/types/types'
import { RadioGroup } from '@headlessui/react'
import { Context } from 'main'
import Dropdown from '@features/dropdown/Dropdown'
import { RadioItem } from '@shared/ui/RadioItem'

interface PurposeFormProps {
    academicSubject: IAcademicSubject
    classrooms: IClassroom[]
    timeSlot: ITimeSlot
    closeModal: (flag: boolean) => void
    notAccsessReason?: string
}

export const PurposeForm: FC<PurposeFormProps> = ({ academicSubject, closeModal, classrooms, timeSlot, notAccsessReason }) => {
    const { subjectStore, purposeSubjectStore, teacherStore } = useContext(Context)
    const [formData, setFormData] = useState<Omit<IPurposeSubject, 'id'>>({
        type: 'full',
        isRemotely: false,
        subjectId: academicSubject.id,
        classroomId: 0,
        slotId: timeSlot.id,
    })

    const teacher = teacherStore.teachers.find(t => t.id === academicSubject.teacherId)

    const weekTypes = [
        { value: 'full', type: 'Все недели' },
        { value: 'even', type: 'Четная неделя' },
        { value: 'odd', type: 'Нечетная неделя' }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.subjectId || (!formData.classroomId && !formData.isRemotely) || !formData.slotId) return
        console.log('------------------------------------------------------------------------')
        try {
            purposeSubjectStore.add(formData)
            closeModal(true)
        } catch (error) {
            alert(error);
        }
    }

    const handleSelectionChange = (selectedItems: { id: number; itemLabel: string }[]) => {
        setFormData({ ...formData, classroomId: selectedItems[0].id })
    }

    return (
        <form className='flex flex-col gap-1 justify-between border border-gray-200 rounded-xl p-5' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-1'>
                {notAccsessReason && <p className='text-red-400'>{notAccsessReason}</p>}
                <p className='font-medium'>{subjectStore.subjects.find(s => s.id === academicSubject.name)?.name}</p>
                <p>{`${teacher?.lastname} ${teacher?.firstname[0]}.${teacher?.surname[0]}.`}</p>
                <p>Часов в неделю: {academicSubject.countHoursPerWeek}</p>
                <p>{academicSubject.numberOfSubgroup ? `${academicSubject.numberOfSubgroup} подгруппа` : 'Вся группа'}</p>
            </div>
            <Dropdown title='Развернуть'>
                <SelectList
                    label='Аудитории'
                    items={classrooms.map(c => { return { id: c.id, itemLabel: c.name } })}
                    onSelectionChange={handleSelectionChange}
                />
                <p>Тип недели</p>
                <RadioGroup value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} aria-label="Server size" className="space-y-2">
                    {weekTypes.map((type, i) => (
                        <RadioItem
                            key={i}
                            value={type.value}
                            item={type.type}
                        />
                    ))}
                </RadioGroup>
                <p>Формат проведения</p>
                <RadioGroup value={formData.isRemotely} onChange={(val) => setFormData({ ...formData, isRemotely: val })} aria-label="Server size" className="space-y-2">
                    {[
                        { value: false, format: 'Очно' },
                        { value: true, format: 'Заочно' }
                    ].map((v, i) => {
                        return (
                            <RadioItem
                                key={i}
                                value={v.value}
                                item={v.format}
                            />
                        )
                    })}
                </RadioGroup>
                <div className="flex space-x-4 mt-2">
                    <Button
                        type="submit"
                        className="flex-1"
                    >
                        Назначить
                    </Button>
                </div>
            </Dropdown>
        </form>
    )
}
