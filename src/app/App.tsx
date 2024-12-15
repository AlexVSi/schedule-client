import React, { createContext, useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './layout';
import { Planner } from '@pages/planner';
import { Classrooms } from '@pages/classrooms/Classrooms';
import { Teachers } from '@pages/teachers/Teachers';
import { Groups } from '@pages/groups/Groups';
import { Subjects } from '@pages/subjects/Subjects';
import { AcademicSubjects } from '@pages/academicSubjects/AcademicSubjects';
import { Specialties } from '@pages/specialties/Specialties';
import { Context } from 'main';

const scheduleContext = createContext<string>('')

const App = () => {
  const [schedule, setSchedule] = useState('')
  const { authStore, specialityStore, teacherStore, classroomStore, groupStore, subjectStore, scheduleStore, timeSlotStore } = useContext(Context)

  useEffect(() => {
    if (localStorage.getItem('token')) {
        authStore.checkAuth()
    }
    (async () => {
      await specialityStore.fetchAllSpecialities()
      await teacherStore.fetchAllTeachers()
      await classroomStore.fetchAllClassrooms()
      await groupStore.fetchAllGroups()
      await subjectStore.fetchAllsubjects()
      await timeSlotStore.fetchAllBySchedule(scheduleStore.currentScheduleId)
    })()
}, [])

  return (
      <>
      <scheduleContext.Provider value={schedule}>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Planner />}/>
          <Route path='/classrooms' element={<Classrooms />}/>
          <Route path='/teachers' element={<Teachers />}/>
          <Route path='/groups' element={<Groups />}/>
          <Route path='/subjects' element={<Subjects />}/>
          <Route path='/academic-subject' element={<AcademicSubjects />}/>
          <Route path='/specialties' element={<Specialties />}/>
          <Route path='*' element={<h1>Error</h1>}/>
        </Route>
      </Routes>
      </scheduleContext.Provider>
      </>
  )
};

export default App;
