import React, { FC, useContext, useEffect, useState } from 'react'
import { Context } from 'main';
import { IPurposeSubject, ITimeSlot } from '@app/types/types';
import { Modal } from '@features/modal/Modal';
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction';
import { X } from 'lucide-react';
import { observer } from 'mobx-react-lite';

interface PurposeSubjectProps {
    purpose: IPurposeSubject
}

export const PurposeSubject: FC<PurposeSubjectProps> = observer(({ purpose }) => {
    const { academicSubjectStore, subjectStore, teacherStore, classroomStore, timeSlotStore, purposeSubjectStore, authStore } = useContext(Context)
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
                className={`p-2 m-2 rounded-lg text-sm shadow-sm transition-all hover:scale-105 border-2 ${purpose.type === 'full' ? 'border-blue-600' : 'border-green-600'}`}
                onClick={e => e.stopPropagation()}
            >
                <div
                    className="font-medium gap-1"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto 1fr',
                    }}
                >
                    <p className='justify-self-start font-bold whitespace-nowrap'>
                        {purpose.type === 'odd' && 'н/н'}
                        {purpose.type === 'even' && 'ч/н'}
                    </p>
                    <p className='col-auto'>{subject?.name}</p>
                    {authStore.isAuth &&
                        <X
                            onClick={() => setRemovePurposeConfirmAction(true)}
                            className='h-4 w-4 justify-self-end'
                        />
                    }
                </div>
                <div className="text-xs">{`${teacher?.lastname} ${teacher?.firstname[0]}.${teacher?.surname[0]}.`}</div>
                {academicSubject?.numberOfSubgroup === 1 && '(I подгруппа)'}
                {academicSubject?.numberOfSubgroup === 2 && '(II подгруппа)'}
                {classroom && <div className="text-xs">Аудитория {classroom.name}</div>}
                {purpose.isRemotely && <div className="text-xs">(Дистанционно)</div>}
                {timeSlot && <div className="text-xs mt-1 font-medium">
                    {`${String(new Date(timeSlot.startTime).getUTCHours()).padStart(2, '0')}:${String(new Date(timeSlot.startTime).getUTCMinutes()).padStart(2, '0')}
                    –
                    ${String(new Date(timeSlot.endTime).getUTCHours()).padStart(2, '0')}:${String(new Date(timeSlot.endTime).getUTCMinutes()).padStart(2, '0')}`}
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
})
