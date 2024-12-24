import { $api } from "@shared/http";
import { ISchedule } from "@app/types/types";
import { AxiosResponse } from "axios";

export default class ScheduleService {
    static async get(id: ISchedule['id']): Promise<AxiosResponse<ISchedule>> {
        return $api.get<ISchedule>(`schedule/get/${id}`)
    }

    static async getAll(): Promise<AxiosResponse<{ schedule: ISchedule[]}>> {
        return $api.get<{schedule: ISchedule[]}>(`schedule/get/all`)
    }

    static async getOnlyPublic(): Promise<AxiosResponse<{ schedule: ISchedule[]}>> {
        return $api.get<{schedule: ISchedule[]}>(`schedule/get/only-public`)
    }

    static async add(body: Omit<ISchedule, 'id'>): Promise<AxiosResponse<{ id: ISchedule['id'] }>> {
        return await $api.post<{ id: ISchedule['id'] }>(`schedule/add`, body)
    }

    static async edit(body: Partial<ISchedule>) {
        await $api.put(`schedule/edit/${body.id}`, body)
    }

    static async setPublic(id: ISchedule['id'], isPublic: ISchedule['isPublic']) {
        await $api.patch(`schedule/${id}/set-public/${isPublic}`)
    }

    static async remove(id: ISchedule['id']) {
        await $api.delete(`schedule/remove/${id}`)
    }
}