import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { scheduleStore } from '@app/stores/ScheduleStore';

export const Teachers = observer(() => {
  const [name, setName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleStore.addTeacher({
      name,
      subjects: selectedSubjects,
    });
    setName('');
    setSelectedSubjects([]);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Имя преподавателя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Предметы</label>
          <select
            multiple
            value={selectedSubjects}
            onChange={(e) => setSelectedSubjects(Array.from(e.target.selectedOptions, option => option.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
            // required
          >
            {scheduleStore.subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Добавить преподавателя
        </button>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Существующие преподаватели</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scheduleStore.teachers.map(teacher => (
            <div
              key={teacher.id}
              className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-gray-900">{teacher.name}</div>
              <div className="mt-2">
                <div className="text-sm font-medium text-gray-500">Предметы:</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {teacher.subjects.map(subjectId => {
                    const subject = scheduleStore.subjects.find(s => s.id === subjectId);
                    return subject ? (
                      <span
                        key={subject.id}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: subject.color, color: '#fff' }}
                      >
                        {subject.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <button
                onClick={() => scheduleStore.removeTeacher(teacher.id)}
                className="mt-3 text-sm text-red-600 hover:text-red-800"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});