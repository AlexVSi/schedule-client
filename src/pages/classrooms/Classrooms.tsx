import React, { useContext, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '@shared/ui/Button';
import { CardList } from '@features/cardList/CardList';
import { Classroom } from '@entities/classroom/ui/Classroom';
import { Modal } from '@features/modal/Modal';
import { ClassroomForm } from '@widgets/classroomForm/ClassroomForm';
import { Context } from 'main';
import { IClassroom } from '@app/types/types';

export const Classrooms = observer(() => {
    const { classroomStore } = useContext(Context)
    const [classroomFormModal, setClassroomFormModal] = useState(false)

    useEffect(() => {
        fetchClassrooms()
    }, [])

    async function fetchClassrooms() {
        await classroomStore.fetchAllClassroomTypes()
        await classroomStore.fetchAllClassrooms()
    }

    return (
        <>
            <div className="space-y-6">
                <div className='flex justify-between align-center'>
                    <h3 className="h3-title">Аудитории</h3>
                    <Button
                        onClick={() => setClassroomFormModal(true)}
                    >
                        <Plus />Новая аудитория
                    </Button>
                </div>
                <CardList>
                    {classroomStore.classrooms.map(classroom =>
                        <Classroom
                            key={classroom.id}
                            classroom={classroom}
                        />
                    )}
                </CardList>
            </div>
            <Modal
                isOpen={classroomFormModal}
                onClose={() => setClassroomFormModal(false)}
                title={`Новая аудитория`}
            >
                <ClassroomForm
                    closeModal={() => setClassroomFormModal(false)}
                />
            </Modal>
        </>
    );
});
