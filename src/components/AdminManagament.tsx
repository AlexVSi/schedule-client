import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from '@app/stores/UserStore';
import { Button } from '../shared/ui/Button';
import { Pencil, Trash2, UserPlus } from 'lucide-react';

export const AdminManagement = observer(() => {
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userStore.addUser({
      ...newAdmin,
      role: 'admin',
    });
    setNewAdmin({ name: '', email: '', password: '' });
  };

  const handleEdit = (id: string) => {
    const admin = userStore.users.find(u => u.id === id);
    if (admin) {
      setEditingId(id);
      setNewAdmin({
        name: admin.name,
        email: admin.email,
        password: '',
      });
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      userStore.updateUser(editingId, {
        name: newAdmin.name,
        email: newAdmin.email,
      });
      setEditingId(null);
      setNewAdmin({ name: '', email: '', password: '' });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={editingId ? handleUpdate : handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Имя</label>
          <input
            type="text"
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {!editingId && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Пароль</label>
            <input
              type="password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <Button type="submit" className="w-full">
          {editingId ? 'Сохранить изменения' : 'Добавить администратора'}
        </Button>

        {editingId && (
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => {
              setEditingId(null);
              setNewAdmin({ name: '', email: '', password: '' });
            }}
          >
            Отменить
          </Button>
        )}
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Список администраторов</h3>
        <div className="space-y-2">
          {userStore.users.filter(u => u.role === 'admin').map(admin => (
            <div
              key={admin.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div>
                <div className="font-medium">{admin.name}</div>
                <div className="text-sm text-gray-500">{admin.email}</div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(admin.id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => userStore.removeUser(admin.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )})