import React, { FC, useContext, useEffect, useState } from 'react'
import { Plus } from 'lucide-react';
import { IAcademicSubject, IGroup, IPurposeSubject, ITimeSlot } from '@app/types/types';
import { observer } from 'mobx-react-lite';
import { SlotPurpose } from '@features/slotPurpose/SlotPurpose';
import { Context } from 'main';
import { Modal } from '@features/modal/Modal';
import { CardList } from '@features/cardList/CardList';
import { AcademicSubject } from '@entities/academicSubject/ui/AcademicSubject';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CalendarProps {
    group: IGroup['id']
}

export const Calendar: FC<CalendarProps> = observer(({ group }) => {
    const { timeSlotStore, academicSubjectStore, scheduleStore, purposeSubjectStore, groupStore } = useContext(Context)
    const [academicSubjectListModal, setAcademicSubjectListModal] = useState<boolean>(false)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<ITimeSlot>()
    const [groupPurposes, setGroupPurposes] = useState<IPurposeSubject[]>([])
    const [selecredGroup, setSelectedGroup] = useState<IGroup['id']>(group)

    const handleSlotClick = (timeSlot: ITimeSlot) => {
        if (!group) {
            alert('Пожалуйста, выберите группу');
            return;
        }
        // setSelectedSlot({ date, time });
        console.log(timeSlot)
        setSelectedTimeSlot(timeSlot)
        setAcademicSubjectListModal(true)
        // setSelectedAcademicSubject(0);
        // setSelectedTeacher(0);
        // setSelectedClassroom(0);
    };

    if (scheduleStore.currentScheduleType === 6) {
        timeSlotStore.days.push({ id: 6, day: 'Суббота' })
    }

    return (
        <>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className='bg-gray-50 p-4'>
                        <th className="border border-gray-300 px-4 py-2">№ пары</th>
                        {timeSlotStore.days.map((slot) => (
                            <th key={slot.id} className="border font-semibold text-center">
                                {slot.day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: timeSlotStore.days.length }).map((_, index) => (
                        <tr key={index}>
                            <th className="bg-gray-50 p-4 border border-gray-200">
                                <p className="text-center text-sm text-gray-500">{index + 1} пара</p>
                            </th>
                            {timeSlotStore.timeSlots.filter(d => d.numberOfSubject === index + 1 && d.dayOfWeek < scheduleStore.currentScheduleType + 1)
                                .sort((a, b) => (a.numberOfSubject - b.numberOfSubject)).map((slot) => {
                                const event = purposeSubjectStore.groupPurposeSubjects.find(p => p.slotId === slot.id)
                                return (
                                    <th
                                        key={slot.id}
                                        className={`bg-white p-2 border border-gray-200 min-h-[100px] cursor-pointer hover:bg-blue-50 transition-colors
                                        ${selectedTimeSlot && 'bg-blue-100'}`}
                                        onClick={() => handleSlotClick(slot)}
                                    >
                                        {event &&
                                        <SlotPurpose
                                            purpose={event}
                                        />}
                                        {!event && group && (
                                            <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                                                {format(slot?.startTime, 'HH:mm', { locale: ru })} - {format(slot?.endTime, 'HH:mm', { locale: ru })}
                                                <Plus className="w-6 h-6 text-blue-400" />
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
            </Modal>
        </>
    )
})
