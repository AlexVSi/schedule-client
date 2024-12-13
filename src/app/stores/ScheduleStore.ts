import { ISchedule } from "@app/types/types";
import ScheduleService from "@entities/schedule/schedule.service";
import { makeAutoObservable } from "mobx";


export default class ScheduleStore {
    schedules = [] as ISchedule[];
    currentScheduleId = 1 as ISchedule['id'];
    currentScheduleType = 5

    constructor() {
        makeAutoObservable(this)
    }

    setSchedules(schedules: ISchedule[]) {
        this.schedules = schedules
    }

    setCurrentScheduleId(currentScheduleId: ISchedule['id']) {
        this.currentScheduleId = currentScheduleId
    }

    async fetchAllSchedules() {
        try {
            const responce = await ScheduleService.getAll()
            this.setSchedules(responce.data.schedule)
        } catch (e) {
            console.log(e)
        }
    }

    async add(body: Omit<ISchedule, 'id'>) {
        try {
            await ScheduleService.add(body)
        } catch (e) {
            console.log(e);
        }
    }

    async edit(body: Partial<ISchedule>) {
        try {
            await ScheduleService.edit(body)
        } catch (e) {
            console.log(e);
        }
    }

    async remove(id: ISchedule['id']) {
        try {
            await ScheduleService.remove(id)
        } catch (e) {
            console.log(e);
        }
    }
}