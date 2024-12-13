import React, { FC, useContext, useEffect, useState } from 'react'
import { Context } from 'main';
import { format } from 'date-fns';
import { IPurposeSubject, ITimeSlot } from '@app/types/types';

interface SlotPurposeProps {
    purpose: IPurposeSubject
}

export const SlotPurpose: FC<SlotPurposeProps> = ({ purpose }) => {
    const { academicSubjectStore, subjectStore, teacherStore, classroomStore, timeSlotStore } = useContext(Context)
    const [timeSlot, setTimeSlot] = useState<ITimeSlot>()

    useEffect(() => {
        fetchTimeSlot()
    }, [])

    async function fetchTimeSlot() {
        const response = await timeSlotStore.fetchTimeSlot(purpose.timeSlotId)
        if (response) {
            setTimeSlot(response)
        }
    }

    const academicSubject = academicSubjectStore.groupAcademicSubjects.find(a => a.id === purpose.subjectId);
    const subject = academicSubject ? subjectStore.subjects.find(s => s.id === academicSubject?.name) : null;
    const teacher = teacherStore.teachers.find(t => t.id === academicSubject?.teacherId);
    const classroom = classroomStore.classrooms.find(c => c.id === purpose.classroomId);
    return (
        <div
            className="p-2 rounded-lg text-sm shadow-sm mb-2 transition-all hover:scale-105"
            style={{
                backgroundColor: subject?.color,
                color: '#3b82f6',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
        >
            <div className="font-medium">{subject?.name}</div>
            <div className="text-xs opacity-90">{teacher?.lastname}</div>
            <div className="text-xs opacity-90">Ауд. {classroom?.name}</div>
            {timeSlot && <div className="text-xs mt-1 font-medium">
                {format(timeSlot?.startTime, 'HH:mm')} - {format(timeSlot?.endTime, 'HH:mm')}
            </div>}
        </div>
    )
}
