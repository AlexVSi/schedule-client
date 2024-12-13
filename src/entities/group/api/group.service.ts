import {$api} from "@shared/http";
import { IGroup } from "@app/types/types";
import { AxiosResponse } from "axios";

export default class GroupService {
    static async get(id: IGroup['id']): Promise<AxiosResponse<IGroup>> {
        return $api.get<IGroup>(`group/get/${id}`)
    }

    static async getAll(): Promise<AxiosResponse<{ group: IGroup[] }>> {
        return $api.get<{ group: IGroup[] }>(`group/get/all`)
    }

    static async add(body: Omit<IGroup, 'id'>): Promise<AxiosResponse<IGroup['id']>> {
        return await $api.post<IGroup['id']>(`group/add`, body)
    }

    static async edit(body: Partial<IGroup>) {
        await $api.put(`group/edit/${body.id}`, body)
    }

    static async remove(id: IGroup['id']) {
        await $api.delete(`group/remove/${id}`)
    }
}