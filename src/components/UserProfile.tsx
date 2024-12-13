import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { userStore } from '@app/stores/AuthStore';
import { Button } from '../shared/ui/Button';

export const UserProfile = observer(() => {
  const user = userStore.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    userStore.updateUser(user.id, formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Имя</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">URL аватара</label>
          <input
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <Button type="submit" className="flex-1">
            Сохранить
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setIsEditing(false);
              setFormData({
                name: user.name,
                email: user.email,
                avatar: user.avatar || '',
              });
            }}
          >
            Отменить
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            Роль: {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
          </p>
        </div>
      </div>

      <Button onClick={() => setIsEditing(true)}>
        Редактировать профиль
      </Button>
    </div>
  );
});