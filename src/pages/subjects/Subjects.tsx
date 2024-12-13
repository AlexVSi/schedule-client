import React, { useContext, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '@shared/ui/Button';
import { CardList } from '@features/cardList/CardList';
import { Subject } from '@entities/subject/ui/Subject';
import { Modal } from '@features/modal/Modal';
import { SubjectForm } from '@widgets/subjectForm/SubjectForm';
import { Context } from 'main';

export const Subjects = observer(() => {
    const { subjectStore, teacherStore } = useContext(Context)
    const [subjectFormModal, setSubjectFormModal] = useState<boolean>(false)

    useEffect(() => {
        fetchSubjects()
    }, [])

    async function fetchSubjects() {
        await teacherStore.fetchAllTeachers()
        await subjectStore.fetchAllsubjects()
    }

    return (
        <>
            <div className="space-y-6">
                <div className='flex justify-between align-center'>
                    <h3 className="h3-title">Предметы</h3>
                    <Button
                        onClick={() => setSubjectFormModal(true)}
                    >
                        <Plus />Новый предмет
                    </Button>
                </div>
                <CardList>
                    {subjectStore.subjects.map(subject => {
                        return (
                            <Subject
                                key={subject.id}
                                subject={subject}
                            />
                        )
                    })}
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
