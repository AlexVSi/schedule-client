import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { scheduleStore } from '@app/stores/ScheduleStore';

export const CourseAssignments = observer(() => {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [formData, setFormData] = useState({
    subjectId: '',
    teacherIds: [] as string[],
    classroomIds: [] as string[],
    hoursPerWeek: 2,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    scheduleStore.addCourseAssignment({
      groupId: selectedGroup,
      ...formData,
    });

    setFormData({
      subjectId: '',
      teacherIds: [],
      classroomIds: [],
      hoursPerWeek: 2,
    });
  };

  const assignments = selectedGroup ? scheduleStore.getGroupAssignments(selectedGroup) : [];

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

      {selectedGroup && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">Предмет</label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData(prev => ({ ...prev, subjectId: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Выберите предмет</option>
              {scheduleStore.subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Преподаватели</label>
            <select
              multiple
              value={formData.teacherIds}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                teacherIds: Array.from(e.target.selectedOptions, option => option.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {scheduleStore.teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Аудитории</label>
            <select
              multiple
              value={formData.classroomIds}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                classroomIds: Array.from(e.target.selectedOptions, option => option.value)
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              {scheduleStore.classrooms.map(classroom => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.number} (вместимость: {classroom.capacity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Часов в неделю</label>
            <input
              type="number"
              value={formData.hoursPerWeek}
              onChange={(e) => setFormData(prev => ({ ...prev, hoursPerWeek: parseInt(e.target.value, 10) }))}
              min="1"
              max="20"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить назначение
          </button>
        </form>
      )}

      {assignments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Назначенные предметы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignments.map(assignment => {
              const subject = scheduleStore.subjects.find(s => s.id === assignment.subjectId);
              const teachers = assignment.teacherIds.map(id => 
                scheduleStore.teachers.find(t => t.id === id)
              ).filter(Boolean);
              const classrooms = assignment.classroomIds.map(id =>
                scheduleStore.classrooms.find(c => c.id === id)
              ).filter(Boolean);

              return (
                <div
                  key={assignment.id}
                  className="bg-white rounded-lg shadow p-4 border border-gray-200"
                  style={{ borderLeftColor: subject?.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-900">{subject?.name}</h4>
                    <button
                      onClick={() => scheduleStore.removeCourseAssignment(assignment.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <div>Часов в неделю: {assignment.hoursPerWeek}</div>
                    <div className="mt-1">
                      Преподаватели:
                      <ul className="ml-4 list-disc">
                        {teachers.map(teacher => (
                          <li key={teacher?.id}>{teacher?.name}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-1">
                      Аудитории:
                      <ul className="ml-4 list-disc">
                        {classrooms.map(classroom => (
                          <li key={classroom?.id}>
                            {classroom?.number} (мест: {classroom?.capacity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});