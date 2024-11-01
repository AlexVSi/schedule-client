import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { format, startOfWeek, addDays, isToday, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Plus, X } from 'lucide-react';
import { scheduleStore } from '@app/stores/ScheduleStore';
import type { CourseAssignment } from '@app/types/types';

export const Planner = observer(() => {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    time: string;
  } | null>(null);
  
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>('');

  const today = new Date();
  const weekStart = startOfWeek(today, { locale: ru });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = 9 + i;
    return `${hour}:00`;
  });

  const assignments = selectedGroup ? scheduleStore.getGroupAssignments(selectedGroup) : [];
  const selectedAssignmentData = assignments.find(a => a.id === selectedAssignment);

  const handleSlotClick = (date: Date, time: string) => {
    if (!selectedGroup) {
      alert('Пожалуйста, выберите группу');
      return;
    }
    setSelectedSlot({ date, time });
    setSelectedAssignment('');
    setSelectedTeacher('');
    setSelectedClassroom('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedGroup || !selectedAssignment || !selectedTeacher || !selectedClassroom) return;

    const startTime = parse(selectedSlot.time, 'H:mm', selectedSlot.date);
    const endTime = new Date(startTime.getTime() + 90 * 60000); // 90 minutes by default

    try {
      scheduleStore.addScheduleEvent({
        subjectId: selectedGroup,
        groupId: selectedGroup,
        assignmentId: selectedAssignment,
        teacherId: selectedTeacher,
        classroomId: selectedClassroom,
        startTime,
        endTime,
      });

      setSelectedSlot(null);
      setSelectedAssignment('');
      setSelectedTeacher('');
      setSelectedClassroom('');
    } catch (error) {
      alert(error);
    }
  };

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

      {selectedGroup && assignments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Назначенные предметы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map(assignment => {
              const subject = scheduleStore.subjects.find(s => s.id === assignment.subjectId);
              return (
                <div
                  key={assignment.id}
                  className={`bg-white rounded-lg shadow p-4 border-l-4 cursor-pointer transition-all ${
                    selectedAssignment === assignment.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                  }`}
                  style={{ borderLeftColor: subject?.color }}
                  onClick={() => setSelectedAssignment(assignment.id)}
                >
                  <h4 className="font-medium text-gray-900">{subject?.name}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    Часов в неделю: {assignment.hoursPerWeek}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-8 gap-px bg-gray-200">
            <div className="bg-gray-50 p-4">
              <div className="font-semibold text-center text-gray-500">Время</div>
            </div>
            
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
                    <div 
                      key={`${currentDate}-${time}`} 
                      className={`bg-white p-2 border-t border-gray-200 min-h-[100px] cursor-pointer hover:bg-blue-50 transition-colors
                        ${selectedSlot && format(selectedSlot.date, 'yyyy-MM-dd') === currentDate && selectedSlot.time === time ? 'bg-blue-100' : ''}`}
                      onClick={() => handleSlotClick(day, time)}
                    >
                      {slotEvents.map(event => {
                        const assignment = scheduleStore.courseAssignments.find(a => a.id === event.assignmentId);
                        const subject = assignment ? scheduleStore.subjects.find(s => s.id === assignment.subjectId) : null;
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
                            onClick={e => e.stopPropagation()}
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
                      {!slotEvents.length && selectedGroup && (
                        <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                          <Plus className="w-6 h-6 text-blue-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Добавить занятие на {format(selectedSlot.date, 'd MMMM', { locale: ru })} в {selectedSlot.time}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Предмет</label>
                <select
                  value={selectedAssignment}
                  onChange={(e) => {
                    setSelectedAssignment(e.target.value);
                    setSelectedTeacher('');
                    setSelectedClassroom('');
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите предмет</option>
                  {assignments.map(assignment => {
                    const subject = scheduleStore.subjects.find(s => s.id === assignment.subjectId);
                    return (
                      <option key={assignment.id} value={assignment.id}>
                        {subject?.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedAssignmentData && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Преподаватель</label>
                    <select
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Выберите преподавателя</option>
                      {selectedAssignmentData.teacherIds.map(teacherId => {
                        const teacher = scheduleStore.teachers.find(t => t.id === teacherId);
                        return teacher ? (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Аудитория</label>
                    <select
                      value={selectedClassroom}
                      onChange={(e) => setSelectedClassroom(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Выберите аудиторию</option>
                      {selectedAssignmentData.classroomIds.map(classroomId => {
                        const classroom = scheduleStore.classrooms.find(c => c.id === classroomId);
                        return classroom ? (
                          <option key={classroom.id} value={classroom.id}>
                            {classroom.number} (вместимость: {classroom.capacity})
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div>
                </>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!selectedAssignment || !selectedTeacher || !selectedClassroom}
                >
                  Добавить
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSlot(null)}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});