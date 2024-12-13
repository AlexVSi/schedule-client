import React, { FC, useContext, useEffect, useState } from 'react'
import { format, startOfWeek, addDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { IGroup, IPurposeSubject, ITimeSlot } from '@app/types/types';
import { observer } from 'mobx-react-lite';
import { SlotPurpose } from '@features/slotPurpose/SlotPurpose';
import { Context } from 'main';
import { Modal } from '@features/modal/Modal';
import { CardList } from '@features/cardList/CardList';
import { AcademicSubject } from '@entities/academicSubject/ui/AcademicSubject';

interface CalendarProps {
    group: IGroup['id']
    groupPurposes: IPurposeSubject[]
}

export const Calendar: FC<CalendarProps> = observer(({ group, groupPurposes }) => {
    const { timeSlotStore, academicSubjectStore, specialityStore, teacherStore, classroomStore, subjectStore, scheduleStore, purposeSubjectStore } = useContext(Context)
    const [academicSubjectListModal, setAcademicSubjectListModal] = useState<boolean>(false)
    const [timeSlotList, setTimeSlotList] = useState<ITimeSlot[]>([])
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<ITimeSlot>()
    const today = new Date();
    const weekStart = startOfWeek(today, { locale: ru });
    const weekDays = Array.from({ length: scheduleStore.currentScheduleType === 6 ? 5 : 5 }, (_, i) => addDays(weekStart, i));
    const timeSlots = Array.from({ length: 5 }, (_, i) => {
        const hour = 1 + i;
        return `${hour} пара`;
    });

    useEffect(() => {
        fetchAcademicSubject()
        fetchTimeSlots()
    }, [])

    async function fetchTimeSlots() {
        const responce = await timeSlotStore.fetchAllBySchedule(scheduleStore.currentScheduleId)
        if (responce) {
            setTimeSlotList(timeSlotStore.timeSlots)
            console.log(timeSlotList)
        }
    }

    async function fetchAcademicSubject() {
        await specialityStore.fetchAllSpecialities()
        await teacherStore.fetchAllTeachers()
        await classroomStore.fetchAllClassrooms()
        await subjectStore.fetchAllsubjects()
    }

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

    const days = [
        { id: 1, day: 'Понедельник' },
        { id: 2, day: 'Вторник' },
        { id: 3, day: 'Среда' },
        { id: 4, day: 'Четверг' },
        { id: 5, day: 'Пятница' },
    ]

    if (scheduleStore.currentScheduleType === 6) {
        days.push({ id: 6, day: 'Суббота' })
    }


    return (
        <>
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className='bg-gray-50 p-4'>
                        <th className="border border-gray-300 px-4 py-2">№ пары</th>
                        {days.map((slot) => (
                            <th key={slot.id} className="font-semibold text-center">
                                {/* {days.find(d => d.id === slot.daysOfWeek)?.day} */}
                                {slot.day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: days.length }).map((_, index) => (
                        <tr key={index}>
                            <th className="bg-gray-50 p-4 border-t border-gray-200">
                                <p className="text-center text-sm text-gray-500">{index + 1} пара</p>
                            </th>
                            {timeSlotStore.timeSlots.filter(d => d.numberOfSubject === index + 1)
                                .sort((a, b) => (a.startTime.getHours() - b.startTime.getHours())).map((slot) => {
                                const event = purposeSubjectStore.groupPurposeSubjects.find(p => p.timeSlotId === slot.id)
                                const startTime = new Date(slot.startTime)
                                const endTime = new Date(slot.endTime)
                                return (
                                    <th
                                        key={`${slot.id}-${index}`}
                                        className={`bg-white p-2 border-t border-gray-200 min-h-[100px] cursor-pointer hover:bg-blue-50 transition-colors
                                        ${selectedTimeSlot?.startTime && format(selectedTimeSlot?.endTime, 'yyyy-MM-dd') === currentDate ? 'bg-blue-100' : ''}`}
                                        onClick={() => console.log(slot.id, index)}
                                    >
                                        {event?.classroomId}
                                        {!event && group && (
                                            <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                                                {`${startTime.getHours()}:${startTime.getMinutes()} – ${endTime.getHours()}:${endTime.getMinutes()}`}
                                                {/* {`${dateTest}`} */}
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


    // return (
    //     <>
    //         <div className="overflow-x-auto">
    //             <div className="min-w-[800px]">
    //                 <div className={`grid gap-px bg-gray-200 ${scheduleStore.currentScheduleType === 6 ? 'grid-cols-7' : 'grid-cols-6'}`}>
    //                     <div className="bg-gray-50 p-4">
    //                         <div className="font-semibold text-center text-gray-500">Время</div>
    //                     </div>

    //                     {days.map((day) => (
    //                         <div
    //                             key={day.day}
    //                             className={`bg-white p-4`}
    //                         >
    //                             <div className={`font-semibold text-center`}>
    //                                 {day.day}
    //                             </div>
    //                         </div>
    //                     ))}

    //                     {timeSlots.map((time) => (
    //                         <React.Fragment key={time}>
    //                             <div className="bg-gray-50 p-4 border-t border-gray-200">
    //                                 <div className="text-center text-sm text-gray-500">{`${time}`}</div>
    //                             </div>
    //                             {weekDays.map((slot) => {
    //                                 // {timeSlotList.map((slot) => {
    //                                 const currentDate = format(slot, 'yyyy-MM-dd');
    //                                 // const currentDate = format(days.find(d => d.id === slot.daysOfWeek)!.day, 'd');
    //                                 // const currentDate = days.find(d => d.id === slot.daysOfWeek)!.day;
    //                                 const [hour] = `${time}`
    //                                 const slotPurpose = groupPurposes.filter(purpose => {
    //                                     const timeSlot = timeSlotList.find(t => t.id === purpose.timeSlotId)
    //                                     const eventDate = format(timeSlot!.startTime, 'yyyy-MM-dd');
    //                                     const eventHour = format(timeSlot!.startTime, 'H');
    //                                     return eventDate === currentDate && eventHour === hour;
    //                                 });

    //                                 return (
    //                                     <div
    //                                         key={`${currentDate}-${time}`}
    //                                         className={`bg-white p-2 border-t border-gray-200 min-h-[100px] cursor-pointer hover:bg-blue-50 transition-colors
    //                                         ${selectedTimeSlot?.startTime && format(selectedTimeSlot?.endTime, 'yyyy-MM-dd') === currentDate ? 'bg-blue-100' : ''}`}
    //                                         onClick={() => handleSlotClick(selectedTimeSlot!)}
    //                                     >
    //                                         {/* {slotPurpose.map(purpose => (
    //                                             <SlotPurpose
    //                                                 purpose={purpose}
    //                                             />
    //                                         ))} */}
    //                                         {!slotPurpose.length && group && (
    //                                             <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">

    //                                                 <Plus className="w-6 h-6 text-blue-400" />
    //                                             </div>
    //                                         )}
    //                                     </div>
    //                                 );
    //                             })}
    //                         </React.Fragment>
    //                     ))}
    //                 </div>
    //             </div>
    //         </div>
    //         <Modal
    //             isOpen={academicSubjectListModal}
    //             onClose={() => setAcademicSubjectListModal(false)}
    //             title={'Назначения'}
    //             size='big'
    //         >
    //             <h2 className='font mt-3 mb-7'>Доступные пары</h2>
    //             <CardList>
    //                 {academicSubjectStore.groupAcademicSubjects.map((academicSubject) => {
    //                     return (
    //                         <AcademicSubject
    //                             key={academicSubject.id}
    //                             academicSubject={academicSubject}
    //                             openPurposeForm={true}
    //                             timeSlot={selectedTimeSlot}
    //                         />)
    //                 })}
    //             </CardList>
    //             <h2 className='mt-3 mb-7'>Недоступные пары</h2>
    //         </Modal>
    //     </>
    // )
})
