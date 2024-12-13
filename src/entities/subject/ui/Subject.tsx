import React, { FC, useContext, useEffect, useState } from 'react'
import { CardListItem } from '@features/cardListItem/CardListItem';
import { Card } from '@features/card/Card';
import { ISubject, ITeacher } from '@app/types/types';
import { Modal } from '@features/modal/Modal';
import { SubjectForm } from '@widgets/subjectForm/SubjectForm';
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction';
import { Context } from 'main';

interface SubjectProps {
    subject: ISubject
}

export const Subject: FC<SubjectProps> = ({ subject }) => {
    const { subjectStore, teacherStore } = useContext(Context)
    const [subjectFormModal, setSubjectFormModal] = useState<boolean>(false)
    const [subjectConfirmAction, setSubjectConfirmAction] = useState<boolean>(false)
    const [subjectsForTeacher, setSubjectsForTeacher] = useState<ITeacher[]>()

    useEffect(() => {
        fetchSubjectByTeacher()
    }, [])

    async function fetchSubjectByTeacher() {
        const response = await teacherStore.fetchTeachersBySubject(subject.id)
        setSubjectsForTeacher(response)
    }

    return (
        <>
            <Card
                title={subject.name}
                subTitle='Преподаватели:'
                onClickEdit={() => setSubjectFormModal(true)}
                onClickDelete={() => setSubjectConfirmAction(true)}
            >
                <div className="mt-1 space-y-1">
                    {subjectsForTeacher?.map(teacher => (
                        <CardListItem key={teacher.id} title={`${teacher.lastname} ${teacher.firstname} ${teacher.surname}`} />
                    ))}
                </div>
            </Card>
            <Modal
                isOpen={subjectFormModal}
                onClose={() => setSubjectFormModal(false)}
                title={subject.name}
            >
                <SubjectForm
                    subject={subject}
                    closeModal={() => setSubjectFormModal(false)}
                />
            </Modal>
            <Modal
                isOpen={subjectConfirmAction}
                onClose={() => setSubjectConfirmAction(false)}
                title='Подтвердить удаление'
            >
                <ConfirmAction
                    onClickConfirm={() => {
                        subjectStore.remove(subject.id)
                        setSubjectConfirmAction(false)
                    }}
                    onClickCancle={() => setSubjectConfirmAction(false)}
                />
            </Modal>
        </>
    )
}
