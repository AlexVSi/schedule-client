import React, { FC, useContext, useState } from 'react'
import { Modal } from '@features/modal/Modal';
import { GroupForm } from '@widgets/groupForm/GroupForm';
import { IGroup } from '@app/types/types';
import { Card } from '@features/card/Card';
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction';
import { Context } from 'main';
import { observer } from 'mobx-react-lite';

interface GroupProps {
    group: IGroup
}

export const Group: FC<GroupProps> = observer(({ group }) => {
    const { groupStore, specialityStore } = useContext(Context)
    const [groupFormModal, setGroupFormModal] = useState<boolean>(false)
    const [groupConfirmAction, setGroupConfirmAction] = useState<boolean>(false)

    return (
        <>
            <Card
                title={group.name}
                subTitle={`Специальность ${specialityStore.specialities.find(speciality => speciality.id === group.specialityId)?.name}`}
                onClickEdit={() => setGroupFormModal(true)}
                onClickDelete={() => setGroupConfirmAction(true)}
            >
            </Card>
            <Modal
                isOpen={groupFormModal}
                onClose={() => setGroupFormModal(false)}
                title={`Группа ${group.name}`}
            >
                <GroupForm
                    group={group}
                    closeModal={() => setGroupFormModal(false)}
                />
            </Modal>
            <Modal
                isOpen={groupConfirmAction}
                onClose={() => setGroupConfirmAction(false)}
                title='Подтвердить удаление'
            >
                <ConfirmAction
                    onClickConfirm={() => {
                        groupStore.remove(group.id)
                        setGroupConfirmAction(false)
                    }}
                    onClickCancle={() => setGroupConfirmAction(false)}
                />
            </Modal>
        </>
    )
})
