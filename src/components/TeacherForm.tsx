import React, { useState } from 'react';
import { UserPlus, Pencil, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { scheduleStore } from '@app/stores/ScheduleStore.old';
import { Button } from '@shared/ui/Button';

export const TeacherForm = observer(() => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subjects: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      scheduleStore.updateTeacher(editingId, {
        name: formData.name,
      });
      scheduleStore.updateTeacherSubjects(editingId, formData.subjects);
      setEditingId(null);
    } else {
      scheduleStore.addTeacher({
        name: formData.name,
        subjects: formData.subjects,
      });
    }

    setFormData({
      name: '',
      subjects: [],
    });
  };

  const handleEdit = (teacherId: string) => {
    const teacher = scheduleStore.teachers.find(t => t.id === teacherId);
    if (teacher) {
      setEditingId(teacherId);
      setFormData({
        name: teacher.name,
        subjects: teacher.subjects,
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Имя преподавателя</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Предметы</label>
          <select
            multiple
            value={formData.subjects}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              subjects: Array.from(e.target.selectedOptions, option => option.value)
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
          >
            {scheduleStore.subjects.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" className="flex-1">
            <UserPlus className="w-4 h-4 mr-2" />
            {editingId ? 'Сохранить изменения' : 'Добавить преподавателя'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', subjects: [] });
              }}
            >
              Отменить
            </Button>
          )}
        </div>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Существующие преподаватели</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scheduleStore.teachers.map(teacher => (
            <div
              key={teacher.id}
              className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="font-medium text-gray-900">{teacher.name}</div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(teacher.id)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scheduleStore.removeTeacher(teacher.id)}
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="mt-2">
                <div className="text-sm font-medium text-gray-500">Предметы:</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {/* {teacher.subjects.map(subjectId => {
                    const subject = scheduleStore.subjects.find(s => s.id === subjectId);
                    return subject ? (
                      <div
                        key={subject.id}
                        className="group flex items-center space-x-1 px-2 py-0.5 rounded text-sm"
                        style={{ backgroundColor: subject.color, color: '#fff' }}
                      >
                        <span>{subject.name}</span>
                        <button
                          onClick={() => {
                            scheduleStore.updateTeacherSubjects(
                              teacher.id,
                              teacher.subjects.filter(id => id !== subject.id)
                            );
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : null;
                  })} */}

                  {/* {teachersForSubject.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-gray-500">Предметы:</div>
                      <div className="mt-1 space-y-1">
                        {teachersForSubject.map(teacher => (
                          <div key={teacher.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{teacher.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                scheduleStore.updateTeacherSubjects(
                                  teacher.id,
                                  teacher.subjects.filter(id => id !== subject.id)
                                );
                              }}
                            >
                              <X className="w-3 h-3 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});