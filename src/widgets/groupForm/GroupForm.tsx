import React, { FC, useContext, useState } from 'react'
import { IGroup } from '@app/types/types';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { SelectList } from '@features/selectList/SelectList';
import { Context } from 'main';
import { IncorrectSpoiler } from '@features/incorrectSpoiler/IncorrectSpoiler';

interface GroupFormProps {
    group?: IGroup
    closeModal: (flag: boolean) => void
}

export const GroupForm: FC<GroupFormProps> = ({ group = null, closeModal }) => {
    const { groupStore, specialityStore } = useContext(Context)
    const [incorrect, setIncorrect] = useState<boolean>(false)

    const [formData, setFormData] = useState<Omit<IGroup, 'id'>>(group ? {
        name: group.name,
        specialityId: group.specialityId
    } :
    {
        name: '',
        specialityId: 0
    }
);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (group?.id) {
            setFormData({
                name: group.name,
                specialityId: group.specialityId
            });
            groupStore.edit({ id: group.id, ...formData });
        } else {
            if (!formData.specialityId) {
                setIncorrect(true)
                return
            }
            groupStore.add(formData);
        }
        closeModal(false)
    };

    const selectList = createSelectList(specialityStore.specialities)

    function createSelectList(array: Array<any>) {
        const selectList = [] as { id: number; itemLabel: string }[]
        array.map(item => {
            selectList.push({id: item.id, itemLabel: item.name})
        })
        return selectList
    }

    const handleSelectionChange = (selectedItems: { id: number; itemLabel: string }[]) => {
        setFormData({...formData, specialityId: selectedItems[0].id})
      };

    return (
        <form action='' onSubmit={handleSubmit} className="space-y-4">
            <Input
                label='Название группы'
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
            />

            {incorrect && <IncorrectSpoiler>Выберите специальность</IncorrectSpoiler>}
            <SelectList
                label='Специальность'
                items={selectList}
                onSelectionChange={handleSelectionChange}
                defaultListItems={selectList.filter(s => s.id === group?.specialityId)}
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
                        closeModal(false)
                    }}
                >
                    Отменить
                </Button>
            </div>
        </form>
    )
}
