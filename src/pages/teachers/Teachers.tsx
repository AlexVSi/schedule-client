import { useContext, useState } from 'react';
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
    const [searchTerm, setSearchTerm] = useState<string>("");

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
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Поиск..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <CardList>
                    {teacherStore.teachers.filter(t =>
                        t.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.surname.toLowerCase().includes(searchTerm.toLowerCase())
                    ).map(teacher =>
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
