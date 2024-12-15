import React, { FC, useContext, useEffect, useState } from 'react'
import { Context } from 'main';
import { format } from 'date-fns';
import { IPurposeSubject, ITimeSlot } from '@app/types/types';
import { Modal } from '@features/modal/Modal';
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction';
import { X } from 'lucide-react';
import { Button } from '@shared/ui/Button';

interface SlotPurposeProps {
    purpose: IPurposeSubject
}

export const SlotPurpose: FC<SlotPurposeProps> = ({ purpose }) => {
    const { academicSubjectStore, subjectStore, teacherStore, classroomStore, timeSlotStore, purposeSubjectStore } = useContext(Context)
    const [removePurposeConfirmAction, setRemovePurposeConfirmAction] = useState<boolean>(false)
    const [timeSlot, setTimeSlot] = useState<ITimeSlot>()

    useEffect(() => {
        fetchTimeSlot()
    }, [])

    async function fetchTimeSlot() {
        const response = await timeSlotStore.fetchTimeSlot(purpose.slotId)
        if (response) {
            setTimeSlot(response)
        }
    }

    const academicSubject = academicSubjectStore.groupAcademicSubjects.find(a => a.id === purpose.subjectId);
    const subject = academicSubject ? subjectStore.subjects.find(s => s.id === academicSubject?.name) : null;
    const teacher = teacherStore.teachers.find(t => t.id === academicSubject?.teacherId);
    const classroom = classroomStore.classrooms.find(c => c.id === purpose.classroomId);
    return (
        <>
            <div
                className="p-2 rounded-lg text-sm shadow-sm transition-all hover:scale-105 border-2 border-blue-600"
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="font-medium"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                    }}
                >
                    <p></p>
                    <p className='col-auto'>{subject?.name}</p>
                    <X
                        onClick={() => setRemovePurposeConfirmAction(true)}
                        className='h-4 w-4 justify-self-end'
                    />
                </div>
                <div className="text-xs">{`${teacher?.lastname} ${teacher?.firstname[0]}.${teacher?.surname[0]}.`}</div>
                <div className="text-xs">Аудитория {classroom?.name}</div>
                {timeSlot && <div className="text-xs mt-1 font-medium">
                    {format(timeSlot?.startTime, 'HH:mm')} - {format(timeSlot?.endTime, 'HH:mm')}
                </div>}
            </div>

            <Modal
                isOpen={removePurposeConfirmAction}
                onClose={() => setRemovePurposeConfirmAction(false)}
                title='Удалить событие?'
            >
                <ConfirmAction
                    onClickConfirm={() => {
                        purposeSubjectStore.remove(purpose.id)
                        setRemovePurposeConfirmAction(false)
                    }}
                    onClickCancle={() => setRemovePurposeConfirmAction(false)}
                />
            </Modal>
        </>
    )
}
