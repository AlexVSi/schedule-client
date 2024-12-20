import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@shared/ui/Button';
import { Context } from 'main';

interface LoginFormProps {
    closeModal: (flag: boolean) => void
}

export const LoginForm: React.FC<LoginFormProps> = observer(({ closeModal }) => {
    const { authStore } = useContext(Context)
    const [login, setlogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = authStore.login(login, password);
        if (!success) {
            setError('Неверный login или пароль');
        }
        closeModal(true)
    };

    return (
        <form action='' onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Логин</label>
                <input
                    type="email"
                    value={login}
                    onChange={(e) => setlogin(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Пароль</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
            </div>

            {error && (
                <div className="text-sm text-red-600">{error}</div>
            )}

            <Button type="submit" className="w-full">
                Войти
            </Button>
        </form>
    );
});