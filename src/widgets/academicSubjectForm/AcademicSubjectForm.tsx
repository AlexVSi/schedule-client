import React, { FC, useContext, useEffect, useState } from 'react'
import { IAcademicSubject, IClassroom } from '@app/types/types';
import { IncorrectSpoiler } from '@features/incorrectSpoiler/IncorrectSpoiler';
import { SelectList } from '@features/selectList/SelectList';
import { RadioGroup, Radio } from '@headlessui/react';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { differenceSets } from '@shared/utils/differenceSets';
import { CheckIcon } from 'lucide-react';
import { Context } from 'main';
import { RadioItem } from '@shared/ui/RadioItem';

interface GroupFormProps {
    academicSubject?: IAcademicSubject
    closeModal: (flag: boolean) => void
    groupId: number
    classrooms?: IClassroom[]
}

export const AcademicSubjectForm: FC<GroupFormProps> = ({ academicSubject, closeModal, groupId, classrooms }) => {
    const { academicSubjectStore, subjectStore, teacherStore, classroomStore, scheduleStore } = useContext(Context)
    const [formData, setFormData] = useState<Omit<IAcademicSubject, 'id'>>(academicSubject ? {
        name: academicSubject.name,
        countHoursPerWeek: academicSubject.countHoursPerWeek,
        numberOfSubgroup: academicSubject.numberOfSubgroup,
        schedulesId: academicSubject.schedulesId,
        groupId: academicSubject.groupId,
        teacherId: academicSubject.teacherId,
    } :
    {
        name: 0,
        countHoursPerWeek: 1,
        numberOfSubgroup: 0,
        schedulesId: scheduleStore.currentScheduleId,
        groupId: groupId,
        teacherId: 0,
    });
    const [incorrect, setIncorrect] = useState({
        name: false,
        teacherId: false,
        classroomList: false
    })

    const groupType = [
        { value: 0, type: 'Вся группа' },
        { value: 1, type: 'I подгруппа' },
        { value: 2, type: 'II подгруппа' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        if (!groupId) {
            alert('Пожалуйста, выберите группу');
            return;
        }
        e.preventDefault();
        if (academicSubject?.id) {
            setFormData(formData);
            academicSubjectStore.edit({ id: academicSubject.id, ...formData });

            const removedClassroom = differenceSets(defaultSelectedClassroomList.map(c => {return c.id}), classroomList)
            const addedClassroom = differenceSets(classroomList, defaultSelectedClassroomList.map(c => {return c.id}))

            for (let i of removedClassroom) {
                await classroomStore.removeSubject(i, academicSubject.id)
            }

            for (let i of addedClassroom) {
                await classroomStore.addSubject(i, academicSubject.id)
            }

        } else {
            if (!formData.name) {
                setIncorrect({...incorrect, name: true})
                return
            }
            if (!formData.teacherId) {
                setIncorrect({...incorrect, teacherId: true})
                return
            }
            if (!classroomList) {
                setIncorrect({...incorrect, classroomList: true})
                return
            }
            const academicSubjectId = await academicSubjectStore.add(formData);
            for (let i of classroomList) {
                await classroomStore.addSubject(i, academicSubjectId!)
            }

        }
        closeModal(false)
    };

    const [teachersSubjectList, setTeachersSubjectList] = useState<{ id: number; itemLabel: string }[]>([])
    useEffect(() => {
        if (formData.name) {
            fetchTeachers()
        }
    }, [formData.name])

    async function fetchTeachers() {
        const response = await teacherStore.fetchTeachersBySubject(formData.name)
        if (response) {
            setTeachersSubjectList(response.map(item => {
                return { id: item.id, itemLabel: `${item.lastname} ${item.firstname} ${item.surname}` }
            }))
        } else {
            setTeachersSubjectList(createSelectList([]))
        }
    }

    const allSubjectList = createSelectList(subjectStore.subjects)
    const allClassroomList = createSelectList(classroomStore.classrooms)
    const defaultSelectedClassroomList = createSelectedList()
    const [classroomList, setClassroomList] = useState<IClassroom['id'][]>(defaultSelectedClassroomList.map(c => {return c.id}))
    const teacher = teacherStore.teachers.find( t => t.id === academicSubject?.teacherId)
    const defaultSelectedTeacher: { id: number; itemLabel: string } | null = teacher ? { id: teacher!.id, itemLabel: `${teacher?.lastname} ${teacher?.firstname} ${teacher?.surname}`} : null


    function createSelectList(array: Array<any>) {
        const selectList = [] as { id: number; itemLabel: string }[]
        array.map(item => {
            selectList.push({ id: item.id, itemLabel: item.name })
        })
        return selectList
    }

    function createSelectedList() {
        const selectedList: { id: number; itemLabel: string }[] = []
        if (classrooms) {
            classrooms.map(c => {
                selectedList.push({ id: c.id, itemLabel: c.name })
            })
        }
        return selectedList
    }

    const handleSubjectSelectionChange = (selectedItems: { id: number; itemLabel: string }[]) => {
        selectedItems.map(i => setFormData({...formData, name: i.id}))
    };

    const handleTeacherSelectionChange = (selectedItems: { id: number; itemLabel: string }[]) => {
        selectedItems.map(i => setFormData({...formData, teacherId: i.id}))
    };

    const handleClassroomsSelectionChange = (selectedItems: { id: number; itemLabel: string }[]) => {
        setClassroomList(selectedItems.map(c => c.id))
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className='flex w-full justify-between gap-4'>
                <div className='w-1/2 flex flex-col gap-4'>
                    {incorrect.name && <IncorrectSpoiler>Выберите предмет</IncorrectSpoiler>}
                    <SelectList
                        label='Предмет'
                        items={allSubjectList}
                        onSelectionChange={handleSubjectSelectionChange}
                        defaultListItems={allSubjectList.filter(s => s.id === academicSubject?.name)}
                        search={true}
                    >
                    </SelectList>
                    <RadioGroup value={formData.numberOfSubgroup} onChange={(val) => setFormData({ ...formData, numberOfSubgroup: val })} aria-label="Server size" className="space-y-2">
                        <p>Тип группы</p>
                        {groupType.map((type, i) => (
                            <RadioItem
                                key={i}
                                value={type.value}
                                item={type.type}
                            />
                        ))}
                    </RadioGroup>

                </div>
                <div className='w-1/2 flex flex-col gap-4'>
                    {incorrect.teacherId && <IncorrectSpoiler>Выберите преподавателя</IncorrectSpoiler>}
                    <SelectList
                        label='Преподаватель'
                        items={teachersSubjectList ? teachersSubjectList : []}
                        onSelectionChange={handleTeacherSelectionChange}
                        defaultListItems={defaultSelectedTeacher ? [defaultSelectedTeacher] : []}
                    >
                    </SelectList>
                    {incorrect.classroomList && <IncorrectSpoiler>Выберите аудиторию</IncorrectSpoiler>}
                    <SelectList
                        label='Аудитории'
                        items={allClassroomList}
                        defaultListItems={defaultSelectedClassroomList}
                        mode='multiple'
                        onSelectionChange={handleClassroomsSelectionChange}
                        search={true}
                    >
                    </SelectList>
                    <Input
                        label='Часов в неделю'
                        type='number'
                        name='countHoursPerWeek'
                        min={1}
                        value={formData.countHoursPerWeek}
                        onChange={(e) => setFormData({ ...formData, countHoursPerWeek: +e.target.value })}
                        required
                    />
                </div>
            </div>
            <div className="flex space-x-4">
                <Button
                    type="submit"
                    className="flex-1"
                >
                    Сохранить
                </Button>
                <Button
                    type="reset"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                        // setFormData({ name: '', capacity: 0, type: 0 });
                        closeModal(false)
                    }}
                >
                    Отменить
                </Button>
            </div>
        </form>
    )
}
