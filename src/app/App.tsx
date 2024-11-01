import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './layout';
import { Calendar } from '@pages/calendar';
import { Planner } from '@pages/planner';
import { Classrooms } from '@pages/classrooms/Classrooms';
import { Teachers } from '@pages/teachers/Teachers';
import { Groups } from '@pages/groups/Groups';
import { Subjects } from '@pages/subjects/Subjects';
import { CourseAssignments } from '@pages/courseAssignments/CourseAssignmentForm';
import { Specialties } from '@pages/specialties/Specialties';

const App = () => {
  return (
      <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Calendar />}/>
          <Route path='/planner' element={<Planner />}/>
          <Route path='/classrooms' element={<Classrooms />}/>
          <Route path='/teachers' element={<Teachers />}/>
          <Route path='/groups' element={<Groups />}/>
          <Route path='/subjects' element={<Subjects />}/>
          <Route path='/assignments' element={<CourseAssignments />}/>
          <Route path='/specialties' element={<Specialties />}/>
          <Route path='*' element={<h1>Error</h1>}/>
        </Route>
      </Routes>
      </>
  )
};

export default App;
