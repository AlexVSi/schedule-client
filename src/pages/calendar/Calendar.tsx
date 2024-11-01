import React from 'react';
import { observer } from 'mobx-react-lite';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { scheduleStore } from '@app/stores/ScheduleStore';

export const Calendar = observer(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { locale: ru });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
                {weekDays.map((day) => (
                    <div
                        key={day.toString()}
                        className={`bg-white p-4 ${isToday(day) ? 'bg-blue-50' : ''}`}
                    >
                        <div className={`font-semibold text-center ${isToday(day) ? 'text-blue-600' : ''}`}>
                            {format(day, 'EEEE', { locale: ru })}
                        </div>
                        <div className="text-center text-sm text-gray-500">
                            {format(day, 'd MMMM', { locale: ru })}
                        </div>
                        <div className="mt-2 space-y-2">
                            {scheduleStore.scheduleEvents
                                .filter(event =>
                                    format(event.startTime, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                                )
                                .map(event => {
                                    const subject = scheduleStore.subjects.find(s => s.id === event.subjectId);
                                    const teacher = scheduleStore.teachers.find(t => t.id === event.teacherId);
                                    const classroom = scheduleStore.classrooms.find(c => c.id === event.classroomId);

                                    return (
                                        <div
                                            key={event.id}
                                            className="p-2 rounded-lg text-sm shadow-sm transition-transform hover:scale-102"
                                            style={{
                                                backgroundColor: subject?.color,
                                                color: '#fff',
                                                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                            }}
                                        >
                                            <div className="font-medium">{subject?.name}</div>
                                            <div className="text-xs opacity-90">{teacher?.name}</div>
                                            <div className="text-xs opacity-90">Ауд. {classroom?.number}</div>
                                            <div className="text-xs mt-1 font-medium">
                                                {format(event.startTime, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});