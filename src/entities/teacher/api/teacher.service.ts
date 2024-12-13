import { $api } from "@shared/http";
import { ISubject, ITeacher } from "@app/types/types";
import { AxiosResponse } from "axios";

export default class TeacherService {
    static async get(id: ITeacher['id']): Promise<AxiosResponse<{ teacher: ITeacher }>> {
        return $api.get<{ teacher: ITeacher }>(`teacher/type/${id}`)
    }

    static async getAll(): Promise<AxiosResponse<{ teachers: ITeacher[] }>> {
        return $api.get<{ teachers: ITeacher[] }>(`teacher/get/all`)
    }

    static async getTeachersBySubject(id: ISubject['id']): Promise<AxiosResponse<{ teachers: ITeacher[] }>> {
        return $api.get<{ teachers: ITeacher[] }>(`/teacher/get/by-subject/${id}`)
    }

    static async add(body: Omit<ITeacher, 'id'>): Promise<AxiosResponse<{ id: ITeacher['id'] }>> {
        return await $api.post<{ id: ITeacher['id'] }>(`teacher/add`, body)
    }

    static async addSubject(teacherId: ITeacher['id'], subjectId: ISubject['id']): Promise<AxiosResponse<ITeacher['id']>> {
        return await $api.post<ITeacher['id']>(`teacher/${teacherId}/add-subject/${subjectId}`)
    }

    static async removeSubject(teacherId: ITeacher['id'], subjectId: ISubject['id']): Promise<AxiosResponse<ITeacher['id']>> {
        return await $api.delete<ITeacher['id']>(`teacher/${teacherId}/remove-subject/${subjectId}`)
    }

    static async edit(body: Partial<ITeacher>) {
        await $api.put<ITeacher['id']>(`teacher/edit/${body.id}`, body)
    }

    static async remove(id: ITeacher['id']) {
        await $api.delete<ITeacher['id']>(`teacher/remove/${id}`)
    }
}