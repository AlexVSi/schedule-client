import { FC, useContext, useEffect, useState } from 'react'
import { Loader, Plus } from 'lucide-react';
import { IAccessPurposeType, IGroup, IPurposeSubject, ITimeSlot } from '@app/types/types';
import { observer } from 'mobx-react-lite';
import { PurposeSubject } from '@entities/purposeSubject/ui/PurposeSubject';
import { Context } from 'main';
import { Modal } from '@features/modal/Modal';
import { checkScheduleConflicts } from '@shared/utils/checkConflict';
import { PurposeList } from '@widgets/purposeList/PurposeList';

interface CalendarProps {
    group: IGroup['id']
}

export const Calendar: FC<CalendarProps> = observer(({ group }) => {
    const context = useContext(Context)
    const [academicSubjectListModal, setAcademicSubjectListModal] = useState<boolean>(false)
    const [accessiblAcademicSubject, setAccessiblAcademicSubject] = useState<IAccessPurposeType[]>([])
    const [notAccessiblAcademicSubject, setNotAccessiblAcademicSubject] = useState<IAccessPurposeType[]>([])
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<ITimeSlot | null>()
    const [loader, setLoader] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            setLoader(true)
            setAccessiblAcademicSubject([])
            setNotAccessiblAcademicSubject([])
            if (selectedTimeSlot) {
                const accessList: IAccessPurposeType[] = []
                const notAccessList: IAccessPurposeType[] = []
                for (let a of context.academicSubjectStore.groupAcademicSubjects) {
                    const assigment = await checkScheduleConflicts(a, selectedTimeSlot, context)
                    if (assigment.isAccess) {
                        accessList.push(assigment)
                    } else {
                        notAccessList.push(assigment)
                    }
                }
                setAccessiblAcademicSubject(accessList)
                setNotAccessiblAcademicSubject(notAccessList)
            }
            setLoader(false)
        })()
    }, [selectedTimeSlot, context.purposeSubjectStore.groupPurposeSubjects])

    useEffect(() => {
        setSelectedTimeSlot(null)
    }, [group])

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
                        {context.timeSlotStore.days.map((day) => (
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
                            {context.timeSlotStore.timeSlots.filter(d => d.numberOfSubject === index + 1)
                                .sort((a, b) => (a.numberOfSubject - b.numberOfSubject)).map((slot) => {
                                    const event = context.purposeSubjectStore.groupPurposeSubjects.filter(p => p.slotId === slot.id)
                                    let isSubgroup = false
                                    if (context.academicSubjectStore.groupAcademicSubjects.find(a => a.id === event[0]?.subjectId)?.numberOfSubgroup) {
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
                {loader ?
                    <Loader />
                    :
                    <PurposeList
                        selectedTimeSlot={selectedTimeSlot!}
                        accessiblAcademicSubject={accessiblAcademicSubject}
                        notAccessiblAcademicSubject={notAccessiblAcademicSubject}
                        closeModal={() => setAcademicSubjectListModal(false)}
                    />
                }
            </Modal>
        </>
    )
})
