import { useContext, useState } from 'react'
import { Schedule } from '@entities/schedule/ui/Schedule'
import { CardList } from '@features/cardList/CardList'
import { ScheduleForm } from '@widgets/scheduleForm/ScheduleForm'
import { Context } from 'main'
import { observer } from 'mobx-react-lite'
import { Button } from '@shared/ui/Button'
import { Plus } from 'lucide-react'
import { Modal } from '@features/modal/Modal'


export const ScheduleModal = observer(() => {
    const { scheduleStore, authStore } = useContext(Context)
    const [teacherFormModal, setTeacherFormModal] = useState<boolean>(false)

    return (
        <>
            {authStore.isAuth &&
                <Button
                    onClick={() => setTeacherFormModal(true)}
                >
                    <Plus />Новое расписание
                </Button>
            }
            <div className='flex gap-5 pt-5'>
                <div>
                    <CardList
                        search={false}
                    >
                        {scheduleStore.schedules.map(s => (
                            <Schedule
                                key={s.id}
                                schedule={s}
                            />
                        ))}
                    </CardList>
                </div>
            </div>
            <Modal
                isOpen={teacherFormModal}
                onClose={() => setTeacherFormModal(false)}
                title={`Новое расписание`}
            >
                <ScheduleForm
                    closeModal={() => setTeacherFormModal(false)}
                />
            </Modal>
        </>
    )
})
