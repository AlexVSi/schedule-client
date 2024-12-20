import React, { FC, useContext, useEffect, useState } from 'react'
import { Card } from '@features/card/Card'
import { IBusyTime, ISubject, ITeacher } from '@app/types/types'
import { CardListItem } from '@features/cardListItem/CardListItem'
import { Modal } from '@features/modal/Modal'
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction'
import { TeacherForm } from '@widgets/teacherForm/TeacherForm'
import { Context } from 'main'
import { observer } from 'mobx-react-lite'

interface TeacherProps {
    teacher: ITeacher
}

export const Teacher: FC<TeacherProps> = observer(({ teacher }) => {
    const { teacherStore, subjectStore } = useContext(Context)
    const [teacherFormModal, setTeacherFormModal] = useState<boolean>(false)
    const [teacherConfirmAction, setTeacherConfirmAction] = useState<boolean>(false)
    const [subjectsForTeacher, setSubjectsForTeacher] = useState<ISubject[]>()
    const [busyTimes, setBusyTimes] = useState<IBusyTime[]>()

    useEffect(() => {
        (async () => {
            const subjects = await subjectStore.fetchSubjectsByTeacher(teacher.id)
            setSubjectsForTeacher(subjects)
            const teacherBusyTimes = await teacherStore.fetchBusyTimesByTeacher(teacher.id)
            setBusyTimes(teacherBusyTimes)
        })()
    }, [teacherFormModal])

    return (
        <>
            <Card
                title={`${teacher.lastname} ${teacher.firstname} ${teacher.surname}`}
                subTitle='Предметы:'
                onClickEdit={() => setTeacherFormModal(true)}
                onClickDelete={() => setTeacherConfirmAction(true)}
            >
                <div className="mt-1 space-y-1">
                    {subjectsForTeacher?.map(subject => (
                        <CardListItem key={subject.id} title={subject.name} />
                    ))}
                </div>
            </Card>

            <Modal
                isOpen={teacherFormModal}
                onClose={() => setTeacherFormModal(false)}
                title={`${teacher.lastname} ${teacher.firstname} ${teacher.surname}`}
                size='big'
            >
                <TeacherForm
                    teacher={teacher}
                    subjects={subjectsForTeacher}
                    busyTimes={busyTimes}
                    closeModal={() => setTeacherFormModal(false)}
                />
            </Modal>
            <Modal
                isOpen={teacherConfirmAction}
                onClose={() => setTeacherConfirmAction(false)}
                title='Подтвердить удаление'
            >
                <ConfirmAction
                    onClickConfirm={() => {
                        teacherStore.remove(teacher.id)
                        setTeacherConfirmAction(false)
                    }}
                    onClickCancle={() => setTeacherConfirmAction(false)}
                />
            </Modal>
        </>
    )
})
