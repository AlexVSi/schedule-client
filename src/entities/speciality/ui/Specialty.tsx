import React, { FC, useContext, useState } from 'react'
import { Card } from '@features/card/Card'
import { Modal } from '@features/modal/Modal'
import { ISpeciality } from '@app/types/types'
import { SpecialityForm } from '@widgets/specialityForm/SpecialityForm'
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction'
import { Context } from 'main'

interface SpecialityProps {
    speciality: ISpeciality
}

export const Speciality: FC<SpecialityProps> = ({speciality}) => {
    const { specialityStore } = useContext(Context)
    const [specialityFormModal, setSpecialityFormModal] = useState(false)
    const [specialityConfirmAction, setSpecialityConfirmAction] = useState(false)

    return (
        <>
            <Card
                title={speciality.name}
                onClickEdit={() => setSpecialityFormModal(true)}
                onClickDelete={() => setSpecialityConfirmAction(true)}
            >
            </Card>
            <Modal
                isOpen={specialityFormModal}
                onClose={() => setSpecialityFormModal(false)}
                title={`Специальность ${speciality.name}`}
            >
                <SpecialityForm
                    specialty={speciality}
                    closeModal={setSpecialityFormModal}
                />
            </Modal>
            <Modal
                isOpen={specialityConfirmAction}
                onClose={() => setSpecialityConfirmAction(false)}
                title='Подтвердить удаление'
            >
                <ConfirmAction
                    onClickConfirm={() => {
                        specialityStore.remove(speciality.id)
                        setSpecialityConfirmAction(false)
                    }}
                    onClickCancle={() => setSpecialityConfirmAction(false)}
                />
            </Modal>
        </>
    )
}
