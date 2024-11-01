import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  ChevronLeft,
  ChevronRight,
  Users,
  UserCircle,
  LogOut,
  Settings,
  Shield
} from 'lucide-react';
import { userStore } from '@app/stores/UserStore';
import { Button } from '../shared/ui/Button';
import { Modal } from '../features/modal/Modal';
import { LoginForm } from './LoginForm';
import { AdminManagement } from './AdminManagament';
import { UserProfile } from './UserProfile';

export const Sidebar = observer(() => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-4 bg-white border border-gray-200 rounded-full p-1 shadow-sm"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <div className="p-4 space-y-4">
          {userStore.currentUser ? (
            <>
              <div className="flex items-center space-x-3 mb-6">
                <img
                  src={userStore.currentUser.avatar}
                  alt={userStore.currentUser.name}
                  className="w-10 h-10 rounded-full"
                />
                {isExpanded && (
                  <div>
                    <div className="font-medium">{userStore.currentUser.name}</div>
                    <div className="text-sm text-gray-500">{userStore.currentUser.email}</div>
                  </div>
                )}
              </div>

              <nav className="space-y-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowProfileModal(true)}
                  className={`w-full justify-start ${!isExpanded && 'justify-center'}`}
                >
                  <UserCircle className="w-5 h-5 mr-3" />
                  {isExpanded && 'Профиль'}
                </Button>

                {userStore.currentUser.role === 'admin' && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdminModal(true)}
                    className={`w-full justify-start ${!isExpanded && 'justify-center'}`}
                  >
                    <Shield className="w-5 h-5 mr-3" />
                    {isExpanded && 'Администраторы'}
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className={`w-full justify-start ${!isExpanded && 'justify-center'}`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  {isExpanded && 'Настройки'}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => userStore.logout()}
                  className={`w-full justify-start ${!isExpanded && 'justify-center'}`}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  {isExpanded && 'Выйти'}
                </Button>
              </nav>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => setShowLoginModal(true)}
              className={`w-full justify-start ${!isExpanded && 'justify-center'}`}
            >
              <Users className="w-5 h-5 mr-3" />
              {isExpanded && 'Войти'}
            </Button>
          )}
        </div>
      </div>

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Вход в систему"
      >
        <LoginForm />
      </Modal>

      <Modal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        title="Управление администраторами"
      >
        <AdminManagement />
      </Modal>

      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Профиль пользователя"
      >
        <UserProfile />
      </Modal>
      </>)})