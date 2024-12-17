import React, { useContext, useState } from 'react';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '@shared/ui/Button';
import { Teacher } from '@entities/teacher/ui/Teacher';
import { CardList } from '@features/cardList/CardList';
import { Modal } from '@features/modal/Modal';
import { TeacherForm } from '@widgets/teacherForm/TeacherForm';
import { Context } from 'main';

export const Teachers = observer(() => {
    const { teacherStore, authStore } = useContext(Context)
    const [teacherFormModal, setTeacherFormModal] = useState<boolean>(false)

    return (
        <>
            <div className="space-y-6">
                <div className='flex justify-between align-center'>
                    <h3 className="h3-title">Преподаватели</h3>
                    {authStore.isAuth &&
                        <Button
                            onClick={() => setTeacherFormModal(true)}
                        >
                            <Plus />Новый преподаватель
                        </Button>
                    }
                </div>
                <CardList>
                    {teacherStore.teachers.map(teacher =>
                        <Teacher
                            key={teacher.id}
                            teacher={teacher}
                        />
                    )}
                </CardList>
            </div>
            <Modal
                isOpen={teacherFormModal}
                onClose={() => setTeacherFormModal(false)}
                title={`Новый преподаватель`}
                size='big'
            >
                <TeacherForm
                    closeModal={() => setTeacherFormModal(false)}
                />
            </Modal>
        </>
    );
});
