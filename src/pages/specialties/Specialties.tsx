import React, { FC, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Button } from '@shared/ui/Button'
import { Plus } from 'lucide-react'
import { CardList } from '@features/cardList/CardList'
import { Modal } from '@features/modal/Modal'
import { SpecialityForm } from '@widgets/specialityForm/SpecialityForm'
import { Speciality } from '@entities/speciality/ui/Specialty'
import { Context } from 'main'

export const Specialties = observer(() => {
    const { specialityStore, authStore } = useContext(Context)
    const [specialtyFormModal, setSpecialtyFormModal] = useState(false)

    return (
        <>
            <div className="space-y-6">
                <div className='flex justify-between align-center'>
                    <h3 className="h3-title">Специальности</h3>
                    {authStore.isAuth &&
                        <Button
                            onClick={() => setSpecialtyFormModal(true)}
                        >
                            <Plus />Новая специальность
                        </Button>
                    }
                </div>
                <CardList>
                    {specialityStore.specialities.map(speciality =>
                        <Speciality
                            key={speciality.id}
                            speciality={speciality}
                        />
                    )}
                </CardList>
            </div>
            <Modal
                isOpen={specialtyFormModal}
                onClose={() => setSpecialtyFormModal(false)}
                title={`Новая специальность`}
            >
                <SpecialityForm
                    closeModal={() => setSpecialtyFormModal(false)}
                />
            </Modal>
        </>
    )
})
