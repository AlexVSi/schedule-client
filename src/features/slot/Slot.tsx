import { ITimeSlot } from '@app/types/types';
import { format } from 'date-fns';
import React, { FC } from 'react'

interface SlotProps {
    timeSlot: ITimeSlot
}

export const Slot: FC<SlotProps> = ({ timeSlot }) => {

    const currentDate = format(day, 'yyyy-MM-dd');
    const [hour] = time.split(':');
    const slotPurpose = groupPurposes.filter(purpose => {
        const timeSlot = timeSlotStore.timeSlots.find(t => t.id === purpose.timeSlotId)
        const eventDate = format(timeSlot!.startTime, 'yyyy-MM-dd');
        
        const eventHour = format(timeSlot!.startTime, 'H');
        return eventDate === currentDate && eventHour === hour;
    });


    return (
        <div
            key={`${currentDate}-${time}`}
            className={`bg-white p-2 border-t border-gray-200 min-h-[100px] cursor-pointer hover:bg-blue-50 transition-colors
        ${selectedSlot && format(selectedSlot.date, 'yyyy-MM-dd') === currentDate && selectedSlot.time === time ? 'bg-blue-100' : ''}`}
            onClick={() => handleSlotClick(selectTimeSlot!)}
        >
            {slotPurpose.map(purpose => (
                <SlotPurpose
                    purpose={purpose}
                />
            ))}
            {!slotPurpose.length && group && (
                <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                    <Plus className="w-6 h-6 text-blue-400" />
                </div>
            )}
        </div>
    )
}
