import { useContext, useState } from 'react';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '@shared/ui/Button';
import { CardList } from '@features/cardList/CardList';
import { Classroom } from '@entities/classroom/ui/Classroom';
import { Modal } from '@features/modal/Modal';
import { ClassroomForm } from '@widgets/classroomForm/ClassroomForm';
import { Context } from 'main';

export const Classrooms = observer(() => {
    const { classroomStore, authStore } = useContext(Context)
    const [classroomFormModal, setClassroomFormModal] = useState<boolean>(false)

    return (
        <>
            <div className="space-y-6">
                <div className='flex justify-between align-center'>
                    <h3 className="h3-title">Аудитории</h3>
                    {authStore.isAuth &&
                        <Button
                            onClick={() => setClassroomFormModal(true)}
                        >
                            <Plus />Новая аудитория
                        </Button>
                    }
                </div>
                <CardList>
                    {classroomStore.classrooms.slice()
                    .sort((a, b) => {
                        if (+a.name && +b.name) {
                            return +a.name - +b.name
                        }
                        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
                    })
                    .map(classroom =>
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
