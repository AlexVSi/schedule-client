import React, { FC, useContext, useEffect, useState } from 'react';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { ISubject } from '@app/types/types';
import { Context } from 'main';

interface SubjectFormProps {
    subject?: ISubject
    closeModal: (flag: boolean) => void
}

export const SubjectForm: FC<SubjectFormProps> = ({ subject = null, closeModal }) => {
    const { subjectStore } = useContext(Context)

    const [formData, setFormData] = useState<Omit<ISubject, 'id'>>(subject ? {
        name: subject.name,
        color: subject.color,
        teachers: subject.teachers,
    } :
    {
        name: '',
        color: '#3b82f6',
        teachers: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (subject?.id) {
            setFormData({
                name: subject.name,
                color: '#3b82f6',
                teachers: subject.teachers,
            });
            subjectStore.edit({ id: subject?.id, ...formData });
        } else {
            subjectStore.add(formData);
        }
        closeModal(false)
    };

    return (
        <form action='' onSubmit={handleSubmit} className="space-y-4">
            <Input
                label='Название предмета'
                name='subject'
                type='text'
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <div className="flex space-x-4">
                <Button
                    type="submit"
                    className="flex-1"
                >
                    Сохранить
                </Button>
                <Button
                    type="reset"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                        closeModal(false)
                    }}
                >
                    Отменить
                </Button>
            </div>
        </form>
    );
}
