import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { format, startOfWeek, addDays, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import { scheduleStore } from '@app/stores/ScheduleStore.old';

export const WeeklySchedule = observer(() => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  const today = new Date();
  const weekStart = startOfWeek(today, { locale: ru });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = 9 + i;
    return `${hour}:00`;
  });

  const events = selectedGroup ? scheduleStore.getGroupEvents(selectedGroup) : [];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Выберите группу</label>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Выберите группу</option>
          {scheduleStore.groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-px bg-gray-200">
            {/* Time column */}
            <div className="bg-gray-50 p-4">
              <div className="font-semibold text-center text-gray-500">Время</div>
            </div>
            
            {/* Day columns */}
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
              </div>
            ))}

            {/* Time slots */}
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-500">{time}</div>
                </div>
                {weekDays.map((day) => {
                  const currentDate = format(day, 'yyyy-MM-dd');
                  const [hour] = time.split(':');
                  const slotEvents = events.filter(event => {
                    const eventDate = format(event.startTime, 'yyyy-MM-dd');
                    const eventHour = format(event.startTime, 'H');
                    return eventDate === currentDate && eventHour === hour;
                  });

                  return (
                    <div key={`${currentDate}-${time}`} className="bg-white p-2 border-t border-gray-200 min-h-[100px]">
                      {slotEvents.map(event => {
                        const subject = scheduleStore.subjects.find(s => s.id === event.subjectId);
                        const teacher = scheduleStore.teachers.find(t => t.id === event.teacherId);
                        const classroom = scheduleStore.classrooms.find(c => c.id === event.classroomId);

                        return (
                          <div
                            key={event.id}
                            className="p-2 rounded-lg text-sm shadow-sm mb-2 transition-all hover:scale-105"
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
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});