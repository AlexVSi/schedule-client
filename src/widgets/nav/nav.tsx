import React, { FC, useState } from 'react'
import { BookOpen, BookOpenCheck, Building2, CalendarPlus, Glasses, LucideIcon, Users, UsersIcon } from 'lucide-react'
import { Link } from 'react-router-dom';
import { Button } from '@shared/ui/Button';

interface ILink {
    id: string
    icon: LucideIcon
    label: string
    link: string
}

export const Nav: FC = () => {
    const [activeTab, setActiveTab] = useState('calendar');

    const links: ILink[] = [
        { id: 'planner', icon: CalendarPlus, label: 'Планировщик', link: '/' },
        { id: 'academic-subject', icon: BookOpenCheck, label: 'Назначение предметов', link: '/academic-subject' },
        { id: 'teachers', icon: Users, label: 'Преподаватели', link: '/teachers' },
        { id: 'subjects', icon: BookOpen, label: 'Предметы', link: '/subjects' },
        { id: 'classrooms', icon: Building2, label: 'Аудитории', link: '/classrooms' },
        { id: 'groups', icon: UsersIcon, label: 'Группы', link: '/groups' },
        { id: 'specialties', icon: Glasses, label: 'Специальности', link: '/specialties' },
    ]

    return (
        <nav className="max-w-7xl mx-auto mb-3">
            <div className="flex flex-wrap gap-3">
                {links.map(({ id, icon: Icon, label, link }) => (
                    <Link key={id} to={link}>
                        <Button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            variant={activeTab === id ? 'selected' : 'unselected'}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {label}
                        </Button>
                    </Link>
                ))}
            </div>
        </nav>
    )
}
