import React, { FC, useContext, useEffect, useState } from 'react'
import { IBusyTime, ISubject, ITeacher } from '@app/types/types';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/Input';
import { Context } from 'main';
import { SelectList } from '@features/selectList/SelectList';
import { differenceSets } from '@shared/utils/differenceSets';
import { BusyTimeForm } from '@widgets/busyTimeForm/BusyTimeForm';
import { CardList } from '@features/cardList/CardList';
import { BusyTime } from '@entities/busyTime/BusyTime';
import { observer } from 'mobx-react-lite';

interface TeacherFormProps {
    teacher?: ITeacher
    subjects?: ISubject[]
    busyTimes?: IBusyTime[]
    closeModal: (flag: boolean) => void
}

export const TeacherForm: FC<TeacherFormProps> = observer(({ teacher, subjects, busyTimes, closeModal }) => {
    const { teacherStore, subjectStore } = useContext(Context)
    const [formData, setFormData] = useState<Omit<ITeacher, 'id'>>(teacher ? {
        lastname: teacher.lastname,
        firstname: teacher.firstname,
        surname: teacher.surname,
    } :
        {
            lastname: '',
            firstname: '',
            surname: '',
        });
    const [teacherBusyTimes, setTeacherBusyTimes] = useState<IBusyTime[]>([])

    const allSubjectList = createSelectList(subjectStore.subjects)
    const defaultSelectedSubjectList = createSelectedList()
    const [selectedSubjectList, setSelectedSubjectList] = useState<ISubject['id'][]>(defaultSelectedSubjectList.map(s => { return s.id }))

    useEffect(() => {
        if (busyTimes) {
            setTeacherBusyTimes(busyTimes)
        }
    }, [])

    function createSelectList(array: Array<any>) {
        const selectList = [] as { id: number; itemLabel: string }[]
        array.map(item => {
            selectList.push({ id: item.id, itemLabel: item.name })
        })
        return selectList
    }

    function createSelectedList() {
        const selectedList: { id: number; itemLabel: string }[] = []
        if (subjects) {
            subjects.map(s => {
                selectedList.push({ id: s.id, itemLabel: s.name })
            })
        }
        return selectedList
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (teacher?.id) {
            setFormData(formData);
            teacherStore.edit({ id: teacher?.id, ...formData });

            const removedSubject = differenceSets<number>(defaultSelectedSubjectList.map(s => { return s.id }), selectedSubjectList)
            const addedSubject = differenceSets<number>(selectedSubjectList, defaultSelectedSubjectList.map(s => { return s.id }))

            for (let i of removedSubject) {
                await teacherStore.removeSubject(teacher?.id, i)
            }
            for (let i of addedSubject) {
                await teacherStore.addSubject(teacher?.id, i)
            }
        } else {
            const id = await teacherStore.add(formData);
            for (let i of selectedSubjectList) {
                if (id) {
                    await teacherStore.addSubject(id, i)
                }
            }
        }
        closeModal(false)
    };

    const handleSelectionChange = (selectedItems: { id: number; itemLabel: string }[]) => {
        setSelectedSubjectList(selectedItems.map(i => i.id))
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className='space-y-4'>
                <div className='flex gap-4'>
                    <div className='space-y-4 w-1/3'>
                        <Input
                            label='Фамилия'
                            type='text'
                            name='lastname'
                            value={formData.lastname}
                            onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                            required
                        />

                        <Input
                            label='Имя'
                            type='text'
                            name='firstname'
                            value={formData.firstname}
                            onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                            required
                        />

                        <Input
                            label='Отчество'
                            type='text'
                            name='surename'
                            value={formData.surname}
                            onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                            required
                        />

                    </div>

                    <SelectList
                        label='Предметы'
                        items={allSubjectList}
                        mode='multiple'
                        onSelectionChange={handleSelectionChange}
                        defaultListItems={defaultSelectedSubjectList}
                        search={true}
                    >
                    </SelectList>
                </div>

                {teacher?.id && <div className='flex gap-4 justify-between'>
                    <div className='space-y-4 w-1/3'>
                        <p>Методическое время</p>
                        <BusyTimeForm
                            teacherId={teacher.id}
                            onAdd={(newBusyTime: IBusyTime) => {setTeacherBusyTimes([...teacherBusyTimes, newBusyTime])}}
                        />
                    </div>
                    <div className='w-full'>
                        <CardList search={false}>
                            {teacherBusyTimes.map(bt => (
                                <BusyTime
                                    key={bt.id}
                                    busyTime={bt}
                                    onDelete={(id: IBusyTime['id']) => {setTeacherBusyTimes(teacherBusyTimes.filter(bt => bt.id !== id))}}
                                />
                            ))}
                        </CardList>
                    </div>
                </div>}
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
                        closeModal(false)
                    }}
                >
                    Отменить
                </Button>
            </div>
        </form>
    )
})
