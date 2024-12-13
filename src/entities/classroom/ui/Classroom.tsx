import React, { FC, useContext, useState } from 'react'
import { Card } from '@features/card/Card'
import { IClassroom } from '@app/types/types'
import { Modal } from '@features/modal/Modal'
import { ClassroomForm } from '@widgets/classroomForm/ClassroomForm'
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction'
import { scheduleStore } from '@app/stores/ScheduleStore.old'
import { Context } from 'main'

interface ClassroomProps {
    classroom: IClassroom
}

export const Classroom: FC<ClassroomProps> = ({ classroom }) => {
    const { classroomStore } = useContext(Context)
    const [classroomFormModal, setClassroomFormModal] = useState(false)
    const [classroomConfirmAction, setClassroomConfirmAction] = useState(false)

    return (
        <>
            <Card
                title={`Аудитория ${classroom.name}`}

                onClickEdit={() => setClassroomFormModal(true)}
                onClickDelete={() => setClassroomConfirmAction(true)}
            >
                <div className="text-sm text-gray-500">
                    Тип: {classroomStore.classroomTypes.find(type => type.id === classroom.type)?.name}
                </div>
                <div className="text-sm text-gray-500">
                    Вместимость: {classroom.capacity}
                </div>
            </Card>
            <Modal
                isOpen={classroomFormModal}
                onClose={() => setClassroomFormModal(false)}
                title={`Аудитория ${classroom.name}`}
            >
                <ClassroomForm
                    classroom={classroom}
                    closeModal={() => setClassroomFormModal(false)}
                />
            </Modal>
            <Modal
                isOpen={classroomConfirmAction}
                onClose={() => setClassroomConfirmAction(false)}
                title='Подтвердить удаление'
            >
                <ConfirmAction
                    onClickConfirm={() => {
                        classroomStore.remove(classroom.id)
                        setClassroomConfirmAction(false)
                    }}
                    onClickCancle={() => setClassroomConfirmAction(false)}
                />
            </Modal>
        </>
    )
}
