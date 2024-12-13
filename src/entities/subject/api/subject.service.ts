import { $api } from "@shared/http";
import { ISubject, ITeacher } from "@app/types/types";
import { AxiosResponse } from "axios";

export default class SubjectService {
    static async get(id: ISubject['id']): Promise<AxiosResponse<ISubject>> {
        return $api.get<ISubject>(`subject/get/${id}`)
    }

    static async getAll(): Promise<AxiosResponse<{ names: ISubject[] }>> {
        return $api.get<{ names: ISubject[] }>(`subject/name/get/all`)
    }

    static async getSubjectsByTeacher(id: ITeacher['id']): Promise<AxiosResponse<{ names: ISubject[] }>> {
        return $api.get<{ names: ISubject[] }>(`subject/name/get/by-teacher/${id}`)
    }

    static async add(body: Omit<ISubject, 'id'>): Promise<AxiosResponse<{ id: ISubject['id'] }>> {
        return await $api.post<{ id: ISubject['id'] }>(`subject/name/add`, body)
    }

    static async edit(body: Partial<ISubject>) {
        await $api.put<ISubject['id']>(`subject/name/edit/${body.id}`, body)
    }

    static async remove(id: ISubject['id']) {
        await $api.delete<ISubject['id']>(`subject/name/remove/${id}`)
    }
}