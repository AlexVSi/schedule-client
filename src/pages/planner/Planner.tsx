import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import type { IAcademicSubject, IPurposeSubject } from '@app/types/types';
import { Context } from 'main';
import { Calendar } from '@widgets/calendar/Calendar';

export const Planner = observer(() => {
    const { scheduleStore, groupStore, academicSubjectStore, purposeSubjectStore } = useContext(Context)
    const [selectedGroup, setSelectedGroup] = useState<number>(groupStore.currentGroup);
    const [groupPurposes, setGroupPurposes] = useState<IPurposeSubject[]>([])
    const [academicSubjects, setAcademicSubjects] = useState<IAcademicSubject[]>([])
    const [weekType, setWeekType] = useState<number>(0)

    useEffect(() => {
        groupStore.fetchAllGroups()
        // classroomStore.fetchAllClassrooms()
        // subjectStore.fetchAllsubjects()
        // teacherStore.fetchAllTeachers()
    }, [])

    async function fetchGroupPurpose() {
        const purposes: IPurposeSubject[] = []
        for (let i of academicSubjects) {
          const purpose = await purposeSubjectStore.fetchAllPurposeSubjects(i.id)
          if (purpose) {
            for (let j of purpose)
            purposes.push(j)
          }
        }
        setGroupPurposes(purposes)
      }

      useEffect(() => {
        fetchAcademicSubjects()
        fetchGroupPurpose()
        groupStore.setCurrentGroup(selectedGroup)
      }, [selectedGroup])
    
      async function fetchAcademicSubjects() {
        if (selectedGroup) {
          await academicSubjectStore.fetchAllByGroupAndSchedule(+selectedGroup, scheduleStore.currentScheduleId)
          setAcademicSubjects(academicSubjectStore.groupAcademicSubjects)
        }
      }

    // return (
    //   <PlannerOld />
    // )

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
            <Calendar
                groupPurposes={groupPurposes}
                group={selectedGroup}
            />
        </>
    )
});