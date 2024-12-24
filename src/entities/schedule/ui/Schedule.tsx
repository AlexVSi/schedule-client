import React, { FC, useContext, useState } from 'react'
import { Card } from '@features/card/Card'
import { ISchedule } from '@app/types/types'
import { Context } from 'main'
import { Modal } from '@features/modal/Modal'
import { ConfirmAction } from '@widgets/confirmAction/ConfirmAction'
import { observer } from 'mobx-react-lite'
import { ScheduleForm } from '@widgets/scheduleForm/ScheduleForm'

interface ScheduleProps {
    schedule: ISchedule
}

export const Schedule: FC<ScheduleProps> = observer(({ schedule }) => {
    const { scheduleStore } = useContext(Context)
    const [scheduleConfirmAction, setScheduleConfirmAction] = useState<boolean>(false)
    const [scheduleFormModal, setScheduleFormModal] = useState<boolean>(false)

    return (
        <>
            <Card
                title={schedule.name}
                subTitle={schedule.isPublic ? 'Публичное' : 'Скрытое'}
                isCurrent={scheduleStore.currentScheduleId === schedule.id}
                onCLick={() => scheduleStore.setCurrentScheduleId(schedule.id)}
                onClickEdit={(e) => {
                    e?.stopPropagation()
                    setScheduleFormModal(true)
                }}
                onClickDelete={(e) => {
                    e?.stopPropagation()
                    setScheduleConfirmAction(true)
                }}
            >
            </Card>
            <Modal
                title='Расписание'
                isOpen={scheduleFormModal}
                onClose={() => setScheduleFormModal(false)}
            >
                <ScheduleForm
                    schedule={schedule}
                    closeModal={setScheduleFormModal}
                />
            </Modal>
            <Modal
                title='Удаление расписания приведет к необратимой потере данных'
                isOpen={scheduleConfirmAction}
                onClose={() => setScheduleConfirmAction(false)}
            >
                <ConfirmAction
                    onClickConfirm={() => {
                        scheduleStore.remove(schedule.id)
                        setScheduleConfirmAction(false)
                    }}
                    onClickCancle={() => setScheduleConfirmAction(false)}
                />
            </Modal>
        </>
    )
})
