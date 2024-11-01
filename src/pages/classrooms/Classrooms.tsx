import React, { useState } from 'react';
import { Building, Pencil, Trash2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { scheduleStore } from '@app/stores/ScheduleStore';
import { Button } from '@shared/ui/Button';

export const Classrooms = observer(() => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    number: '',
    capacity: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      scheduleStore.updateClassroom(editingId, {
        number: formData.number,
        capacity: parseInt(formData.capacity, 10),
      });
      setEditingId(null);
    } else {
      scheduleStore.addClassroom({
        number: formData.number,
        capacity: parseInt(formData.capacity, 10),
      });
    }
    setFormData({ number: '', capacity: '' });
  };

  const handleEdit = (id: string) => {
    const classroom = scheduleStore.classrooms.find(c => c.id === id);
    if (classroom) {
      setEditingId(id);
      setFormData({
        number: classroom.number,
        capacity: classroom.capacity.toString(),
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Номер аудитории</label>
          <input
            type="text"
            value={formData.number}
            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Вместимость</label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex space-x-4">
          <Button type="submit" className="flex-1">
            {editingId ? 'Сохранить изменения' : 'Добавить аудиторию'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setEditingId(null);
                setFormData({ number: '', capacity: '' });
              }}
            >
              Отменить
            </Button>
          )}
        </div>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Существующие аудитории</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scheduleStore.classrooms.map(classroom => (
            <div
              key={classroom.id}
              className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-gray-900">Аудитория {classroom.number}</div>
              <div className="text-sm text-gray-500">
                Вместимость: {classroom.capacity} мест
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(classroom.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scheduleStore.removeClassroom(classroom.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});