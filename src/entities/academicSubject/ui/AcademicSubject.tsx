import { FC, useContext, useEffect, useState } from 'react'
import { IAcademicSubject, IClassroom } from '@app/types/types'
import { Context } from 'main'
import { Card } from '@features/card/Card'
import { Modal } from '@features/modal/Modal'
import { AcademicSubjectForm } from '@widgets/academicSubjectForm/AcademicSubjectForm'
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction'

interface AcademicSubjectProps {
    academicSubject: IAcademicSubject
}

interface IAcademicSubjectInfo {
    subject: string | undefined;
    teacher: string;
    classrooms: IClassroom[] | undefined;
}

export const AcademicSubject: FC<AcademicSubjectProps> = ({ academicSubject }) => {
    const { classroomStore, subjectStore, teacherStore, academicSubjectStore } = useContext(Context)
    const [academicSubjectFormModal, setAcademicSubjectFormModal] = useState<boolean>(false)
    const [academicSubjectConfirmAction, setAcademicSubjectConfirmAction] = useState<boolean>(false)
    const [classrooms, setClassrooms] = useState<IClassroom[]>()
    const [academicSubjectInfo, setAcademicSubjectInfo] = useState<IAcademicSubjectInfo>({
        subject: '',
        teacher: '',
        classrooms: [],
    })

    useEffect(() => {
        (async () => {
            const teacher = teacherStore.teachers.find(t => t.id === academicSubject.teacherId)
            const fullName = `${teacher?.lastname} ${teacher?.firstname} ${teacher?.surname}`
            setAcademicSubjectInfo({...academicSubjectInfo, teacher: fullName })
            const classrooms = await classroomStore.fetchByAcademicSubject(academicSubject.id)
            setClassrooms(classrooms)
        })()
    }, [academicSubjectStore.groupAcademicSubjects])

    return (
        <>
            <Card
                title={`${subjectStore.subjects.find(s => s.id === academicSubject.name)?.name}`}
                cardText={[
                    `${academicSubjectInfo.teacher}`,
                    `Часов в неделю: ${academicSubject.countHoursPerWeek}`,
                    `Аудитории: ${classrooms?.map(classroom => ' ' + classroom.name)}`,
                    academicSubject.numberOfSubgroup ? `${academicSubject.numberOfSubgroup} подгруппа` : 'Вся группа'
                ]}
                onClickEdit={(e) => {
                    e?.stopPropagation()
                    setAcademicSubjectFormModal(true)
                }
                }
                onClickDelete={(e) => {
                    e?.stopPropagation()
                    setAcademicSubjectConfirmAction(true)}
                }
            >
            </Card>
            <Modal
                size='big'
                isOpen={academicSubjectFormModal}
                onClose={() => setAcademicSubjectFormModal(false)}
                title={`
                        ${subjectStore.subjects.find(s => s.id === academicSubject.name)?.name} | 
                        ${academicSubjectInfo.teacher}
                    `}
            >
                <AcademicSubjectForm
                    academicSubject={academicSubject}
                    closeModal={() => setAcademicSubjectFormModal(false)}
                    groupId={academicSubject.groupId}
                    classrooms={classrooms}
                />
            </Modal>
            <Modal
                isOpen={academicSubjectConfirmAction}
                onClose={() => setAcademicSubjectConfirmAction(false)}
                title='Подтвердить удаление'
            >
                <ConfirmAction
                    onClickConfirm={() => {
                        academicSubjectStore.remove(academicSubject.id)
                        setAcademicSubjectConfirmAction(false)
                    }}
                    onClickCancle={() => setAcademicSubjectConfirmAction(false)}
                />
            </Modal>
        </>
    )
}
