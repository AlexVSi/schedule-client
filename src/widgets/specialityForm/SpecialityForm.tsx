import React, { FC, useContext, useState } from 'react'
import { ISpeciality } from '@app/types/types'
import { Input } from '@shared/ui/Input'
import { Button } from '@shared/ui/Button'
import { Context } from 'main'

interface SpecialityFormProps {
    specialty?: ISpeciality
    closeModal: (flag: boolean) => void
}

export const SpecialityForm: FC<SpecialityFormProps> = ({ specialty, closeModal }) => {
    const { specialityStore } = useContext(Context)
    const [formData, setFormData] = useState<Omit<ISpeciality, 'id'>>( specialty ?
        {
            name: specialty.name
        }
        : {
            name: ''
        }
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (specialty?.id) {
            setFormData({
                name: specialty.name,
            });
            specialityStore.edit({ id: specialty.id, ...formData});
        } else {
            specialityStore.add(formData);
        }
        closeModal(false)
    };

    return (
        <form action='' onSubmit={handleSubmit} className='space-y-4'>
            <Input
                name='specialty'
                label='Специальность'
                value={formData.name}
                type='text'
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
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
                        setFormData({ name: '' });
                        closeModal(false)
                    }}
                >
                    Отменить
                </Button>
            </div>
        </form>
    )
}
