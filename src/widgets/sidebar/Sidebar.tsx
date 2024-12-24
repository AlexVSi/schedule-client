import { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
    ChevronLeft,
    ChevronRight,
    Users,
    UserCircle,
    LogOut,
    Settings,
    Shield,
    User2Icon,
    CalendarDays
} from 'lucide-react';
import { Button } from '@shared/ui/Button';
import { Modal } from '@features/modal/Modal';
import { LoginForm } from '@widgets/loginForm/LoginForm';
import { UserProfile } from '@widgets/userProfile/UserProfile';
import { AdminManagement } from '@widgets/adminManagement/AdminManagament';
import { Context } from 'main';
import { ScheduleForm } from '@widgets/scheduleForm/ScheduleForm';
import { ScheduleModal } from '@widgets/scheduleModal/ScheduleModal';

export const Sidebar = observer(() => {
    const { authStore } = useContext(Context)
    const [isExpanded, setIsExpanded] = useState(true);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <nav>
            <div
                className={`relative left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-16'
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
                    {authStore.user.login ? (
                        <>
                            <div className="flex items-center space-x-3 mb-6">
                                <User2Icon />
                                {isExpanded && (
                                    <div>
                                        <div className="text-sm text-gray-500">{authStore.user.login}</div>
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

                                <Button
                                    variant="ghost"
                                    onClick={() => setShowAdminModal(true)}
                                    className={`w-full justify-start ${!isExpanded && 'justify-center'}`}
                                >
                                    <Shield className="w-5 h-5 mr-3" />
                                    {isExpanded && 'Администраторы'}
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => setShowScheduleModal(true)}
                                    className={`w-full justify-start ${!isExpanded && 'justify-center'}`}
                                >
                                    <CalendarDays className="w-5 h-5 mr-3" />
                                    {isExpanded && 'Расписания'}
                                </Button>

                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start ${!isExpanded && 'justify-center'}`}
                                >
                                    <Settings className="w-5 h-5 mr-3" />
                                    {isExpanded && 'Настройки'}
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => authStore.logout()}
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
                <LoginForm
                    closeModal={() => setShowLoginModal(false)}
                />
            </Modal>

            <Modal
                isOpen={showAdminModal}
                onClose={() => setShowAdminModal(false)}
                title="Управление администраторами"
            >
                <AdminManagement />
            </Modal>

            <Modal
                isOpen={showScheduleModal}
                onClose={() => setShowScheduleModal(false)}
                title="Расписания"
                size='big'
            >
                <ScheduleModal />
            </Modal>

            <Modal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                title="Профиль пользователя"
            >
                <UserProfile />
            </Modal>
        </nav>
        )
    })