import { makeAutoObservable } from 'mobx';
import { ISchedule, ITimeSlot } from '@app/types/types';
import TimeSlotService from '@entities/timeSlot/api/TimeSlot.service';


export default class TimeSlotStore {

    timeSlots = [] as ITimeSlot[];
    days: { id: number, day: string }[] = [
        { id: 1, day: 'Понедельник' },
        { id: 2, day: 'Вторник' },
        { id: 3, day: 'Среда' },
        { id: 4, day: 'Четверг' },
        { id: 5, day: 'Пятница' },
        { id: 6, day: 'Суббота' },
    ]

    constructor() {
        makeAutoObservable(this)
    }

    setTimeSlots(timeSlots: ITimeSlot[]) {
        this.timeSlots = timeSlots
    }

    async fetchAllBySchedule(id: ISchedule['id']) {
        try {
            const responce = await TimeSlotService.getAllBySchedule(id)
            this.setTimeSlots(responce.data.times)
            return responce.data.times
        } catch (e) {
            console.log(e)
        }
    }

    async fetchTimeSlot(id: ITimeSlot['id']) {
        try {
            const responce = await TimeSlotService.get(id)
            return responce.data
        } catch (e) {
            console.log(e)
        }
    }

    async add(body: Omit<ITimeSlot, 'id'>) {
        try {
            await TimeSlotService.add(body)
            // this.fetchAllTimeSlots()
        } catch (e) {
            console.log(e);
            console.log(body);
        }
    }

    async edit(body: Partial<ITimeSlot>) {
        try {
            await TimeSlotService.edit(body)
            // this.fetchAllTimeSlots()
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: ITimeSlot['id']) {
        try {
            await TimeSlotService.remove(id)
            this.setTimeSlots(this.timeSlots.filter(t => t.id !== id))
        } catch (e) {
            console.log(e);
        }
    }
}