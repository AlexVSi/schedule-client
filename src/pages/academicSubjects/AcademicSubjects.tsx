import React, { useContext, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { IGroup } from '@app/types/types';
import { Button } from '@shared/ui/Button';
import { CardList } from '@features/cardList/CardList';
import { Context } from 'main';
import { Modal } from '@features/modal/Modal';
import { AcademicSubjectForm } from '@widgets/academicSubjectForm/AcademicSubjectForm';
import { AcademicSubject } from '@entities/academicSubject/ui/AcademicSubject';

export const AcademicSubjects = observer(() => {
    const { academicSubjectStore, scheduleStore, groupStore, authStore } = useContext(Context)
    const [selectedGroup, setSelectedGroup] = useState<IGroup['id']>(groupStore.currentGroup);
    const [academicSubjectFormModal, setAcademicSubjectFormModal] = useState<boolean>(false)

    useEffect(() => {
        if (selectedGroup && scheduleStore.currentScheduleId) {
            (async () => {
                await academicSubjectStore.fetchAllByGroupAndSchedule(selectedGroup, scheduleStore.currentScheduleId)
            })()
        }
    }, [selectedGroup])

    return (
        <>
            <div className="space-y-6">
                <div className='flex justify-between align-center'>
                    <h3 className="h3-title">Назначения предметов</h3>
                    {authStore.isAuth &&
                        <Button
                            onClick={() => setAcademicSubjectFormModal(true)}
                        >
                            <Plus />Новое назначение
                        </Button>
                    }
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Выберите группу</label>
                    <select
                        value={selectedGroup}
                        onChange={(e) => {
                            setSelectedGroup(+e.target.value)
                            groupStore.setCurrentGroup(+e.target.value)
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="">Выберите группу</option>
                        {groupStore.groups.map(group => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>
                <CardList>
                    {academicSubjectStore.groupAcademicSubjects.length === 0 && <p>Назначений нет</p>}
                    {academicSubjectStore.groupAcademicSubjects.map(academicSubject =>
                        <AcademicSubject
                            key={academicSubject.id}
                            academicSubject={academicSubject}
                        />
                    )}
                </CardList>
            </div>
            <Modal
                size='big'
                isOpen={academicSubjectFormModal}
                onClose={() => setAcademicSubjectFormModal(false)}
                title='Новое назначение'
            >
                <AcademicSubjectForm
                    closeModal={() => setAcademicSubjectFormModal(false)}
                    groupId={selectedGroup}
                />
            </Modal>
        </>
    )
});
