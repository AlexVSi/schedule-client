import { AxiosResponse } from "axios";
import { $api } from "@shared/http";
import { IAcademicSubject, IGroup, ISchedule } from "@app/types/types";

export default class AcademicSubjectService {
    static async get(id: IAcademicSubject['id']): Promise<AxiosResponse<IAcademicSubject>> {
        return $api.get<IAcademicSubject>(`group/get/${id}`)
    }

    static async getAll(): Promise<AxiosResponse<{ subjects: IAcademicSubject[] }>> {
        return $api.get<{ subjects: IAcademicSubject[] }>(`group/get/all`)
    }

    static async getAllBySchedule(id: ISchedule['id']): Promise<AxiosResponse<{ subjects: IAcademicSubject[] }>> {
        return $api.get<{ subjects: IAcademicSubject[] }>(`group/subject/get/all-by-schedule/${id}`)
    }

    static async getAllByGroupAndSchedule(groupId: IGroup['id'], scheduleId: ISchedule['id']): Promise<AxiosResponse<{ subjects: IAcademicSubject[] }>> {
        return $api.get<{ subjects: IAcademicSubject[] }>(`subject/get/all-by-group-and-schedule/${groupId}/${scheduleId}`)
    }

    static async add(body: Omit<IAcademicSubject, 'id'>): Promise<AxiosResponse<{ id: IAcademicSubject['id'] }>> {
        return await $api.post<{ id: IAcademicSubject['id'] }>(`subject/add`, body)
    }

    static async edit(body: Partial<IAcademicSubject>) {
        await $api.put(`subject/edit/${body.id}`, body)
    }

    static async remove(id: IAcademicSubject['id']) {
        await $api.delete(`subject/remove/${id}`)
    }
}
