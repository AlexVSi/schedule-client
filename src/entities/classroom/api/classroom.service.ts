import { AxiosResponse } from 'axios'
import { $api } from "@shared/http";
import { IAcademicSubject, IClassroom } from "@app/types/types";

export default class ClassroomService {
    static async get(id: IClassroom['id']): Promise<AxiosResponse<IClassroom>> {
        return await $api.get<IClassroom>(`classroom/get/${id}`)
    }

    static async getAll(): Promise<AxiosResponse<{ rooms: IClassroom[] }>> {
        return await $api.get<{ rooms: IClassroom[] }>(`classroom/get/all`)
    }

    static async getByAcademicSubject(id: IAcademicSubject['id']): Promise<AxiosResponse<{ rooms: IClassroom[] }>> {
        return await $api.get<{ rooms: IClassroom[] }>(`classroom/get/by-subject/${id}`)
    }

    static async add(body: Omit<IClassroom, 'id'>): Promise<AxiosResponse<IClassroom['id']>> {
        return await $api.post<IClassroom['id']>(`classroom/add`, body)
    }

    static async edit(body: Partial<IClassroom>) {
        await $api.put<IClassroom['id']>(`classroom/edit/${body.id}`, body)
    }

    static async remove(id: IClassroom['id']) {
        await $api.delete<IClassroom['id']>(`classroom/remove/${id}`)
    }

    static async GetTypes(): Promise<AxiosResponse<{ classrooms: IClassroom[] }>> {
        return await $api.get<{ classrooms: IClassroom[] }>(`classroom/type/get/all`)
    }

    static async addSubject(classroomId: IClassroom['id'], academicSubjectId: IAcademicSubject['id']): Promise<AxiosResponse<IAcademicSubject['id']>> {
        return await $api.post<IAcademicSubject['id']>(`classroom/${classroomId}/add-subject/${academicSubjectId}`)
    }

    static async removeSubject(classroomId: IClassroom['id'], academicSubjectId: IAcademicSubject['id']) {
        await $api.delete<IAcademicSubject['id']>(`classroom/${classroomId}/remove-subject/${academicSubjectId}`)
    }
}
