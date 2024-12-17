import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from 'main';
import { Button } from '@shared/ui/Button';
import { Group } from '@entities/group/ui/Group';
import { CardList } from '@features/cardList/CardList';
import { Plus } from 'lucide-react';
import { GroupForm } from '@widgets/groupForm/GroupForm';
import { Modal } from '@features/modal/Modal';

export const Groups = observer(() => {
    const { groupStore, authStore } = useContext(Context)
    const [groupFormModal, setGroupFormModal] = useState<boolean>(false)

    return (
        <>
            <div className="space-y-6">
                <div className='flex justify-between align-center'>
                    <h3 className="h3-title">Группы</h3>
                    {authStore.isAuth &&
                        <Button
                            onClick={() => setGroupFormModal(true)}
                        >
                            <Plus />Новая группа
                        </Button>
                    }
                </div>
                <CardList>
                    {groupStore.groups.map(group =>
                        <Group
                            key={group.id}
                            group={group}
                        />
                    )}
                </CardList>
            </div>
            <Modal
                isOpen={groupFormModal}
                onClose={() => setGroupFormModal(false)}
                title='Новая группа'
            >
                <GroupForm
                    closeModal={() => setGroupFormModal(false)}
                />
            </Modal>
        </>
    );
});
