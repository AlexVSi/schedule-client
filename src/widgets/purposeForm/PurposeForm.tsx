import React, { FC, useContext, useState } from 'react'
import { SelectList } from '@features/selectList/SelectList'
import { Button } from '@shared/ui/Button'
import { IAcademicSubject, IClassroom, IPurposeSubject, ITimeSlot } from '@app/types/types'
import { Radio, RadioGroup } from '@headlessui/react'
import { CheckIcon } from 'lucide-react'
import { Context } from 'main'

interface PurposeFormProps {
    academicSubject: IAcademicSubject
    closeModal: (flag: boolean) => void
    classrooms: IClassroom[]
    timeSlot: ITimeSlot
}

export const PurposeForm: FC<PurposeFormProps> = ({ academicSubject, closeModal, classrooms, timeSlot }) => {
    const { purposeSubjectStore } = useContext(Context)
    const [formData, setFormData] = useState<Omit<IPurposeSubject, 'id'>>({
        type: 0,
        isRemotely: false,
        subjectId: academicSubject.id,
        classroomId: 0,
        slotId: timeSlot.id,
    })

    const weekTypes = [
        { value: 0, type: 'Все недели' },
        { value: 1, type: 'Четная неделя' },
        { value: 2, type: 'Нечетная неделя' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(formData.slotId)
        if (!formData.subjectId || !formData.classroomId || !formData.slotId) alert('надоел');

        // const startTime = ;
        // const endTime = new Date(startTime.getTime() + 90 * 60000); // 90 minutes by default

        try {
            purposeSubjectStore.add(formData)

            //   setSelectedSlot(null);
            //   setSelectedAssignment('');
            //   setSelectedTeacher('');
            //   setSelectedClassroom('');
        } catch (error) {
            alert(error);
        }
        closeModal(true)
    }

    const handleSelectionChange = (selectedItems: { id: number; itemLabel: string }[]) => {
        setFormData({...formData, classroomId: selectedItems[0].id})
    }

    return (
        <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <SelectList
                label='Аудитории'
                items={classrooms.map(c => { return { id: c.id, itemLabel: c.name } })}
                onSelectionChange={handleSelectionChange}
            />
            <RadioGroup value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} aria-label="Server size" className="space-y-2">
                <p>Тип недели</p>
                {weekTypes.map(type => (
                    <Radio
                        key={type.value}
                        value={type.value}
                        className="group relative flex cursor-pointer rounded-lg bg-white/5 py-4 px-5 shadow-md transition data-[checked]:bg-white/10"
                    >
                        <div className="flex w-full items-center justify-between">
                            <div className="text-sm">
                                <p className="font-semibold ">{type.type}</p>
                            </div>
                            <CheckIcon className="size-6 opacity-0 transition group-data-[checked]:opacity-100 " />
                        </div>
                    </Radio>
                ))}
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
                    onClick={() => closeModal(false)}
                >
                    Отменить
                </Button>
            </div>
        </form>
    )
}
