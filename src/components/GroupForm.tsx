import React, { useState } from 'react';
import { Users, Pencil, Trash2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { scheduleStore } from '@app/stores/ScheduleStore';
import { Button } from '../shared/ui/Button';

export const GroupForm = observer(() => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    studentsCount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      scheduleStore.updateGroup(editingId, {
        name: formData.name,
        studentsCount: parseInt(formData.studentsCount, 10),
      });
      setEditingId(null);
    } else {
      scheduleStore.addGroup({
        name: formData.name,
        studentsCount: parseInt(formData.studentsCount, 10),
      });
    }
    setFormData({ name: '', studentsCount: '' });
  };

  const handleEdit = (id: string) => {
    const group = scheduleStore.groups.find(g => g.id === id);
    if (group) {
      setEditingId(id);
      setFormData({
        name: group.name,
        studentsCount: group.studentsCount.toString(),
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Название группы</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Количество студентов</label>
          <input
            type="number"
            value={formData.studentsCount}
            onChange={(e) => setFormData({ ...formData, studentsCount: e.target.value })}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex space-x-4">
          <Button type="submit" className="flex-1">
            {editingId ? 'Сохранить изменения' : 'Добавить группу'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', studentsCount: '' });
              }}
            >
              Отменить
            </Button>
          )}
        </div>
      </form>

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Существующие группы</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {scheduleStore.groups.map(group => (
            <div
              key={group.id}
              className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-gray-900">{group.name}</div>
              <div className="text-sm text-gray-500">
                {group.studentsCount} студентов
              </div>
              <div className="mt-4 flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(group.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scheduleStore.removeGroup(group.id)}
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