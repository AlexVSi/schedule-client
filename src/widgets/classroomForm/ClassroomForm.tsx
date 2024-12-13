import React, { FC, useContext, useState } from 'react'
import { IClassroom } from '@app/types/types';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Context } from 'main';
import { IncorrectSpoiler } from '@features/incorrectSpoiler/IncorrectSpoiler';
import { SelectList } from '@features/selectList/SelectList';

interface ClassroomFormProps {
    classroom?: IClassroom
    closeModal: (flag: boolean) => void
}

export const ClassroomForm: FC<ClassroomFormProps> = ({ classroom, closeModal }) => {
    const { classroomStore } = useContext(Context)
    const [incorrect, setIncorrect] = useState<boolean>(false)
    const [formData, setFormData] = useState<Omit<IClassroom, 'id'>>(classroom ?
        {
            name: classroom.name,
            capacity: classroom.capacity,
            type: classroom.type
        } :
        {
            name: '',
            capacity: 1,
            type: 0
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (classroom?.id) {
            setFormData({
                name: classroom.name,
                capacity: classroom.capacity,
                type: classroom.type
            });
            classroomStore.edit({ id: classroom.id, ...formData });
        } else {
            if (!formData.type) {
                setIncorrect(true)
                return
            }
            classroomStore.add(formData);
        }
        closeModal(false)
    };

    const selectList = createSelectList(classroomStore.classroomTypes)

    function createSelectList(array: Array<any>) {
        const selectList = [] as { id: number; itemLabel: string }[]
        array.map(item => {
            selectList.push({ id: item.id, itemLabel: item.name })
        })
        return selectList
    }

    const handleSelectionChange = (selectedItems: { id: number; itemLabel: string }[]) => {
        setFormData({...formData, type: selectedItems[0].id})
      };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label='Номер аудитории'
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
            />
            <Input
                label='Вместимость'
                type="number"
                name="capacity"
                value={formData.capacity}
                min={1}
                onChange={(e) => setFormData({ ...formData, capacity: +e.target.value })}
                required
            />

            {incorrect && <IncorrectSpoiler>Выберите тип аудитории</IncorrectSpoiler>}
            <SelectList
                label='Тип аудитории'
                items={selectList}
                onSelectionChange={handleSelectionChange}
                defaultListItems={selectList.filter(t => t.id === classroom?.type)}
            >

            </SelectList>
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
                        setFormData({ name: '', capacity: 0, type: 0 });
                        closeModal(false)
                    }}
                >
                    Отменить
                </Button>
            </div>
        </form>
    )
}
