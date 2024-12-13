import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@shared/ui/Button';
import { Context } from 'main';

export const UserProfile = observer(() => {
  const { authStore } = useContext(Context)
  const user = authStore.user;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    login: user.login || '',
  });

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={formData.login}
            onChange={(e) => setFormData({ ...formData, login: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
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
                login: user.login
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
        <div>
          <p className="text-gray-500">{user.login}</p>
        </div>
      </div>

      <Button onClick={() => setIsEditing(true)}>
        Редактировать профиль
      </Button>
    </div>
  );
});