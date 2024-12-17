import React, { FC, useContext, useState } from 'react'
import { Plus } from 'lucide-react';
import { IGroup, IPurposeSubject, ITimeSlot } from '@app/types/types';
import { observer } from 'mobx-react-lite';
import { PurposeSubject } from '@entities/purposeSubject/ui/PurposeSubject';
import { Context } from 'main';
import { Modal } from '@features/modal/Modal';
import { CardList } from '@features/cardList/CardList';
import { AcademicSubject } from '@entities/academicSubject/ui/AcademicSubject';

interface CalendarProps {
    group: IGroup['id']
}

export const Calendar: FC<CalendarProps> = observer(({ group }) => {
    const { timeSlotStore, academicSubjectStore, scheduleStore, purposeSubjectStore } = useContext(Context)
    const [academicSubjectListModal, setAcademicSubjectListModal] = useState<boolean>(false)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<ITimeSlot>()

    const handleSlotClick = (timeSlot: ITimeSlot, event: IPurposeSubject[], isSubgroup: boolean) => {
        if (event[0]?.type === 'full' && !isSubgroup) return
        if (!group) {
            alert('Пожалуйста, выберите группу');
            return;
        }
        setSelectedTimeSlot(timeSlot)
        setAcademicSubjectListModal(true)
    };

    return (
        <>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className='bg-gray-50 p-4'>
                        <th className="border border-gray-300 px-4 py-2">№ пары</th>
                        {timeSlotStore.days.filter(d => d.id < scheduleStore.currentScheduleType + 1).map((day) => (
                            <th key={day.id} className="border font-semibold text-center">
                                {day.day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <tr key={index}>
                            <th className="bg-gray-50 p-4 border border-gray-200">
                                <p className="text-center text-sm text-gray-500">{index + 1} пара</p>
                            </th>
                            {timeSlotStore.timeSlots.filter(d => d.numberOfSubject === index + 1 && d.dayOfWeek < scheduleStore.currentScheduleType + 1)
                                .sort((a, b) => (a.numberOfSubject - b.numberOfSubject)).map((slot) => {
                                    const event = purposeSubjectStore.groupPurposeSubjects.filter(p => p.slotId === slot.id)
                                    let isSubgroup = false
                                    if (academicSubjectStore.groupAcademicSubjects.find(a => a.id === event[0]?.subjectId)?.numberOfSubgroup) {
                                        isSubgroup = true
                                    }
                                    return (
                                        <th
                                            key={slot.id}
                                            className={`bg-white border border-gray-200 min-h-[100px] cursor-pointer hover:bg-blue-50 transition-colors
                                        ${selectedTimeSlot && 'bg-blue-100'}`}
                                            onClick={() => handleSlotClick(slot, event, isSubgroup)}
                                        >
                                            {event.map((e) => (
                                                <PurposeSubject
                                                    key={e.id}
                                                    purpose={e}
                                                />
                                            ))}
                                            {event.length === 0 && (
                                                <div
                                                    className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity"
                                                >
                                                    <Plus className="w-6 h-6 text-blue-400 m-8" />
                                                </div>
                                            )}
                                        </th>
                                    )
                                })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={academicSubjectListModal}
                onClose={() => setAcademicSubjectListModal(false)}
                title={'Назначения'}
                size='big'
            >
                <h2 className='font mt-3 mb-7'>Доступные пары</h2>
                <CardList>
                    {academicSubjectStore.groupAcademicSubjects.map((academicSubject) => {
                        return (
                            <AcademicSubject
                                key={academicSubject.id}
                                academicSubject={academicSubject}
                                openPurposeForm={true}
                                timeSlot={selectedTimeSlot}
                            />)
                    })}
                </CardList>
                <h2 className='mt-3 mb-7'>Недоступные пары</h2>
                <CardList>
                    {academicSubjectStore.groupAcademicSubjects.map((academicSubject) => {
                        return (
                            <AcademicSubject
                                key={academicSubject.id}
                                academicSubject={academicSubject}
                                openPurposeForm={true}
                                timeSlot={selectedTimeSlot}
                            />)
                    }
                    )}
                </CardList>
            </Modal>
        </>
    )
})
