import React, { useState } from 'react';
import { Calendar, GraduationCap, Users, Building2, BookOpen, CalendarPlus, UsersIcon, BookOpenCheck } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { TeacherForm } from 'components/TeacherForm';
import { SubjectForm } from 'components/SubjectForm';
import { ClassroomForm } from 'components/ClassroomForm';
import { GroupForm } from 'components/GroupForm';
import { WeeklySchedule } from 'components/WeeklySchedule';
import { SchedulePlanner } from 'components/SchedulePlanner';
import { CourseAssignmentForm } from 'components/CourseAssignmentForm';
import { Sidebar } from 'components/Sidebar';
import { LoginForm } from 'components/LoginForm';
import { Modal } from '@features/modal/Modal';
import { userStore } from './stores/UserStore';

const AppSrc = observer(() => {
  const [activeTab, setActiveTab] = useState('calendar');
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg border-b border-blue-100 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <GraduationCap className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  Расписание занятий
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Sidebar />

      <main className={`pt-16 transition-all duration-300 ml-64`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex space-x-4 mb-6 flex-wrap gap-y-2">
            {[
              { id: 'calendar', icon: Calendar, label: 'Календарь' },
              { id: 'planner', icon: CalendarPlus, label: 'Планировщик' },
              { id: 'assignments', icon: BookOpenCheck, label: 'Назначение предметов' },
              { id: 'groups', icon: UsersIcon, label: 'Группы' },
              { id: 'teachers', icon: Users, label: 'Преподаватели' },
              { id: 'subjects', icon: BookOpen, label: 'Предметы' },
              { id: 'classrooms', icon: Building2, label: 'Аудитории' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-102 shadow-md'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-xl p-6 backdrop-blur-xl bg-white/90 border border-blue-100">
            {activeTab === 'calendar' && <WeeklySchedule />}
            {activeTab === 'planner' && <SchedulePlanner />}
            {activeTab === 'assignments' && <CourseAssignmentForm />}
            {activeTab === 'groups' && <GroupForm />}
            {activeTab === 'teachers' && <TeacherForm />}
            {activeTab === 'subjects' && <SubjectForm />}
            {activeTab === 'classrooms' && <ClassroomForm />}
          </div>
        </div>
      </main>

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Вход в систему"
      >
        <LoginForm />
      </Modal>
    </div>
  );
});

export default AppSrc;
