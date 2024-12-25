import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from 'main';
import { Calendar } from '@widgets/calendar/Calendar';
import { IGroup, IPurposeSubject } from '@app/types/types';

export const Planner = observer(() => {
    const { scheduleStore, groupStore, academicSubjectStore, purposeSubjectStore, subjectStore, authStore } = useContext(Context)
    const [selectedGroup, setSelectedGroup] = useState<IGroup['id']>(groupStore.currentGroup);
    const [checkCountHoursPerWeek, setCheckCountHoursPerWeek] = useState<{ id: number, shortage: number }[]>([])

    useEffect(() => {
        if (selectedGroup) {
            (async () => {
                await academicSubjectStore.fetchAllByGroupAndSchedule(selectedGroup, scheduleStore.currentScheduleId)
                const purposes: IPurposeSubject[] = []
                for (let i of academicSubjectStore.groupAcademicSubjects) {
                    const purpose = await purposeSubjectStore.fetchByAcademicSubject(i.id)
                    if (purpose) {
                        for (let j of purpose) {
                            purposes.push(j)
                        }
                    }
                }
                purposeSubjectStore.setGroupPurposeSubjects(purposes)
            })()
        }
    }, [selectedGroup, scheduleStore.currentScheduleId])

    useEffect(() => {
        (async () => {
            const luckOfHours = []
            for (let i of academicSubjectStore.groupAcademicSubjects) {
                const res = await academicSubjectStore.checkCountHoursPerWeek(i)
                if (res.shortage) {
                    luckOfHours.push(res)
                }
            }
            setCheckCountHoursPerWeek(luckOfHours)
        })()
    }, [purposeSubjectStore.groupPurposeSubjects])

    return (
        <>
            <div className="mb-6">
                <h1 className="block text-xl font-medium text-gray-700 mb-8">Планнировщик</h1>
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
            {selectedGroup !== 0 &&
                <Calendar
                    group={selectedGroup}
                />}
            <div>
                {authStore.isAuth &&
                    <>
                        {
                            checkCountHoursPerWeek.length === 0 ?
                                <h2 className='text-xl my-5 green-500 text-green-500'>Замечаний нет</h2> :
                                <h2 className='text-xl my-5'>Замечания</h2>
                        }
                        {checkCountHoursPerWeek.map((h, i) => (
                            <p key={i}>Не хватает {h.shortage} {h.shortage === 1 ? 'часа' : 'часов'} для предмета «{subjectStore.subjects.find(s => s.id === h.id)?.name}»</p>
                        ))}
                    </>
                }
            </div>
        </>
    )
});
