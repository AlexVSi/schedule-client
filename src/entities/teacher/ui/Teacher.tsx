import { FC, useContext, useEffect, useState } from 'react'
import { Card } from '@features/card/Card'
import { IBusyTime, ISubject, ITeacher } from '@app/types/types'
import { CardListItem } from '@features/cardListItem/CardListItem'
import { Modal } from '@features/modal/Modal'
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction'
import { TeacherForm } from '@widgets/teacherForm/TeacherForm'
import { Context } from 'main'
import { observer } from 'mobx-react-lite'
import { CardList } from '@features/cardList/CardList'
import { BusyTime } from '@entities/busyTime/BusyTime'

interface TeacherProps {
    teacher: ITeacher
}

export const Teacher: FC<TeacherProps> = observer(({ teacher }) => {
    const { teacherStore, subjectStore, timeSlotStore, authStore } = useContext(Context)
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
    }, [teacherStore.teachers])

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
                {busyTimes?.length !== 0 && authStore.isAuth &&
                <div className='flex flex-wrap'>
                    <p className='font-medium mt-3 mb-2'>Методическое время</p>
                    <CardList search={false}>
                        {busyTimes?.map(bt => (
                            <div className='p-2 border rounded'>
                                <p>{timeSlotStore.days.find(d => d.id === bt.dayOfWeek)?.day}</p>
                                <p>
                                    {String(new Date(bt.startTime).getUTCHours()).padStart(2, '0')}:{String(new Date(bt.startTime).getUTCMinutes()).padStart(2, '0')}
                                    –
                                    {String(new Date(bt.endTime).getUTCHours()).padStart(2, '0')}:{String(new Date(bt.endTime).getUTCMinutes()).padStart(2, '0')}
                                </p>
                            </div>
                        ))}
                    </CardList>
                </div>}
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
