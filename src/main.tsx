import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import GroupStore from '@app/stores/GroupStore.ts'
import TeacherStore from '@app/stores/TeacherStore.ts'
import SpecialityStore from '@app/stores/SpecialityStore.ts'
import ClassroomStore from '@app/stores/ClassroomStore.ts'
import SubjectStore from '@app/stores/SubjectStore.ts'
import AcademicSubjectStore from '@app/stores/AcademicSubjectStore.ts'
import ScheduleStore from '@app/stores/ScheduleStore.ts'
import PurposeSubjectStore from '@app/stores/PurposeSubjectStore.ts'
import TimeSlotStore from '@app/stores/TimeSlotStore.ts'
import AuthStore from '@app/stores/AuthStore.ts'

export interface ContextState {
    scheduleStore: ScheduleStore,
    groupStore: GroupStore,
    teacherStore: TeacherStore,
    specialityStore: SpecialityStore,
    classroomStore: ClassroomStore,
    subjectStore: SubjectStore,
    academicSubjectStore: AcademicSubjectStore,
    purposeSubjectStore: PurposeSubjectStore,
    timeSlotStore: TimeSlotStore,
    authStore: AuthStore,
}

const scheduleStore = new ScheduleStore()
const groupStore = new GroupStore()
const teacherStore = new TeacherStore()
const specialityStore = new SpecialityStore()
const classroomStore = new ClassroomStore()
const subjectStore = new SubjectStore()
const academicSubjectStore = new AcademicSubjectStore()
const purposeSubjectStore = new PurposeSubjectStore()
const timeSlotStore = new TimeSlotStore()
const authStore = new AuthStore()

export const Context = createContext<ContextState>({
    scheduleStore, groupStore, teacherStore, specialityStore, classroomStore, subjectStore, academicSubjectStore, purposeSubjectStore, timeSlotStore, authStore
})

ReactDOM.createRoot(document.getElementById('root')!).render(

    <React.StrictMode>
        <Context.Provider value={{
            scheduleStore, groupStore, teacherStore, specialityStore, classroomStore, subjectStore, academicSubjectStore, purposeSubjectStore, timeSlotStore, authStore
        }}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Context.Provider>
    </React.StrictMode >
)
