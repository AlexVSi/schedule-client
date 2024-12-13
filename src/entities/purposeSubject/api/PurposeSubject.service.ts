import { $api } from "@shared/http";
import { IAcademicSubject, IPurposeSubject } from "@app/types/types";
import { AxiosResponse } from "axios";

export default class PurposeSubjectService {
    static async get(id: IPurposeSubject['id']): Promise<AxiosResponse<IPurposeSubject>> {
        return $api.get<IPurposeSubject>(`purpose/get/${id}`)
    }

    static async getByAcademicSubject(academicSubjectId: IAcademicSubject['id']): Promise<AxiosResponse<{ purposeSubjects: IPurposeSubject[] }>> {
        return $api.get<{ purposeSubjects: IPurposeSubject[] }>(`purpose/get/by-subject/${academicSubjectId}`)
    }

    static async add(body: Omit<IPurposeSubject, 'id'>): Promise<AxiosResponse<{ id: IPurposeSubject['id'] }>> {
        return await $api.post<{ id: IPurposeSubject['id'] }>(`purpose/add`, body)
    }

    static async edit(body: Partial<IPurposeSubject>) {
        await $api.put(`purpose/edit/${body.id}`, body)
    }

    static async remove(id: IPurposeSubject['id']) {
        await $api.delete(`purpose/remove/${id}`)
    }
}