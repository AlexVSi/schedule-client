import React, { FC, useContext, useEffect, useState } from 'react'
import { IAcademicSubject, IClassroom, ITimeSlot } from '@app/types/types'
import { Context } from 'main'
import { Card } from '@features/card/Card'
import { Modal } from '@features/modal/Modal'
import { AcademicSubjectForm } from '@widgets/academicSubjectForm/AcademicSubjectForm'
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction'
import { PurposeForm } from '@widgets/purposeForm/PurposeForm'

interface AcademicSubjectProps {
    academicSubject: IAcademicSubject
    openPurposeForm?: boolean
    timeSlot?: ITimeSlot
}

interface IAcademicSubjectInfo {
    subject: string | undefined;
    teacher: string;
    classrooms: IClassroom[] | undefined;
}

export const AcademicSubject: FC<AcademicSubjectProps> = ({ academicSubject, openPurposeForm = false, timeSlot }) => {
    const { classroomStore, subjectStore, teacherStore, academicSubjectStore } = useContext(Context)
    const [academicSubjectFormModal, setAcademicSubjectFormModal] = useState<boolean>(false)
    const [academicSubjectConfirmAction, setAcademicSubjectConfirmAction] = useState<boolean>(false)
    const [purposeFormModal, setPurposeFormModal] = useState<boolean>(false)
    const [classrooms, setClassrooms] = useState<IClassroom[]>()
    const [academicSubjectInfo, setAcademicSubjectInfo] = useState<IAcademicSubjectInfo>({
        subject: '',
        teacher: '',
        classrooms: [],
    })

    useEffect(() => {
        getTeacherFullName()
        fetchData()
    }, [])


    function getTeacherFullName() {
        const teacher = teacherStore.teachers.find(t => t.id === academicSubject.teacherId)
        const fullName = `${teacher?.lastname} ${teacher?.firstname} ${teacher?.surname}`
        setAcademicSubjectInfo({...academicSubjectInfo, teacher: fullName })
    }

    async function fetchData() {
        const classrooms = await classroomStore.fetchByAcademicSubject(academicSubject.id)
        setClassrooms(classrooms)
    }

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
                    e.stopPropagation()
                    setAcademicSubjectFormModal(true)
                }
                }
                onClickDelete={(e) => {
                    e.stopPropagation()
                    setAcademicSubjectConfirmAction(true)}
                }
                onCLick={() => setPurposeFormModal(true)}
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

            {openPurposeForm && timeSlot && <Modal
                isOpen={purposeFormModal}
                onClose={() => setPurposeFormModal(false)}
                title={'Событие'}
            >
                <PurposeForm
                    academicSubject={academicSubject}
                    closeModal={() => setPurposeFormModal(false)}
                    classrooms={classrooms ? classrooms : []}
                    timeSlot={timeSlot}
                />
            </Modal>}
        </>
    )
}
