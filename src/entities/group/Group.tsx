import React, { FC, useState } from 'react'
import { Button } from '@shared/ui/Button';
import { Pencil, Trash2 } from 'lucide-react';
import { scheduleStore } from '@app/stores/ScheduleStore';

interface GroupProps {
    id: string;
    name: React.ReactNode;
    studentsCount: number;
    handle: (id: string) => void
}

export const Group: FC<GroupProps> = ({ id, studentsCount, name, handle }) => {
    // const [editingId, setEditingId] = useState<string | null>(null);
    // const [formData, setFormData] = useState({
    //     name: '',
    //     studentsCount: '',
    // });

    // const handleEdit = (id: string) => {
    //     const group = scheduleStore.groups.find(g => g.id === id);
    //     if (group) {
    //         setEditingId(id);
    //         setFormData({
    //             name: group.name,
    //             studentsCount: group.studentsCount.toString(),
    //         });
    //     }
    // };

    return (
        <div
            key={id}
            className="bg-white shadow-sm rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
            <div className="font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">
                {studentsCount} студентов
            </div>
            <div className="text-sm text-gray-500">
                Специальность {studentsCount}
            </div>
            <div className="mt-4 flex space-x-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handle(id)}
                >
                    <Pencil className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scheduleStore.removeGroup(id)}
                >
                    <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
            </div>
        </div>
    )
}
