import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from 'main';
import { Calendar } from '@widgets/calendar/Calendar';
import { IGroup, IPurposeSubject } from '@app/types/types';

export const Planner = observer(() => {
    const { scheduleStore, groupStore, academicSubjectStore, purposeSubjectStore } = useContext(Context)
    const [selectedGroup, setSelectedGroup] = useState<IGroup['id']>(groupStore.currentGroup);
    const [groupPurposes, setGroupPurposes] = useState<IPurposeSubject[]>([])
    const [weekType, setWeekType] = useState<number>(0)

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
                setGroupPurposes(purposes)
                purposeSubjectStore.setGroupPurposeSubjects(purposes)
            })()
            groupStore.setCurrentGroup(selectedGroup)
        }
    }, [selectedGroup])

    return (
        <>
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Выберите группу</label>
                <select
                    value={selectedGroup}
                    onChange={(e) => {
                        setSelectedGroup(+e.target.value)
                        groupStore.setCurrentGroup(+e.target.value)
                    }
                    }
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
        </>
    )
});