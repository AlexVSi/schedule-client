import { $api } from "@shared/http";
import { ISchedule, ITimeSlot } from "@app/types/types";
import { AxiosResponse } from "axios";

export default class TimeSlotService {
    static async get(id: ITimeSlot['id']): Promise<AxiosResponse<ITimeSlot>> {
        return $api.get<ITimeSlot>(`time-slots/get/${id}`)
    }

    static async getAllBySchedule(id: ISchedule['id']): Promise<AxiosResponse<{ times: ITimeSlot[] }>> {
        return $api.get<{ times: ITimeSlot[] }>(`time-slots/get/by-schedule/${id}`)
    }

    static async add(body: Omit<ITimeSlot, 'id'>): Promise<AxiosResponse<ITimeSlot['id']>> {
        return await $api.post<ITimeSlot['id']>(`time-slots/add`, body)
    }

    static async edit(body: Partial<ITimeSlot>) {
        await $api.put(`time-slots/edit/${body.id}`, body)
    }

    static async remove(id: ITimeSlot['id']) {
        await $api.delete(`time-slots/remove/${id}`)
    }
}