import { ISchedule } from "@app/types/types";
import ScheduleService from "@entities/schedule/api/schedule.service";
import { makeAutoObservable } from "mobx";


export default class ScheduleStore {
    schedules = [] as ISchedule[];
    currentScheduleId = 0 as ISchedule['id'];
    
    constructor() {
        makeAutoObservable(this)
    }

    setSchedules(schedules: ISchedule[]) {
        this.schedules = schedules
    }

    setCurrentScheduleId(currentScheduleId: ISchedule['id']) {
        this.currentScheduleId = currentScheduleId
        localStorage.setItem('scheduleId', String(currentScheduleId))
    }

    addSchedule(schedule: ISchedule) {
        this.schedules = [...this.schedules, schedule]
    }

    async fetchAllSchedules() {
        try {
            const responce = await ScheduleService.getAll()
            this.setSchedules(responce.data.schedule)
        } catch (e) {
            console.log(e)
        }
    }

    async fetchOnlyPublic() {
        try {
            const responce = await ScheduleService.getOnlyPublic()
            this.setSchedules(responce.data.schedule)
            this.setCurrentScheduleId(responce.data.schedule[0].id)
        } catch (e) {
            console.log(e);
        }
    }

    async add(body: Omit<ISchedule, 'id'>) {
        try {
            const responce = await ScheduleService.add(body)
            this.addSchedule({ id: responce.data.id, ...body })
            return responce.data.id
        } catch (e) {
            console.log(e);
        }
    }

    async edit(body: Partial<ISchedule>) {
        try {
            await ScheduleService.edit(body)
            this.fetchAllSchedules()
        } catch (e) {
            console.log(e);
        }
    }

    async setPublic(scheduleId: ISchedule['id'], format: ISchedule['isPublic']) {
        try {
            await ScheduleService.setPublic(scheduleId, format)
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: ISchedule['id']) {
        try {
            await ScheduleService.remove(id)
            this.schedules = this.schedules.filter(s => s.id !== id)
        } catch (e) {
            console.log(e);
        }
    }
}