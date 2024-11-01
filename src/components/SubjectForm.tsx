import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { scheduleStore } from '@app/stores/ScheduleStore';

export const SubjectForm = observer(() => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectId = crypto.randomUUID();
    
    // Add subject
    scheduleStore.addSubject({
      name,
      color,
    });

    // Update selected teachers with this subject
    selectedTeachers.forEach(teacherId => {
      const teacher = scheduleStore.teachers.find(t => t.id === teacherId);
      if (teacher) {
        scheduleStore.updateTeacherSubjects(teacherId, [...teacher.subjects, subjectId]);
      }
    });

    setName('');
    setColor('#3b82f6');
    setSelectedTeachers([]);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Название предмета</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Цвет в календаре</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Преподаватели</label>
          <select
            multiple
            value={selectedTeachers}
            onChange={(e) => setSelectedTeachers(Array.from(e.target.selectedOptions, option => option.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
          >
            {scheduleStore.teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Добавить предмет
        </button>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Существующие предметы</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scheduleStore.subjects.map(subject => {
            const teachersForSubject = scheduleStore.teachers.filter(t => 
              t.subjects.includes(subject.id)
            );

            return (
              <div
                key={subject.id}
                className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                style={{ borderLeftColor: subject.color, borderLeftWidth: '4px' }}
              >
                <div className="font-medium text-gray-900">{subject.name}</div>
                {teachersForSubject.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm font-medium text-gray-500">Преподаватели:</div>
                    <div className="mt-1">
                      {teachersForSubject.map(teacher => (
                        <div key={teacher.id} className="text-sm text-gray-600">
                          {teacher.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => scheduleStore.removeSubject(subject.id)}
                  className="mt-3 text-sm text-red-600 hover:text-red-800"
                >
                  Удалить
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});