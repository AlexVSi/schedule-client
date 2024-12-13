import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { format, startOfWeek, addDays, isToday, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import type { IAcademicSubject, IClassroom, IPurposeSubject } from '@app/types/types';
import { Context } from 'main';

export const PlannerOld = observer(() => {
  const { groupStore, academicSubjectStore, purposeSubjectStore, scheduleStore, subjectStore, teacherStore, classroomStore, timeSlotStore } = useContext(Context)
  const [academicSubjects, setAcademicSubjects] = useState<IAcademicSubject[]>([])
  const [groupPurposes, setGroupPurposes] = useState<IPurposeSubject[]>([])
  const [academicSubjectClassrooms, setAcademicSubjectClassrooms] = useState<IClassroom[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date;
    time: string;
  } | null>(null);

  useEffect(() => {
    groupStore.fetchAllGroups()
    classroomStore.fetchAllClassrooms()
    subjectStore.fetchAllsubjects()
    teacherStore.fetchAllTeachers()
  }, [])

  useEffect(() => {
    fetchAcademicSubjects()
    fetchGroupPurpose()
  }, [selectedGroup])

  async function fetchAcademicSubjects() {
    if (selectedGroup) {
      await academicSubjectStore.fetchAllByGroupAndSchedule(+selectedGroup, scheduleStore.currentScheduleId)
      setAcademicSubjects(academicSubjectStore.groupAcademicSubjects)
    }
  }

  const [selectedPurpose, setSelectedPurpose] = useState<number>(0);
  const [selectedAcademicSubject, setSelectedAcademicSubject] = useState<IAcademicSubject['id']>(0)
  const [selectedTeacher, setSelectedTeacher] = useState<number>(0);
  const [selectedClassroom, setSelectedClassroom] = useState<number>(0);

  useEffect(() => {
    fetchAcademicSubjectClassrooms()
    console.log(academicSubjectClassrooms)
  }, [selectedAcademicSubject])

  async function fetchAcademicSubjectClassrooms() {
    if (selectedAcademicSubject) {
      const response = await classroomStore.fetchByAcademicSubject(selectedAcademicSubject)
      if (response) {
        setAcademicSubjectClassrooms(response)
      }
    }
  }

  const today = new Date();
  const weekStart = startOfWeek(today, { locale: ru });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 8 }, (_, i) => {
    const hour = 9 + i;
    return `${hour}:00`;
  });

  // const selectedPurposeData = groupPurposes.find(p => p.id === selectedPurpose);
  const selectedAcademicSubjectsData = academicSubjects.find(p => p.id === selectedAcademicSubject);

  const handleSlotClick = (date: Date, time: string) => {
    if (!selectedGroup) {
      alert('Пожалуйста, выберите группу');
      return;
    }
    setSelectedSlot({ date, time });
    setSelectedAcademicSubject(0);
    setSelectedTeacher(0);
    setSelectedClassroom(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedGroup || !selectedPurpose || !selectedTeacher || !selectedClassroom) return;

    const startTime = parse(selectedSlot.time, 'H:mm', selectedSlot.date);
    const endTime = new Date(startTime.getTime() + 90 * 60000); // 90 minutes by default

    try {
      purposeSubjectStore.add({
        type: 0,
        isRemotely: false,
        subjectId: selectedAcademicSubject,
        classroomId: selectedClassroom,
        timeSlotId: 1,
      });

      setSelectedSlot(null);
      setSelectedAcademicSubject(0);
      setSelectedTeacher(0);
      setSelectedClassroom(0);
    } catch (error) {
      alert(error);
    }
  };

  async function fetchGroupPurpose() {
    const purposes: IPurposeSubject[] = []
    for (let i of academicSubjects) {
      const purpose = await purposeSubjectStore.fetchAllPurposeSubjects(i.id)
      if (purpose) {
        for (let j of purpose)
        purposes.push(j)
      }
    }
    setGroupPurposes(purposes)
  }

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
          {groupStore.groups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {selectedGroup && academicSubjects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Назначенные предметы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicSubjects.map(academicSubject => {
              const subject = subjectStore.subjects.find(s => s.id === academicSubject.name);
              return (
                <div
                  key={academicSubject.id}
                  className={`bg-white rounded-lg shadow p-4 border-l-4 cursor-pointer transition-all ${selectedAcademicSubject === academicSubject.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                    }`}
                  style={{ borderLeftColor: subject?.color }}
                  onClick={() => setSelectedAcademicSubject(academicSubject.id)}
                >
                  <h4 className="font-medium text-gray-900">{subject?.name}</h4>
                  <div className="text-sm text-gray-600 mt-1">
                    Часов в неделю: {academicSubject.countHoursPerWeek}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Преподаватель: {academicSubject.teacherId}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {/* Аудитории: {academicSubjectClassrooms[0]} */}
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
                  const slotPurpose = groupPurposes.filter(purpose => {
                    const timeSlot = timeSlotStore.timeSlots.find(t => t.id === purpose.timeSlotId)
                    const eventDate = format(timeSlot!.startTime, 'yyyy-MM-dd');
                    const eventHour = format(timeSlot!.startTime, 'H');
                    return eventDate === currentDate && eventHour === hour;
                  });

                  return (
                    <div
                      key={`${currentDate}-${time}`}
                      className={`bg-white p-2 border-t border-gray-200 min-h-[100px] cursor-pointer hover:bg-blue-50 transition-colors
                        ${selectedSlot && format(selectedSlot.date, 'yyyy-MM-dd') === currentDate && selectedSlot.time === time ? 'bg-blue-100' : ''}`}
                      onClick={() => handleSlotClick(day, time)}
                    >
                      {slotPurpose.map(purpose => {
                        const timeSlot = timeSlotStore.timeSlots.find(t => t.id === purpose.timeSlotId)
                        const academicSubject = academicSubjectStore.groupAcademicSubjects.find(a => a.id === purpose.subjectId);
                        const subject = academicSubject ? subjectStore.subjects.find(s => s.id === academicSubject?.name) : null;
                        const teacher = teacherStore.teachers.find(t => t.id === academicSubject?.teacherId);
                        const classroom = classroomStore.classrooms.find(c => c.id === purpose.classroomId);

                        return (
                          <div
                            key={purpose.id}
                            className="p-2 rounded-lg text-sm shadow-sm mb-2 transition-all hover:scale-105"
                            style={{
                              backgroundColor: subject?.color,
                              color: '#fff',
                              textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                            }}
                            onClick={e => e.stopPropagation()}
                          >
                            <div className="font-medium">{subject?.name}</div>
                            <div className="text-xs opacity-90">{teacher?.lastname}</div>
                            <div className="text-xs opacity-90">Ауд. {classroom?.name}</div>
                            <div className="text-xs mt-1 font-medium">
                              {format(timeSlot!.startTime, 'HH:mm')} - {format(timeSlot!.endTime, 'HH:mm')}
                            </div>
                          </div>
                        );
                      })}
                      {!slotPurpose.length && selectedGroup && (
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
                  value={selectedPurpose}
                  onChange={(e) => {
                    setSelectedAcademicSubject(+e.target.value);
                    setSelectedTeacher(0);
                    setSelectedClassroom(0);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Выберите предмет</option>
                  {academicSubjects.map(academicSubject => {
                    const subject = subjectStore.subjects.find(s => s.id === academicSubject.name);
                    return (
                      <option key={academicSubject.id} value={academicSubject.id}>
                        {subject?.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedAcademicSubjectsData && (
                <>
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">Преподаватель: {selectedAcademicSubjectsData.teacherId}</label>
                    <select
                      value={selectedTeacher}
                      onChange={(e) => setSelectedTeacher(+e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Выберите преподавателя</option>
                      {selectedAcademicSubjectsData.teacherId.map(teacherId => {
                        const teacher = teacherStore.teachers.find(t => t.id === teacherId);
                        return teacher ? (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.lastname}
                          </option>
                        ) : null;
                      })}
                    </select>
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Аудитория</label>
                    <select
                      value={selectedClassroom}
                      onChange={(e) => setSelectedClassroom(+e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Выберите аудиторию</option>
                      {academicSubjectClassrooms.map(classrooms => {
                      const classroom = classroomStore.classrooms.find(c => c.id === classrooms.id);
                      return classroom ? (
                        <option key={classroom.id} value={classroom.id}>
                          {classroom.name} (вместимость: {classroom.capacity})
                        </option>
                      ) : null;
                      })}

                      {academicSubjectClassrooms.map(c => {
                        return <option key={c.id} value={c.id}>
                                  {c.name} (вместимость: {c.capacity})
                                </option>
                      })}

                    </select>
                  </div>
                </>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={!selectedPurpose || !selectedTeacher || !selectedClassroom}
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