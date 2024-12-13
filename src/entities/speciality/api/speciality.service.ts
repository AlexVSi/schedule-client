import { $api } from "@shared/http";
import { ISpeciality } from "@app/types/types";
import { AxiosResponse } from "axios";

export default class SpecialityService {
    static async get(id: ISpeciality['id']): Promise<AxiosResponse<ISpeciality>> {
        return $api.get<ISpeciality>(`speciality/get/${id}`)
    }

    static async getAll(): Promise<AxiosResponse<{ specialities: ISpeciality[] }>> {
        return $api.get<{ specialities: ISpeciality[] }>(`speciality/get/all`)
    }

    static async add(body: Omit<ISpeciality, 'id'>): Promise<AxiosResponse<ISpeciality['id']>> {
        return await $api.post<ISpeciality['id']>(`speciality/add`, body)
    }

    static async edit(body: Partial<ISpeciality>) {
        await $api.put(`speciality/edit/${body.id}`, body)
    }

    static async remove(id: ISpeciality['id']) {
        await $api.delete(`speciality/remove/${id}`)
    }
}
