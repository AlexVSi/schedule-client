import React, { useState } from 'react';
import { BookOpen, Pencil, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { scheduleStore } from '@app/stores/ScheduleStore.old';
import { Button } from '@shared/ui/Button';

export const SubjectForm = observer(() => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#3b82f6',
    teacherIds: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      scheduleStore.updateSubject(editingId, {
        name: formData.name,
        color: formData.color,
      });

      // Update teacher assignments
      scheduleStore.teachers.forEach(teacher => {
        const hasSubject = teacher.subjects.includes(editingId);
        const shouldHaveSubject = formData.teacherIds.includes(teacher.id);

        if (hasSubject && !shouldHaveSubject) {
          // Remove subject from teacher
          scheduleStore.updateTeacherSubjects(
            teacher.id,
            teacher.subjects.filter(id => id !== editingId)
          );
        } else if (!hasSubject && shouldHaveSubject) {
          // Add subject to teacher
          scheduleStore.updateTeacherSubjects(
            teacher.id,
            [...teacher.subjects, editingId]
          );
        }
      });

      setEditingId(null);
    } else {
      const subjectId = crypto.randomUUID();
      scheduleStore.addSubject({
        name: formData.name,
        color: formData.color,
        teachers: []
      });

      // Assign subject to selected teachers
      formData.teacherIds.forEach(teacherId => {
        const teacher = scheduleStore.teachers.find(t => t.id === teacherId);
        if (teacher) {
          scheduleStore.updateTeacherSubjects(teacherId, [...teacher.subjects, subjectId]);
        }
      });
    }

    resetForm();
  };

  const handleEdit = (subjectId: string) => {
    const subject = scheduleStore.subjects.find(s => s.id === subjectId);
    if (!subject) return;

    const teacherIds = scheduleStore.teachers
      .filter(teacher => teacher.subjects.includes(subjectId))
      .map(teacher => teacher.id);

    setEditingId(subjectId);
    setFormData({
      name: subject.name,
      color: subject.color,
      teacherIds,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      color: '#3b82f6',
      teacherIds: [],
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Название предмета</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Цвет в календаре</label>
          <div className="flex items-center space-x-2 mt-1">
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="h-10 w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <div 
              className="h-10 flex-1 rounded-md"
              style={{ backgroundColor: formData.color }}
            />
          </div>
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
          >
            {scheduleStore.teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <Button type="submit" className="flex-1">
            <BookOpen className="w-4 h-4 mr-2" />
            {editingId ? 'Сохранить изменения' : 'Добавить предмет'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={resetForm}
            >
              Отменить
            </Button>
          )}
        </div>
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
                <div className="flex justify-between items-start mb-3">
                  <div className="font-medium text-gray-900">{subject.name}</div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(subject.id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => scheduleStore.removeSubject(subject.id)}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                {teachersForSubject.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm font-medium text-gray-500">Преподаватели:</div>
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
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});