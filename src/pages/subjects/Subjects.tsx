import { useContext, useState } from 'react';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '@shared/ui/Button';
import { CardList } from '@features/cardList/CardList';
import { Subject } from '@entities/subject/ui/Subject';
import { Modal } from '@features/modal/Modal';
import { SubjectForm } from '@widgets/subjectForm/SubjectForm';
import { Context } from 'main';

export const Subjects = observer(() => {
    const { subjectStore, authStore } = useContext(Context)
    const [subjectFormModal, setSubjectFormModal] = useState<boolean>(false)
    const [searchTerm, setSearchTerm] = useState<string>("");

    return (
        <>
            <div className="space-y-6">
                <div className='flex justify-between align-center'>
                    <h3 className="h3-title">Предметы</h3>
                    {authStore.isAuth &&
                        <Button
                            onClick={() => setSubjectFormModal(true)}
                        >
                            <Plus />Новый предмет
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
                    {subjectStore.subjects.filter(s => 
                        s.name.toLowerCase().includes(searchTerm.toLowerCase())
                    ).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
                    .map(subject => {
                        return (
                            <Subject
                                key={subject.id}
                                subject={subject}
                            />
                        )}
                    )}
                </CardList>
            </div>
            <Modal
                isOpen={subjectFormModal}
                onClose={() => setSubjectFormModal(false)}
                title={`Новый предмет`}
            >
                <SubjectForm
                    closeModal={() => setSubjectFormModal(false)}
                />
            </Modal>
        </>
    );
});
